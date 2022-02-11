function make2DArray(cols, rows) {
	let arr = new Array(cols);
	for (let i = 0; i < arr.length; i++) {
		arr[i] = new Array(rows);
	}
	return arr;
}

let grid;
let cols;
let rows;
let r;
let g;
let b;
let resolution = 10;
let colorMap = {};
const palette = [
	// rgb values
	[95, 110, 239],
	[230, 86, 136],
	[255, 123, 34],
	[239, 238, 2],
	[115, 242, 95],
	[68, 148, 248],
]

function setup() {
	// Hide p5-manager toggle
	window.parent.document.querySelector(".toggle").style.display = "none";

	frameRate(10)
	createCanvas(800, 800);
	cols = width / resolution;
	rows = height / resolution;

	grid = make2DArray(cols,rows);
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			grid[i][j] = floor(random(2));
		}
	}
}

function draw() {

	background(0);
	let incrementsPerColor;
	let currentIncrement;
	let currentColor;
	let nextColor;

	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			let x = i * resolution;
			let y = j * resolution;
			if (i == 0 && frameCount == 1) {
				incrementsPerColor = rows/palette.length;
				currentIncrement = Math.floor(j/incrementsPerColor);
				currentColor = palette[currentIncrement];
				nextColor = currentIncrement == palette.length - 1 ? palette[0] : palette[currentIncrement+1];
				r = currentColor[0];
				g = currentColor[1];
				b = currentColor[2];
				currentColor[0] = (nextColor[0] - currentColor[0])/incrementsPerColor+currentColor[0]
				currentColor[1] = (nextColor[1] - currentColor[1])/incrementsPerColor+currentColor[1]
				currentColor[2] = (nextColor[2] - currentColor[2])/incrementsPerColor+currentColor[2]
				colorMap[j] = [r,g,b]
			}

			
			if (grid[i][j] == 1) {
				fill(colorMap[j][0],colorMap[j][1],colorMap[j][2])
				stroke(0);
				rect(x,y,resolution - 1,resolution - 1);
			}
		}
	}

	let next = make2DArray(cols, rows);

	// Compute next based on grid
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			let state = grid[i][j];

			// Count live neighbours!
			let sum = 0;
			let neighbours = countNeighbours(grid, i, j);

			if(state == 0 && neighbours == 3) {
				next[i][j] = 1;
			} else if (state == 1 && (neighbours < 2 || neighbours > 3)) {
				next[i][j] = 0;
			} else {
				next[i][j] = state;
			}

		}
	}

	grid = next;

	// if(frameCount == 1) {
	// 	noLoop();
	// }

}

function countNeighbours(grid, x, y) {
	let sum = 0;
	for (let i = -1; i < 2; i++) {
		for (let j = -1; j < 2; j++) {

			let col = (x + i + cols) % cols;
			let row = (y + j + rows) % rows;

			sum += grid[col][row];
		}
	}
	sum -= grid[x][y];
	return sum;
}