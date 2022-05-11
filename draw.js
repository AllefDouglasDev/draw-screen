const canvas = document.querySelector("canvas");
const shouldCleanInput = document.querySelector("#should-clean");
const colorInput = document.querySelector("#color");
const lineWidthInput = document.querySelector("#line-width");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let x = 0;
let y = 0;
let drawing = false;
let shouldClean = true;
let clearCanvasTimeout = null;
let lineWidth = 10;
let lineColor = "#0095DD";

function onKeyDown(event) {
  if (event.code === "Escape") {
    clearTimeoutAndCanvas();
  }
}

function onMouseDown(event) {
  drawing = true;
}

function onMouseUp(event) {
  drawing = false;
  x = 0;
  y = 0;
}

function onMouseMove(event) {
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
    }, 2000);
  }
}

function onShouldCleanChange(event) {
  shouldClean = event.target.checked;
  if (shouldClean) {
    clearTimeoutAndCanvas();
  }
}

function clearTimeoutAndCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  clearTimeout(clearCanvasTimeout);
}

function onColorChange(event) {
  lineColor = event.target.value;
}

function onLineWidthChange(event) {
  lineWidth = event.target.value;
}

window.addEventListener("keydown", onKeyDown);
canvas.addEventListener("mouseup", onMouseUp);
canvas.addEventListener("mousedown", onMouseDown);
canvas.addEventListener("mousemove", onMouseMove);
shouldCleanInput.addEventListener("change", onShouldCleanChange);
colorInput.addEventListener("change", onColorChange);
lineWidthInput.addEventListener("change", onLineWidthChange);
