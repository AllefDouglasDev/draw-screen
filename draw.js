const canvas = document.querySelector("canvas");
const shouldCleanInput = document.querySelector("#should-clean");
const colorInput = document.querySelector("#color");
const lineWidthInput = document.querySelector("#line-width");
const toggleMenuBtn = document.querySelector("#toggle-menu");
const menuContent = document.querySelector(".menu-content");
const menuEl = document.querySelector(".menu");
const ctx = canvas.getContext("2d");

const AUTOCLEAN_TIMEOUT = 2000;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let x = 0;
let y = 0;
let drawing = false;
let shouldClean = false;
let clearCanvasTimeout = null;
let lineWidth = 10;
let lineColor = "#0095DD";
let isMenuOpen = true;
let isMenuInMouse = false;
let lastMouseX = 0;
let lastMouseY = 0;
let imageCursor = 0;
let images = []
let imagesDeleted = []

function onKeyDown(event) {
  if (event.code === "Escape") {
    clearTimeoutAndCanvas();
  }
  if (event.code === "Minus") {
    lineWidth -= 1;
    lineWidthInput.value = lineWidth;
  }
  if (event.code === "Equal") {
    lineWidth += 1;
    lineWidthInput.value = lineWidth;
  }
  if (event.code === "KeyM") {
    if (isMenuInMouse) {
      menuEl.style.position = "fixed";
      menuEl.style.top = "auto";
      menuEl.style.left = "auto";
      menuEl.style.bottom = "40px";
      menuEl.style.right = "10px";
    } else {
      menuEl.style.position = "fixed";
      menuEl.style.top = `${lastMouseY}px`;
      menuEl.style.left = `${lastMouseX}px`;
      menuEl.style.bottom = "auto";
      menuEl.style.right = "auto";
      if (!isMenuOpen) {
        toggleMenu();
      }
    }
    isMenuInMouse = !isMenuInMouse;
  }
  if (event.code === "KeyC") {
    clearTimeoutAndCanvas();
  }
  if (event.code === "KeyZ" && event.ctrlKey) {
    undo();
  }
  if (event.code === "KeyY" && event.ctrlKey) {
    redo();
  }
}

function undo() {
  if (images.length > 0) {
    imagesDeleted.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
    ctx.putImageData(images.pop(), 0, 0);
  }
}

function redo() {
  if (imagesDeleted.length > 0) {
    images.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
    ctx.putImageData(imagesDeleted.pop(), 0, 0);
  }
}

function onMouseDown() {
  drawing = true;
  images.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
  imagesDeleted = []
}

function onMouseUp() {
  drawing = false;
  x = 0;
  y = 0;
}

function onMouseMove(event) {
  lastMouseX = event.offsetX;
  lastMouseY = event.offsetY;
  if (!drawing) return;
  if (x === 0 && y === 0) {
    x = event.offsetX;
    y = event.offsetY;
    return;
  }

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(event.offsetX, event.offsetY);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = lineColor;
  ctx.lineCap = "round";
  ctx.fill();
  ctx.stroke();
  ctx.closePath();

  x = event.offsetX;
  y = event.offsetY;

  if (shouldClean) {
    clearTimeout(clearCanvasTimeout);
    clearCanvasTimeout = setTimeout(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, AUTOCLEAN_TIMEOUT);
  }
}

function onShouldCleanChange(event) {
  shouldClean = event.target.checked;
  if (shouldClean) {
    clearTimeoutAndCanvas();
  }
}

function clearTimeoutAndCanvas() {
  images.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
  imagesDeleted = []
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  clearTimeout(clearCanvasTimeout);
}

function onColorChange(event) {
  lineColor = event.target.value;
}

function onLineWidthChange(event) {
  lineWidth = event.target.value;
}

function toggleMenu() {
  menuContent.classList.toggle("hide");
  isMenuOpen = !isMenuOpen;
  if (isMenuOpen) {
    toggleMenuBtn.textContent = "🔽";
  } else {
    toggleMenuBtn.textContent = "🔼";
  }
}

window.addEventListener("keydown", onKeyDown);
canvas.addEventListener("mouseup", onMouseUp);
canvas.addEventListener("mousedown", onMouseDown);
canvas.addEventListener("mousemove", onMouseMove);
shouldCleanInput.addEventListener("change", onShouldCleanChange);
colorInput.addEventListener("change", onColorChange);
lineWidthInput.addEventListener("change", onLineWidthChange);
toggleMenuBtn.addEventListener("click", toggleMenu);
