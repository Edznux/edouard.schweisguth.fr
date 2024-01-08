const canvas = document.getElementById('lyfe-canvas');
const ctx = canvas.getContext('2d');

const overflow = 200
const overflow_x = overflow
const overflow_y = overflow
const angle = 2 * Math.PI / 6;
const radius = 50;

var number_of_hex = (canvas.width + overflow_x / (radius*2)) * (canvas.height + overflow_y / (radius*2))
var hex_colors = {}

function generate_colors(){
    var color = ""
    for(var i = 0; i < number_of_hex; i++) {
        color = "#1D1E28"
        if(Math.random() > 0.7){
          color = "#1D1D1D"
        }
        hex_colors[i] = color
    }
    console.log(hex_colors)
}

function drawHexagon(x, y, color) {
  ctx.beginPath();
  for (var i = 0; i < 6; i++) {
    x_pos = x + radius * Math.cos(angle * i)
    y_pos = y + radius * Math.sin(angle * i)
    ctx.lineTo(x_pos, y_pos);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.stroke();
}

function drawHexGrid(width, height) {
  offset_start_x = overflow_x / 2;
  offset_start_y = overflow_y / 2;
  count = 0;
  for (let y = radius; y + radius * Math.sin(angle) < height; y += radius * Math.sin(angle)) {
    for (let x = radius, j = 0; x + radius * (1 + Math.cos(angle)) < width; x += radius * (1 + Math.cos(angle)), y += (-1) ** j++ * radius * Math.sin(angle)) {
    count++;
      drawHexagon(x-offset_start_x, y-offset_start_y, hex_colors[count]);
    }
  }
}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    drawHexGrid(canvas.width + overflow, canvas.height+ overflow);
    window.requestAnimationFrame(draw);
}

generate_colors()
window.requestAnimationFrame(draw);
