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
let resolution = 10;

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

	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			let x = i * resolution;
			let y = j * resolution;
			if (grid[i][j] == 1) {
				fill(255);
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

	// if(frameCount == 10) {
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