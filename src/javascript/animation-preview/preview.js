const getFrames = () => {
  const frames = document.querySelectorAll('.frame');
  return frames;
};

let count = 0;

function draw(frame) {
  const preview = document.getElementById('preview');
  const ctx = preview.getContext('2d');
  const canvasSize = localStorage.getItem('canvasSize');

  const imageURL = frame.toDataURL();
  const img = new Image();
  img.src = imageURL;
  img.onload = () => {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.drawImage(img, 0, 0, canvasSize, canvasSize);
  };
}

let lastFrame = 0;

const startAnimation = (currentTime) => {
  const slider = document.getElementById('myRange');
  const currentFPS = slider.value;
  const intervalForFrame = 1000 / currentFPS;
  if (currentTime - lastFrame > intervalForFrame) {
    const frames = getFrames();
    const frame = frames[count % frames.length];
    draw(frame);
    count += 1;
    lastFrame = currentTime;
  }
  requestAnimationFrame(startAnimation);
};

export default startAnimation;
