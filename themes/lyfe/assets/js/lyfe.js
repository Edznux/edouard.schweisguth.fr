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

function Config(){
  this.width =  window.innerWidth;
  this.height =  window.innerHeight;
  
  this.radius = 50;
  this.hexHeight = ((3/2)*this.radius)
  this.hexWidth = (Math.sqrt(3)*this.radius)
  
  this.xCount = Math.ceil(this.height / this.hexHeight)
  this.yCount = Math.ceil(this.width / this.hexWidth)
  this.stepSize = 1/600;
}

const canvas = document.getElementById('lyfe-canvas');
const ctx = canvas.getContext('2d');
var COLOR_PALETTE = {};
const CAP_COLOR_PALETTE = {
  low: "#531b1b",
  medium: "#331b53",
  high: "#1b3153",
}
const THEME_COLOR =  "#78E2A0"
var lastSize = 0;

function drawHexagonGrid(config) {
    // console.log(xCount, yCount)
    const Hex = Honeycomb.defineHex({ dimensions: config.radius, origin: 'topLeft'})
    grid = new Honeycomb.Grid(Hex, Honeycomb.rectangle({ width: config.yCount, height: config.xCount}))

    // this adds more generated colors only when required:
    // This is useful for changing windows size
    // We don't really care about truncating the color palette when we size down.
    if (Object.keys(COLOR_PALETTE).length < grid.size) {
      // console.log(grid, COLOR_PALETTE)
      grid.forEach(generateColorsFromEachHex);
    }
    // am I inverting the x and y coordinate system somewhere? :notlikethis:
    var capKCell = {"x": config.width - config.hexWidth, "y": config.height - config.hexHeight, color: CAP_COLOR_PALETTE[fakeDataInput.capacity.k.status]}
    var capPCell = {"x": config.width - (config.hexWidth*2) , "y": config.height - config.hexHeight, color: CAP_COLOR_PALETTE[fakeDataInput.capacity.p.status]}
    var capSCell = {"x": config.width - (config.hexWidth*3) , "y": config.height - config.hexHeight, color: CAP_COLOR_PALETTE[fakeDataInput.capacity.s.status]}
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

function drawParticuleAt(p){
  ctx.beginPath();
  ctx.arc(p.position.x, p.position.y, 2, 0, Math.PI * 2, false);
  ctx.strokeStyle = p.color;
  ctx.stroke();
  ctx.closePath();
}

var PARTICULES = new Map();
function Position(){
  this.x = 0
  this.y = 0
}

function Particule () {
  this.position = Position
  this.radius = 2
  this.color = "white"
  this.isOnTop = false
  this.stepInTransition = 0
  this.nextMove = Direction.NONE
}

const Direction = {
  NONE: -1,
  UP: 0,
  DOWN: 1,
  UP_LEFT: 2,
  UP_RIGHT: 3,
  DOWN_RIGHT: 4,
  DOWN_LEFT: 5,
}

const ALLOWED_DIRECTIONS_FOR = {
  // because we are using a pointy top hexagon grid there is only 2 position: on top or on bottom of the hexagon
  // every other position is the top or bottom of one of its neighbors
  BOTTOM: [Direction.DOWN, Direction.UP_LEFT, Direction.UP_RIGHT], 
  TOP: [Direction.UP, Direction.DOWN_RIGHT, Direction.DOWN_LEFT],
}

function moveParticule(config, p){
  moveSideX = config.hexWidth/2
  moveSideY = (config.hexHeight/4) + 4

  moveVerticalY = config.radius

  p.stepInTransition++
  
  if(p.stepInTransition == 1/config.stepSize){
    setRandomDirection(p)
    p.stepInTransition = 0
    // Any move will make the particule either be on top or on bottom of the hexagon
    p.isOnTop = !p.isOnTop
  }

  switch(p.nextMove){
    case Direction.UP:
      p.position.x -= 0
      p.position.y -= moveVerticalY*config.stepSize
      break;
    case Direction.DOWN:
      p.position.y += 0
      p.position.y += moveVerticalY*config.stepSize
      break;
    case Direction.UP_LEFT:
      p.position.x -= moveSideX*config.stepSize
      p.position.y -= moveSideY*config.stepSize
      break;
    case Direction.UP_RIGHT:
      p.position.x += moveSideX*config.stepSize
      p.position.y -= moveSideY*config.stepSize
      break;
    case Direction.DOWN_RIGHT:
      p.position.x += moveSideX*config.stepSize
      p.position.y += moveSideY*config.stepSize
      break;
    case Direction.DOWN_LEFT:
      p.position.x -= moveSideX*config.stepSize
      p.position.y += moveSideY*config.stepSize
      break;
    default:
      console.log("no direction")
  }
}

function possibleDirectionsFor(isOnTop){
  if(isOnTop){
    return ALLOWED_DIRECTIONS_FOR.TOP
  }
  return ALLOWED_DIRECTIONS_FOR.BOTTOM
}

function drawParticules(config){
  PARTICULES.forEach(function(p, key, map){
    moveParticule(config, p, p.nextMove)
    drawParticuleAt(p)
  })
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

function getPreferedDirection(x, y, listOfPossibleMoves){
  // if the particule is on top of the hexagon, it will prefer to go down
  // if the particule is on the bottom of the hexagon, it will prefer to go up
  preferedMoves = []
  for (let i = 0; i < listOfPossibleMoves.length; i++) {
    const move = listOfPossibleMoves[i];
    if(move == Direction.UP && y < 50){
      continue
    }
    if((move == Direction.UP_LEFT || move == Direction.DOWN_LEFT ) && x < 50){
      continue
    }
    if((move == Direction.UP_LEFT || move == Direction.DOWN_LEFT ) && x < 50){
      continue
    }
    preferedMoves.push(move)
  }
  return preferedMoves;
}

function setRandomDirection(p){
  possibleMoves = possibleDirectionsFor(p.isOnTop)
  preferedMove = getPreferedDirection(p.position.x, p.position.y, possibleMoves)
  console.log(preferedMove)
  p.nextMove = preferedMove[Math.floor(Math.random()*preferedMove.length)];
}


function main(){
  config = new Config()

  pl = new Particule()
  plPos = new Position()
  plPos.x = config.hexWidth*2
  plPos.y = config.hexHeight*3
  pl.position = plPos
  pl.color = "white"
  pl.isOnTop = true
  PARTICULES.set("l", pl)

  pe = new Particule()
  pePos = new Position()
  pePos.x = (config.hexWidth/2)*7
  pePos.y = (config.hexHeight)*2
  pe.position = pePos
  pe.isOnTop = true
  pe.color = THEME_COLOR

  setRandomDirection(pe)
  setRandomDirection(pl)
  
  PARTICULES.set("e", pe)
  console.log(PARTICULES)
  window.requestAnimationFrame(function() {
    draw(config)
  });
}

function draw(cfg){
  canvas.width = cfg.width;
  canvas.height = cfg.height;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawHexagonGrid(cfg);
  window.requestAnimationFrame(function(){
    draw(cfg)
    drawParticules(cfg)
  });
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