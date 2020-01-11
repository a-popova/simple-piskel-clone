const markup = `<header class="header">
    <div class="logo">
      <h3>Simple Piskel Clone</h3>
    </div>
  </header>
  <main class="main">
    <div class="column panel">
      <div class="panel--tools">
        <div class="tools">
          <div id="sizeValue"></div>
          <div class="slidecontainer">
            <img class="small" width="15" height="15" src="src/images/size.png">
            <input type="range" min="1" max="4" value="1" class="slider" id="pixelSize">
            <img class="large" width="30" height="30" src="src/images/size.png">
          </div>
          <div class="string" id="fillBucket">
            <img src="src/images/fill-drip.png" alt="fill" title="Paint bucket tool">
          </div>
          <div class="string" id="chooseColor">
            <img src="src/images/icon-upload.png" alt="choose" title="Color picker">
          </div>
          <div class="string" id="pencil">
            <img src="src/images/pencil.png" alt="pencil" title="Pencil">
          </div>
          <div class="string" id="eraser">
            <img src="src/images/eraser.png" alt="eraser" title="Eraser">
          </div>
          <div class="string" id="stroke">
            <img src="src/images/stroke.png" alt="stroke" title="Stroke">
          </div>
        </div>
        <div class="colors">
          <div class="string currentColor">
          </div>
          <div class="colors--input hide">
            <input type="color" id="input" name="input" value="#e66465">
            <label for="head">Select color</label>
          </div>
          <div class="string prevColor">
          </div>
        </div>
      </div>
      <div class="panel--frames">
        <div class="frames">
          <div class="item">
            <canvas class="frame active"></canvas>
            <button type="submit" name="delete" value="-" title="Delete frame" >-</button>
            <button type="submit" name="duplicate" value="duplicate" title="Duplicate" ><img src="src/images/duplicate.png" alt="duplicate"></button>
          </div>
        </div>
        <input type="submit" value="+" title="Add frame" class="add">
      </div>
    </div>
    <div class="column canvas">
      <div class="canvas--field">
        <canvas id="canvas" width="128" height="128"></canvas>
      </div>
      <div class="canvas--switcher">
        <input type="submit" value="32x32" class="small">
        <input type="submit" value="64x64" class="medium">
        <input type="submit" value="128x128" class="large">
      </div>
    </div>
    <div class="column preview">
      <div class="canvasContainer">
        <canvas id="preview"></canvas>
        <button type="submit" name="full" value="full" title="Full screen"><img src="src/images/full-screen.png" alt="full-screen"></button>
        <div class="slidecontainer">
          <span>FPS: 1</span>
          <input type="range" min="1" max="24" value="12" class="slider" id="myRange">
          <span>24</span>
        </div>
        <div id="fpsValue"></div>
      </div>
      <div class="keyboard">
        <img src="src/images/keyboard.png" alt="keyboard" title="Keyboard shotcuts">
      </div>
    </div>
    <div id="modal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <span class="close">&times;</span>
          <h2>Keyboard shortcuts</h2>
        </div>
        <div class="modal-body">
          <div class="column tool--shortcuts">
            <h3>Tool shortcuts</h3>
            <ul>
              <li>
                <div class="shortcut pencil"></div>
                <span class="shortcut key pencil" data-code="KeyP">P</span>
                <span class="pencil">Pencil tool</span>
              </li>
              <li>
                <div class="shortcut bucket"></div>
                <span class="shortcut key paintBucket" data-code="KeyB">B</span>
                <span class="paintBucket">Paint bucket tool</span>
              </li>
              <li>
                <div class="shortcut eraser"></div>
                <span class="shortcut key eraser" data-code="KeyE">E</span>
                <span class="eraser">Eraser tool</span>
              </li>
              <li>
                <div class="shortcut stroke"></div>
                <span class="shortcut key stroke" data-code="KeyS">S</span>
                <span class="stroke">Stroke tool</span>
              </li>
              <li>
                <div class="shortcut colorPicker"></div>
                <span class="shortcut key colorPicker" data-code="KeyC">C</span>
                <span class="colorPicker">Color picker tool</span>
              </li>
            </ul>
          </div>
          <div class="column frame--shortcuts">
            <h3>Frame shortcuts</h3>
            <ul>
            <li>
              <div class="shortcut colorPicker"></div>
              <span class="shortcut key addFrame">Shift + C</span>
              <span class="addFrame">Create frame</span>
            </li>
            <li>
              <div class="shortcut colorPicker"></div>
              <span class="shortcut key deleteFrame">Shift + D</span>
              <span class="deleteFrame">Delete frame</span>
            </li>
            <li>
              <div class="shortcut colorPicker"></div>
              <span class="shortcut key duplicateFrame">Shift + F</span>
              <span class="duplicateFrame">Duplicate frame</span>
            </li>
            </ul>
          </div>
        </div>
        <div class="modal-footer">
          <h2 title="Click on a shortcut to change the key">Customize shortcuts ?</h2>
        </div>
      </div>
    </div>
  </main>`;
export default markup;
