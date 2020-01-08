function addFrame() {
  const frames = document.querySelectorAll('.frame');
  const items = document.querySelectorAll('.item');
  const lastItem = items[items.length - 1];
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const canvasSize = localStorage.getItem('canvasSize');

  if (frames.length < 4) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    frames.forEach((frame) => frame.classList.remove('active'));
    const newFrame = lastItem.cloneNode(true);
    newFrame.firstElementChild.classList.add('active');
    lastItem.after(newFrame);
  }
}

function handleFrame(element) {
  if (element.classList.contains('active')) { return; }
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const canvasSize = localStorage.getItem('canvasSize');

  const frames = document.querySelectorAll('.frame');
  frames.forEach((frame) => frame.classList.remove('active'));
  element.classList.add('active');

  const imageURL = element.toDataURL();
  const img = new Image();
  img.src = imageURL;
  img.onload = () => {
    ctx.drawImage(img, 0, 0, canvasSize, canvasSize);
  };
}

export { addFrame, handleFrame };
