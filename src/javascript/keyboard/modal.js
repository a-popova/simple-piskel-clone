export default function modalHandle() {
  const buttonKeyboard = document.querySelector('.keyboard');
  const modal = document.getElementById('modal');
  const span = document.getElementsByClassName('close')[0];
  let element;
  let isClicked = false;

  const clickedKey = document.querySelectorAll('.modal-body li span:nth-child(2)');

  function highlightShortcut(clickedElement) {
    element = clickedElement;
    isClicked = true;
    element.style.color = 'gray';
    element.style.borderStyle = 'dashed';
  }
  clickedKey.forEach((key) => key.addEventListener('click', (event) => highlightShortcut(event.target)));

  function changeShortcut(event) {
    if (isClicked) {
      let key = document.querySelector(`span[data-code=${event.code}]`);
      if (key) {window.alert("This shortcut already exists. Please, select another one!"); return;}
      const keyValueString = event.code.toString();
      const keyValue = keyValueString.slice(keyValueString.length - 1);
      element.innerHTML = keyValue;
      element.setAttribute('data-code', event.code);
      element.style.color = 'white';
      element.style.borderStyle = 'solid';
      isClicked = false;
    }
  }

  document.body.addEventListener('keypress', (event) => {changeShortcut(event)});

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
