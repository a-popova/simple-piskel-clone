export default function modalHandle() {
  const buttonKeyboard = document.querySelector('.keyboard');
  const modal = document.getElementById('modal');
  const span = document.getElementsByClassName('close')[0];

  buttonKeyboard.onclick = () => {
    modal.style.display = 'block';
  };

  span.onclick = () => {
    modal.style.display = 'none';
  };

  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };
}
