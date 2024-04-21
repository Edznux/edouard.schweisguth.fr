const fakeDataInput = {
  seed: 1337,
  rings: [
    {
      entity: [
        {
          posX: 0,
          posY: 0,
          type: "self",
        }
      ]
    },
    {
      entity: [
        {
          posX: 0,
          posY: 0,
          type: "ring1",
        }
      ]
    }
  ],
  environment: {
    c: [{
      value: 450,
      last: 1234678 // timestamp
    }],
    t: [{
      value: 20,
      last: 1234678 // timestamp
    }],
    h: [{
      value: 20,
      last: 1234678 // timestamp
    }],
  },
  capacity: {
    k: {
      "status": "low"
    },
    p: {
      "status": "medium"
    },
    s: {
      "status": "high"
    }
  }
}

var switchCheckbox = document.getElementById("switch-bg");


const canvas = document.getElementById('lyfe-canvas');
const ctx = canvas.getContext('2d');
var COLOR_PALETTE = {};
const CAP_COLOR_PALETTE = {
  low: "#531b1b",
  medium: "#331b53",
  high: "#1b3153"
}
var lastSize = 0;

function drawHexagonGrid(width, height, radius) {
    // not accurate but good enough?
    const hexHeight = ((3/2)*radius)
    const hexWidth = (Math.sqrt(3)*radius)
    const xCount = Math.ceil(height / hexHeight)
    const yCount = Math.ceil(width / hexWidth)
    // console.log(xCount, yCount)
    const Hex = Honeycomb.defineHex({ dimensions: radius, origin: 'topLeft'})
    grid = new Honeycomb.Grid(Hex, Honeycomb.rectangle({ width: yCount, height: xCount}))

    // this adds more generated colors only when required:
    // This is useful for changing windows size
    // We don't really care about truncating the color palette when we size down.
    if (Object.keys(COLOR_PALETTE).length < grid.size) {
      // console.log(grid, COLOR_PALETTE)
      grid.forEach(generateColorsFromEachHex);
    }
    // am I inverting the x and y coordinate system somewhere? :notlikethis:
    var capKCell = {"x": width - hexWidth, "y": height - hexHeight, color: CAP_COLOR_PALETTE[fakeDataInput.capacity.k.status]}
    var capPCell = {"x": width - (hexWidth*2) , "y": height - hexHeight, color: CAP_COLOR_PALETTE[fakeDataInput.capacity.p.status]}
    var capSCell = {"x": width - (hexWidth*3) , "y": height - hexHeight, color: CAP_COLOR_PALETTE[fakeDataInput.capacity.s.status]}
    drawUI(grid, capKCell, capPCell, capSCell)
    grid.forEach(drawHex);
}

function drawHex(hex){
  ctx.beginPath();
  ctx.moveTo(hex.corners[0].x, hex.corners[0].y);
  for (let i = 1; i < 6; i++) {
      ctx.lineTo(hex.corners[i].x, hex.corners[i].y);
  }
  ctx.closePath();
  ctx.fillStyle = getColorOfHex(hex)
  ctx.fill();
  ctx.stroke();
}

function getColorOfHex(hex) {
  return getColorOfHexByPalette(hex, COLOR_PALETTE)
}

function getColorOfHexByPalette(hex, pallette) {
  return pallette[hex]
}

function generateColorsFromEachHex(currentHex) {
  generateColors(currentHex, COLOR_PALETTE)
}

function generateColors(currentHex, mapping){
  // generate only the background color once
  if(mapping[currentHex]){
    console.log("already generated color for", currentHex)
    return mapping[currentHex]
  }
  colorA = "#1D1E28"
  colorB = "#1D1D1D"

  color=colorA;
  if(Math.random() > 0.8){
    color = colorB
  }
  mapping[currentHex] = color
}

//https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array#2450976
function shuffle(array) {
  let currentIndex = array.length,  randomIndex;
  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

function main(){
  window.requestAnimationFrame(draw);
}

function draw(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const width =  window.innerWidth;
  const height =  window.innerHeight;
  const radius = 50;
  canvas.width = width;
  canvas.height = height;

  drawHexagonGrid(width, height, radius);
  window.requestAnimationFrame(draw);
}

function drawUI(grid, capKCell, capPCell, capSCell){
  const capKCellHex = grid.pointToHex(
    { x: capKCell.x, y: capKCell.y },
    { allowOutside: true }
  );
  const capPCellHex = grid.pointToHex(
    { x: capPCell.x, y: capPCell.y },
    { allowOutside: true }
  );
  const capSCellHex = grid.pointToHex(
    { x: capSCell.x, y: capSCell.y },
    { allowOutside: true }
  );
  // console.log(capKCell, capPCell, capKCellHex, capPCellHex)

  COLOR_PALETTE[capKCellHex] = capKCell.color
  COLOR_PALETTE[capPCellHex] = capPCell.color
  COLOR_PALETTE[capSCellHex] = capSCell.color
}
 
main()

document.addEventListener('click', (e) => {
  console.log("click", e.clientX, e.clientY)
  clickedHex = grid.pointToHex(
    { x: e.clientX, y: e.clientY },
    { allowOutside: false }
  )
  console.log(clickedHex)
})


// This enables the "visualisation mode" where the content is hidden but some 
// simulation operations are shown and explained
switchCheckbox.addEventListener("click", (e) => {
  console.log(e.target.checked)
  document.getElementsByClassName("posts")[0].style.display = e.target.checked ? "none" : "block"
  document.getElementsByClassName("footer")[0].style.display = e.target.checked ? "none" : "block"
  document.getElementsByClassName("navigation-menu")[0].style.display = e.target.checked ? "none" : "block"
  document.getElementsByClassName("sim-viz-text")[0].style.display = e.target.checked ? "block" : "none"
});