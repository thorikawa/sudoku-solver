class Board {
	constructor() {
		this.data = new Array(9);
		for (let i = 0; i<9; i++) {
			this.data[i] = new Array(9);
			for (let j = 0; j<9; j++) {
				this.data[i][j] = 0;
			}
		}
	}

	getCandidates(r, c) {
		let sqExist = new Array();
		let or = parseInt(r / 3) * 3;
		let oc = parseInt(c / 3) * 3;
		for (let nr = or; nr < or + 3; nr++) {
			for (let nc = oc; nc < oc + 3; nc++) {
				if ((nr != r || nc != c) && this.isDecided(nr, nc)) {
					sqExist.push(this.getNum(nr, nc));
				}
			}
		}
		let rowExist = new Array();
		let colExist = new Array();

		for (let i = 0; i < 9; i++) {
			if (c != i && this.isDecided(r, i)) {
				rowExist.push(this.getNum(r, i));
			}
		}

		for (let i = 0; i < 9; i++) {
			if (r != i && this.isDecided(i, c)) {
				colExist.push(this.getNum(i, c));
			}
		}

		let cands = new Array();
		for (let i = 1; i <= 9; i++) {
			if (sqExist.indexOf(i) < 0 && rowExist.indexOf(i) < 0 && colExist.indexOf(i) < 0) {
				cands.push(i);
			}
		}
		return cands;
	}

	getNum(r, c) {
		return this.data[r][c];
	}

	setNum(r, c, val) {
		this.data[r][c] = val;
	}

	tryEasy() {
		let res = 0;
		for (let r = 0; r < 9; r++) {
			for (let c = 0; c < 9; c++) {
				if (!this.isDecided(r, c)) {
					let cands = this.getCandidates(r, c);
					// console.log(r, c, cands.join(','));
					if (cands.length === 1) {
						this.setNum(r, c, cands[0]);
						res++;
					}
				}
			}
		}
		return res;
	}

	isDecided(r, c) {
		return this.data[r][c] > 0;
	}

	isDone() {
		for (let r = 0; r < 9; r++) {
			for (let c = 0; c < 9; c++) {
				if (!this.isDecided(r, c)) {
					return false;
				}
			}
		}
		return true;
	}

	isImpossible() {
		for (let r = 0; r < 9; r++) {
			for (let c = 0; c < 9; c++) {
				if (!this.isDecided(r, c)) {
					let cands = this.getCandidates(r, c);
					if (cands.length > 0) {
						return false;
					}
				}
			}
		}
		return true;
	}

	clone() {
		let res = new Board();
		for (let r = 0; r < 9; r++) {
			for (let c = 0; c < 9; c++) {
				res.data[r][c] = this.data[r][c];
			}
		}
		return res;
	}

	debugPrint() {
		console.log("=========");
		for (let r = 0; r < 9; r++) {
			console.log(this.data[r].join(','));
		}
		console.log("=========");
	}

	getLeastCandidateNum() {
		let res = 10;
		for (let r = 0; r < 9; r++) {
			for (let c = 0; c < 9; c++) {
				if (!this.isDecided(r, c)) {
					let cands = this.getCandidates(r, c);
					res = Math.min(cands.length, res);
				}
			}
		}
		return res;
	}
}

class Solver {
	solve(b) {
		b.debugPrint();
		// try one step estimation first
		let res = 0;
		do {
			// console.log("#####");
			res = b.tryEasy();
		} while (res > 0);

		// b.debugPrint();

		// check if this is done
		if (b.isDone()) {
			return b;
		}

		if (b.isImpossible()) {
			return -1;
		}

		// dive into one step further
		let tryTupples = [];
		let targetCandidatesLength = b.getLeastCandidateNum();
		console.log(targetCandidatesLength);
		for (let r = 0; r < 9; r++) {
			for (let c = 0; c < 9; c++) {
				if (!b.isDecided(r, c)) {
					let cands = b.getCandidates(r, c);
					if (cands.length === targetCandidatesLength) {
						for (let i = 0; i < cands.length; i++) {
							console.log(`assume ${r} ${c} = ${cands[i]}`);
							let futureB = b.clone();
							futureB.setNum(r, c, cands[i]);
							let res = this.solve(futureB);
							// let res = -1;
							if (res !== -1) {
								// res.debugPrint();
								return res;
							}
						}
					}
				}
			}
		}

		return -1;
	}
}

var body = document.getElementById('body');
for (let r = 0; r < 9; r++) {
	for (let c = 0; c < 9; c++) {
		var input = document.createElement('input');
		input.setAttribute('style', 'width: 30px');
		input.setAttribute('id', `id-${r}-${c}`);
		body.append(input);
	}
	var br = document.createElement('br');
	body.append(br);
}

// board.data = [
// [0,9,0,8,0,0,0,3,0],
// [0,0,0,5,0,4,0,2,0],
// [0,0,0,0,0,2,8,1,0],
// [1,0,0,3,4,0,0,0,9],
// [3,0,0,6,0,1,0,0,4],
// [6,0,0,0,8,9,0,0,3],
// [0,1,8,4,0,0,0,0,0],
// [0,2,0,9,0,8,0,0,0],
// [0,6,0,0,0,5,0,4,0],
// ];

let button = document.createElement('input');
button.setAttribute('type', 'button');
button.value = 'solve';
button.addEventListener('click', (ev) => {
	console.log('clicked');
	let solver = new Solver();
	let board = new Board();
	for (let r = 0; r < 9; r++) {
		for (let c = 0; c < 9; c++) {
			let ele = document.getElementById(`id-${r}-${c}`);
			let val = parseInt(ele.value);
			if (isNaN(val)) {
				board.setNum(r, c, 0);
			} else {
				board.setNum(r, c, val);
			}
			
		}
	}

	let res = solver.solve(board);
	res.debugPrint();
	for (let r = 0; r < 9; r++) {
		for (let c = 0; c < 9; c++) {
			let ele = document.getElementById(`id-${r}-${c}`);
			ele.value = res.getNum(r, c);
		}
	}
});
body.append(button);



