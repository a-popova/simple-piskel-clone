import actions from '../index';
import { fill, chooseColor, drawPencil, enableEraser, enableStroke } from '../index';


function handleShortcut(keyCode) {
  let key = document.querySelector(`span[data-code=${keyCode}]`);
  if (key) {
    let element = key.classList[2];
    actions[element]();
  }
}

export { handleShortcut };