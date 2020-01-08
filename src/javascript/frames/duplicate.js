function duplicateFrame(element) {
  const clickedElem = element;
  const imageURL = clickedElem.firstElementChild.toDataURL();
  const frames = document.querySelectorAll('.frame');
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const canvasSize = localStorage.getItem('canvasSize');

  if (frames.length < 4) {
    frames.forEach((frame) => frame.classList.remove('active'));
    const newFrame = clickedElem.cloneNode(true);
    newFrame.firstElementChild.classList.add('active');
    clickedElem.after(newFrame);

    const canvasFrame = newFrame.firstElementChild;
    const ctxCanvasFrame = canvasFrame.getContext('2d');
    const img = new Image();
    img.src = imageURL;
    img.onload = () => {
      ctxCanvasFrame.drawImage(img, 0, 0, canvasSize, canvasSize);
      ctx.drawImage(img, 0, 0, canvasSize, canvasSize);
    };
  }
}

export default duplicateFrame;
