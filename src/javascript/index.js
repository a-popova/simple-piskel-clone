import '../sass/styles.scss';
import markup from './markup';
import { addFrame, handleFrame } from './frames/add';
import deleteFrame from './frames/delete';
import duplicateFrame from './frames/duplicate';
import startAnimation from './animation-preview/preview';
import fullScreen from './animation-preview/fullScreen';
import modalHandler from './keyboard/modal';
import { handleShortcut } from './keyboard/shortcuts';

let isFillEnabled = false;
let isColorEnabled = false;
let isPencilEnabled = false;
let isEraserEnabled = false;
let isStrokeEnabled = false;
let isMoving = false;
let canvasSize = localStorage.getItem('canvasSize') || 32;
let pixel = 16;

const actions = {
  paintBucket: fill,
  colorPicker: chooseColor,
  pencil: drawPencil,
  eraser: enableEraser,
  stroke: enableStroke,
  addFrame: addFrame,
  deleteFrame: deleteFrame,
  duplicateFrame: duplicateFrame
}

let sizeSmall;
let sizeMedium;
let sizeLarge;
let ctx;
let colorInput;
let colorPicker;
let pixelSizeSlider;
let currentColor;
let prevColor;
let current;
let prev;

function handleAction(clickedElement) {
  const element = clickedElement;
  if (element.tagName === 'CANVAS') {
    handleFrame(element);
  } else if (element.tagName === 'BUTTON' && element.getAttribute('value') === '-') {
    deleteFrame(element.parentElement);
  } else if (element.tagName === 'BUTTON' && element.getAttribute('value') === 'duplicate') {
    duplicateFrame(element.parentElement);
  } else if (element.tagName === 'IMG') {
    duplicateFrame(element.parentElement.parentElement);
  }
}

function loadCanvas() {
  if (localStorage.getItem('canvas')) {
    const imageURL = localStorage.getItem('canvas');
    const img = new Image();
    img.src = imageURL;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvasSize, canvasSize);
    };
  }
}

function updateFrame() {
  const active = document.querySelector('.frame.active');
  const ctxActiveFrame = active.getContext('2d');

  const imageURL = localStorage.getItem('canvas');
  const img = new Image();
  img.src = imageURL;
  img.onload = () => {
    ctxActiveFrame.clearRect(0, 0, canvasSize, canvasSize);
    ctxActiveFrame.drawImage(img, 0, 0, canvasSize, canvasSize);
  };
}

function select(element) {
  let elem = element;
  const string = document.querySelectorAll('.tools .string');
  string.forEach((e) => {
    e.classList.remove('isSelected');
  });
  switch (true) {
    case isColorEnabled:
      elem = colorPicker;
      break;
    case isFillEnabled:
      elem = fillBucket;
      break;
    case isPencilEnabled:
      elem = pencil;
      break;
    case isEraserEnabled:
      elem = eraser;
      break;
    case isStrokeEnabled:
      elem = stroke;
      break;
    default: elem = pencil;
  }
  elem.classList.add('isSelected');
}

function fill() {
  isColorEnabled = false;
  isPencilEnabled = false;
  isEraserEnabled = false;
  isStrokeEnabled = false;
  isFillEnabled = true;
  select(fillBucket);
  localStorage.setItem('tool', 'isFillEnabled');
}


function floodFill(event) {
  if (isFillEnabled) {
    colorInput.classList.add('hide');

    switch (canvasSize) {
      case 32:
        pixel = 16;
        break;
      case 64:
        pixel = 8;
        break;
      case 128:
        pixel = 4;
        break;
      default: pixel = 16;
    }
    let x;
    let y;
    const newColor = currentColor;
    const queue = [];
    if (event.offsetX) {
      x = Math.floor(event.offsetX / pixel);
      y = Math.floor(event.offsetY / pixel);
    }
    const initial = ctx.getImageData(x, y, 1, 1).data;
    const initialColor = `rgb(${initial[0]},${initial[1]},${initial[2]})`;
    if (initialColor === newColor) { return; }
    ctx.fillStyle = newColor;
    ctx.fillRect(x, y, 1, 1);
    queue.push([x, y]);
    const moves = [
      [-1, 0],
      [0, +1],
      [+1, 0],
      [0, -1],
    ];
    while (queue.length) {
      [x, y] = queue[0];
      for (let i = 0; i < moves.length; i += 1) {
        const newX = x + moves[i][0];
        const newY = y + moves[i][1];
        if (newX >= 0 && newX < Math.floor(512 / pixel)
        && newY >= 0 && newY < Math.floor(512 / pixel)) {
          const cell = ctx.getImageData(newX, newY, 1, 1).data;
          const cellColor = `rgb(${cell[0]},${cell[1]},${cell[2]})`;
          if (cellColor === initialColor && cellColor !== newColor) {
            queue.push([newX, newY]);
            ctx.fillRect(newX, newY, 1, 1);
          }
        }
      }
      queue.shift();
    }
  }
  localStorage.setItem('canvas', canvas.toDataURL());
  updateFrame();
}

function chooseColor() {
  isPencilEnabled = false;
  isFillEnabled = false;
  isEraserEnabled = false;
  isStrokeEnabled = false;
  isColorEnabled = true;
  select(colorPicker);
  localStorage.setItem('tool', 'isColorEnabled');
}

function pickColor(event) {
  if (isColorEnabled) {
    switch (canvasSize) {
      case 32:
        pixel = 16;
        break;
      case 64:
        pixel = 8;
        break;
      case 128:
        pixel = 4;
        break;
      default: pixel = 16;
    }

    const x = Math.floor(event.offsetX / pixel);
    const y = Math.floor(event.offsetY / pixel);
    const newColorData = ctx.getImageData(x, y, 1, 1).data;
    const newColor = `rgb(${newColorData[0]},${newColorData[1]},${newColorData[2]})`;
    prev.style.backgroundColor = currentColor;
    currentColor = newColor;
    current.style.backgroundColor = newColor;
  }
  localStorage.setItem('currentColor', currentColor);
  localStorage.setItem('prevColor', prev.style.backgroundColor);
}

function setCurrentColor(newColor) {
  const oldColor = currentColor;
  currentColor = getComputedStyle(newColor).backgroundColor;
  current.style.backgroundColor = currentColor;
  prev.style.backgroundColor = oldColor;
  localStorage.setItem('currentColor', currentColor);
  localStorage.setItem('prevColor', prev.style.backgroundColor);
}

function updateColor(event) {
  const oldColor = currentColor;
  currentColor = event.target.value;
  current.style.backgroundColor = currentColor;
  prev.style.backgroundColor = oldColor;
  localStorage.setItem('currentColor', currentColor);
  localStorage.setItem('prevColor', prev.style.backgroundColor);
}

function drawPencil() {
  isColorEnabled = false;
  isFillEnabled = false;
  isEraserEnabled = false;
  isStrokeEnabled = false;
  isPencilEnabled = true;
  select(pencil);
  localStorage.setItem('tool', 'isPencilEnabled');
}

function draw(event) {
  if (isPencilEnabled) {
    colorInput.classList.add('hide');
    const pixelSize = pixelSizeSlider.value;

    if (!isMoving) return;
    switch (canvasSize) {
      case 32:
        pixel = 16;
        break;
      case 64:
        pixel = 8;
        break;
      case 128:
        pixel = 4;
        break;
      default: pixel = 16;
    }
    const x = Math.floor(event.offsetX / pixel);
    const y = Math.floor(event.offsetY / pixel);
    ctx.fillStyle = currentColor;
    ctx.fillRect(x, y, pixelSize, pixelSize);

    localStorage.setItem('canvas', canvas.toDataURL());
    updateFrame();
  }

  if (isStrokeEnabled) {
    // if (!isMoving) return;
    switch (canvasSize) {
      case 32:
        pixel = 16;
        break;
      case 64:
        pixel = 8;
        break;
      case 128:
        pixel = 4;
        break;
      default: pixel = 16;
    }

    const x = Math.floor(event.offsetX / pixel);
    const y = Math.floor(event.offsetY / pixel);
    const startX = x;
    const startY = y;
    ctx.fillStyle = currentColor;
    ctx.strokeStyle = currentColor;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}

function erase(event) {
  if (isEraserEnabled) {
    colorInput.classList.add('hide');
    const pixelSize = pixelSizeSlider.value;

    if (!isMoving) return;
    switch (canvasSize) {
      case 32:
        pixel = 16;
        break;
      case 64:
        pixel = 8;
        break;
      case 128:
        pixel = 4;
        break;
      default: pixel = 16;
    }

    const x = Math.floor(event.offsetX / pixel);
    const y = Math.floor(event.offsetY / pixel);
    ctx.fillStyle = currentColor;
    ctx.clearRect(x, y, pixelSize, pixelSize);

    localStorage.setItem('canvas', canvas.toDataURL());
    updateFrame();
  }
}

function enableEraser() {
  isColorEnabled = false;
  isFillEnabled = false;
  isPencilEnabled = false;
  isStrokeEnabled = false;
  isEraserEnabled = true;
  select(eraser);
  localStorage.setItem('tool', 'isEraserEnabled');
}

function enableStroke() {
  isColorEnabled = false;
  isFillEnabled = false;
  isPencilEnabled = false;
  isEraserEnabled = false;
  isStrokeEnabled = true;
  select(stroke);
  localStorage.setItem('tool', 'isStrokeEnabled');
}

function changeCanvasSize(element) {
  const elements = document.querySelectorAll('.canvas--switcher input');
  elements.forEach((e) => { e.classList.remove('isSelected'); });
  switch (element) {
    case sizeSmall:
      canvasSize = 32;
      element.classList.add('isSelected');
      break;
    case sizeMedium:
      canvasSize = 64;
      element.classList.add('isSelected');
      break;
    case sizeLarge:
      canvasSize = 128;
      element.classList.add('isSelected');
      break;
    default: canvasSize = 32;
      element.classList.add('isSelected');
  }
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  const frames = document.querySelectorAll('.frame');
  frames.forEach((frame) => {
    const frameElement = frame;
    frameElement.width = canvasSize;
    frameElement.height = canvasSize;
  });
  localStorage.setItem('canvasSize', canvasSize);
}


window.onload = () => {
  const wrapper = document.body.querySelector('.wrapper');
  wrapper.innerHTML = markup;

  const canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  const activeFrame = document.querySelector('.frame.active');
  activeFrame.setAttribute('width', `${canvasSize}`);
  activeFrame.setAttribute('height', `${canvasSize}`);

 

  const framesContainer = document.querySelector('.frames');
  framesContainer.addEventListener('click', (event) => handleAction(event.target));
  const addFrameButton = document.querySelector('input[class=add]');
  addFrameButton.addEventListener('click', () => addFrame());

  const preview = document.getElementById('preview');
  preview.setAttribute('width', `${canvasSize}`);
  preview.setAttribute('height', `${canvasSize}`);
  window.requestAnimationFrame(startAnimation);
  const buttonFullScreen = document.querySelector('button[name=full]');
  buttonFullScreen.addEventListener('click', () => fullScreen());

  const slider = document.getElementById('myRange');
  const value = document.getElementById('fpsValue');
  value.innerHTML = `Value: ${slider.value}`;

  slider.oninput = function () {
    value.innerHTML = `Value: ${this.value}`;
  };

  pixelSizeSlider = document.getElementById('pixelSize');
  const pixelSizeValue = document.getElementById('sizeValue');
  pixelSizeValue.innerHTML = `Pixel size: ${pixelSizeSlider.value}`;

  pixelSizeSlider.oninput = function () {
    pixelSizeValue.innerHTML = `Pixel size: ${this.value}`;
  };

  current = document.querySelector('.currentColor');
  currentColor = current.style.backgroundColor;

  colorInput = document.querySelector('.colors--input');

  prev = document.body.querySelector('.prevColor');
  prevColor = prev.style.backgroundColor;


  if (localStorage.getItem('currentColor') === null) {
    currentColor = '#C4C4C4';
    current.style.backgroundColor = currentColor;
    prevColor = '#41F795';
    prev.style.backgroundColor = prevColor;
  } else {
    currentColor = localStorage.getItem('currentColor');
    current.style.backgroundColor = currentColor;
    prevColor = localStorage.getItem('prevColor');
    prev.style.backgroundColor = prevColor;
  }

  const fillBucket = document.getElementById('fillBucket');
  colorPicker = document.getElementById('chooseColor');
  const pencil = document.getElementById('pencil');
  const eraser = document.getElementById('eraser');
  const stroke = document.getElementById('stroke');

  const sizeSwitcher = document.querySelector('.canvas--switcher');
  sizeSmall = document.querySelector('.canvas--switcher input[class=small]');
  sizeMedium = document.querySelector('.canvas--switcher input[class=medium]');
  sizeLarge = document.querySelector('.canvas--switcher input[class=large]');


  loadCanvas();
  updateFrame();

  modalHandler();
  document.body.addEventListener('keypress', (event) => {
    handleShortcut(event.code);
  });

  canvas.addEventListener('click', (event) => {
    floodFill(event);
    pickColor(event);
  });
  canvas.addEventListener('mousedown', (event) => {
    isMoving = true;
    draw(event);
    erase(event);
  });
  canvas.addEventListener('mousemove', (event) => {
    draw(event);
    erase(event);
  });
  canvas.addEventListener('mouseup', () => {
    isMoving = false;
  });
  canvas.addEventListener('mouseout', () => {
    isMoving = false;
  });


  if (localStorage.getItem('tool') === 'isFillEnabled') {
    fill();
  } else if (localStorage.getItem('tool') === 'isPencilEnabled' || localStorage.getItem('tool') === null) {
    drawPencil();
  } else if (localStorage.getItem('tool') === 'isColorEnabled') {
    chooseColor();
  } else if (localStorage.getItem('tool') === 'isEraserEnabled') {
    enableEraser();
  } else if (localStorage.getItem('tool') === 'isStrokeEnabled') {
    enableStroke();
  }

  prev.addEventListener('click', () => setCurrentColor(prev));
  current.addEventListener('click', () => colorInput.classList.remove('hide'));
  colorInput.addEventListener('input', (event) => updateColor(event));

  sizeSwitcher.addEventListener('click', (event) => changeCanvasSize(event.target));

  if (localStorage.getItem('canvasSize') === null || localStorage.getItem('canvasSize') === '32') {
    changeCanvasSize(sizeSmall);
  } else if (localStorage.getItem('canvasSize') === '64') {
    changeCanvasSize(sizeMedium);
  } else if (localStorage.getItem('canvasSize') === '128') {
    changeCanvasSize(sizeLarge);
  }


  fillBucket.addEventListener('click', () => {
    fill();
  });
  colorPicker.addEventListener('click', () => {
    chooseColor();
  });
  pencil.addEventListener('click', () => {
    drawPencil();
  });
  eraser.addEventListener('click', () => {
    enableEraser();
  });
  stroke.addEventListener('click', () => {
    enableStroke();
  });
};

window.onbeforeunload = () => {
  const canvas = document.getElementById('canvas');
  localStorage.setItem('canvas', canvas.toDataURL());
};

export { fill, chooseColor, drawPencil, enableEraser, enableStroke };
export default actions;