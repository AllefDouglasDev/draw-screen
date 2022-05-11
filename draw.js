const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drawing = false;
let x = 0;
let y = 0;

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

  const ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.arc(event.offsetX, event.offsetY, 1, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
  ctx.moveTo(x, y);
  ctx.strokeStyle = "#0095DD";
  ctx.lineWidth = 5;
  ctx.lineTo(event.offsetX, event.offsetY);
  ctx.stroke();

  x = event.offsetX;
  y = event.offsetY;
}

canvas.addEventListener("mouseup", onMouseUp);
canvas.addEventListener("mousedown", onMouseDown);
canvas.addEventListener("mousemove", onMouseMove);
