function setActiveFrame() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const canvasSize = localStorage.getItem('canvasSize');

  const frames = document.querySelectorAll('.frame');
  frames.forEach((frame) => frame.classList.remove('active'));
  const frame = document.querySelector('.frame');
  frame.classList.add('active');

  const imageURL = frame.toDataURL();
  const img = new Image();
  img.src = imageURL;
  img.onload = () => {
    ctx.drawImage(img, 0, 0, canvasSize, canvasSize);
  };
}

function deleteFrame(element) {
  const deleteFrameButtons = document.querySelectorAll('button[name=delete]');
  if (deleteFrameButtons.length > 1) {
    element.remove();
  }
  setActiveFrame();
}

export default deleteFrame;
