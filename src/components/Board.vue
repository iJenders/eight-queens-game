<script setup>
import { ElDialog, ElForm, ElFormItem, ElText, ElButton, ElNotification, ElAlert } from 'element-plus';
import { onMounted, ref } from 'vue';

const dialogVisible = ref(false);
const inputValue = ref('');
const time = ref(0);

const handleWin = () => {
	dialogVisible.value = true;
	ElNotification({
		title: '¡Has ganado!',
		message: '¡Felicidades! Has logrado colocar todas las reinas en el tablero sin que se amenacen entre ellas.',
		type: 'success',
		duration: 5000
	});
}

const handleCloseWinDialog = () => {
	if (inputValue.value) {
		const records = JSON.parse(window.localStorage.getItem('records')) || [];

		records.push({
			name: inputValue.value,
			time: time.value,
			date: new Date().toLocaleDateString()
		});
		window.localStorage.setItem('records', JSON.stringify(records));

		dialogVisible.value = false;
		inputValue.value = '';

		ElNotification.success({
			title: '¡Registro exitoso!',
			message: 'Tu record ha sido registrado con éxito.',
			type: 'success',
			duration: 5000
		});
	} else {
		ElNotification.error({
			title: '¡Error!',
			message: 'Debes ingresar tu nombre para registrar tu record.',
			type: 'error',
			duration: 5000
		});
	}
}

onMounted(() => {
	const PIECES = {
		'white-king': '♔',
		'white-queen': '♕',
		'white-rook': '♖',
		'white-bishop': '♗',
		'white-knight': '♘',
		'white-pawn': '♙',
		'black-king': '♚',
		'black-queen': '♛',
		'black-rook': '♜',
		'black-bishop': '♝',
		'black-knight': '♞',
		'black-pawn': '♟'
	};


	const COLORS = [
		"#ffffff",
		"#b1ffb1",
		"#ffb1b1"
	]

	const MAPPED_PIECES = [
		'',
		PIECES["black-queen"],
		'x'
	]

	class Board {
		constructor(size) {
			this.y = size;
			this.x = size;

			this.matrice = []
			for (let i = 0; i < size; i++) {
				let row = [];
				for (let j = 0; j < size; j++) {
					row.push(0);
				}

				this.matrice.push(row);
			}
		}

		getMatrice() {
			return this.matrice;
		}

		setEntry(y, x, value) {
			this.matrice[y][x] = value;
		}

		getRowEntries(y, x) {
			let entries = []

			if (this.matrice[y][x] !== undefined) {
				let counter = 1;

				while ((this.matrice[y] !== undefined) && (this.matrice[y][x - counter] !== undefined)) {
					entries.push([y, x - counter]);
					counter++;
				}

				entries.reverse();
				entries.push([y, x]);
				counter = 1;

				while ((this.matrice[y] !== undefined) && (this.matrice[y][x + counter] !== undefined)) {
					entries.push([y, x + counter]);
					counter++;
				}
			}

			return entries;
		}

		getColumnEntries(y, x) {
			let entries = []

			if (this.matrice[y][x] !== undefined) {
				let counter = 1;

				while ((this.matrice[y - counter] !== undefined) && (this.matrice[y - counter][x] !== undefined)) {
					entries.push([y - counter, x]);
					counter++;
				}

				entries.reverse();
				entries.push([y, x]);
				counter = 1;

				while ((this.matrice[y + counter] !== undefined) && (this.matrice[y + counter][x] !== undefined)) {
					entries.push([y + counter, x]);
					counter++;
				}
			}

			return entries;
		}

		getDiagonalAEntries(y, x) {
			let entries = []

			if (this.matrice[y][x] !== undefined) {
				let counter = 1;

				while ((this.matrice[y - counter] !== undefined) && (this.matrice[y - counter][x - counter] !== undefined)) {
					entries.push([y - counter, x - counter]);
					counter++;
				}

				entries.reverse();
				entries.push([y, x]);
				counter = 1;

				while ((this.matrice[y + counter] !== undefined) && (this.matrice[y + counter][x + counter] !== undefined)) {
					entries.push([y + counter, x + counter]);
					counter++;
				}
			}

			return entries;
		}

		getDiagonalBEntries(x, y) {
			let entries = []

			if (this.matrice[y][x] !== undefined) {
				let counter = 1;

				while ((this.matrice[y + counter] !== undefined) && (this.matrice[y + counter][x - counter] !== undefined)) {
					entries.push([y + counter, x - counter]);
					counter++;
				}

				entries.reverse();
				entries.push([y, x]);
				counter = 1;

				while ((this.matrice[y - counter] !== undefined) && (this.matrice[y - counter][x + counter] !== undefined)) {
					entries.push([y - counter, x + counter]);
					counter++;
				}
			}

			return entries;
		}
	}

	class Game {
		constructor() {
			this.board = new Board(8);
			this.time = 0;
			this.playing = true;
			this.domBoard = document.getElementById('board');

			// Set dataset
			for (let i = 0; i < this.domBoard.children.length; i++) {
				for (let j = 0; j < this.domBoard.children[i].children.length; j++) {
					this.domBoard.children[i].children[j].dataset.y = i;
					this.domBoard.children[i].children[j].dataset.x = j;
				}
			}

			// Start count time
			this.countTime();

			this.setEventListeners();
			this.renderBoard();
		}

		restarting = false;

		countTime() {
			setTimeout(() => {
				if (this.playing) {
					this.time++;
					time.value = this.time;
					this.countTime();
				}
			}, 1000);
		}

		renderBoard() {
			this.board.matrice.forEach((row, i) => {
				row.forEach((entry, j) => {
					let el = this.domBoard.children[i].children[j];

					el.children[0].innerText = MAPPED_PIECES[entry];
					if (entry == 1) {
						el.classList.add('Queen');
					} else {
						el.classList.remove('Queen');
					}

					if (entry == 2) {
						el.classList.add('Invalid');
					} else {
						el.classList.remove('Invalid');
					}
				})
			})
		}

		setQueen(y, x) {
			if (this.board.getMatrice()[y][x] === 0) {
				this.board.getRowEntries(y, x).forEach(el => {
					this.board.setEntry(el[0], el[1], 2);
				})

				this.board.getColumnEntries(y, x).forEach(el => {
					this.board.setEntry(el[0], el[1], 2);
				})

				this.board.getDiagonalAEntries(y, x).forEach(el => {
					this.board.setEntry(el[0], el[1], 2);
				})

				this.board.getDiagonalBEntries(y, x).forEach(el => {
					this.board.setEntry(el[0], el[1], 2);
				})

				this.board.setEntry(y, x, 1);

				this.renderBoard();

				if (this.availableSquares()[0] == 0) {
					switch (this.availableSquares()[1]) {
						case 8:
							this.winGame();
							break;

						default:
							this.loseGame();
							break;
					}
				}
				return 1; // Success
			} else {
				return 0; // Invalid placement
			}
		}

		setEventListeners() {
			for (let i = 0; i < this.domBoard.children.length; i++) {
				for (let j = 0; j < this.domBoard.children[i].children.length; j++) {
					let el = this.domBoard.children[i].children[j],
						clone = el.cloneNode(true);

					clone.addEventListener('click', () => {
						let y = parseInt(clone.dataset.y),
							x = parseInt(clone.dataset.x);
						this.setQueen(y, x)
					})
					el.parentNode.replaceChild(clone, el);
				}
			}

			let el = document.getElementById('restartButton'),
				clone = el.cloneNode(true);

			clone.addEventListener('click', () => {
				if (!this.restarting) {
					this.restarting = true;
					clone.innerHTML = 'Reiniciar'

					this.killPieces();
					this.playing = false;

					setTimeout(() => {
						time.value = 0;
						game = new Game();
						this.restarting = false;
					}, 1000)
				}
			})

			el.parentNode.replaceChild(clone, el)
		}

		availableSquares() {
			let available = 0;
			let queens = 0;

			this.board.matrice.forEach(row => {
				row.forEach(entry => {
					if (entry == 0) {
						available++;
					} else if (entry == 1) {
						queens++;
					}
				})
			})

			return [available, queens];
		}

		killPieces() {
			for (let i = 0; i < this.domBoard.children.length; i++) {
				for (let j = 0; j < this.domBoard.children[i].children.length; j++) {
					let el = this.domBoard.children[i].children[j];

					el.classList.add('Killed');
					let xDisplacement = (parseInt(Math.random() * 4) - 2) * 32;
					el.children[0].style.left = xDisplacement + 'px';
				}
			}

			setTimeout(() => {

				for (let i = 0; i < this.domBoard.children.length; i++) {
					for (let j = 0; j < this.domBoard.children[i].children.length; j++) {
						let el = this.domBoard.children[i].children[j];

						el.classList.remove('Killed');
						el.children[0].style.left = '';
					}
				}
			}, 1000);
		}

		winGame() {
			this.playing = false;
			let el = document.getElementById('restartButton')
			el.innerHTML = 'Jugar de nuevo'

			handleWin();
		}

		loseGame() {
			this.playing = false;
			let el = document.getElementById('restartButton')
			el.innerHTML = 'Reintentar'

			document.getElementById('alertMessage').innerText = '¡Has perdido!'
			document.getElementById('alertMessage').style.color = '#ca0b00'
			document.querySelector('.Alert').style.display = 'flex';
		}
	}

	document.getElementById('alertButton').addEventListener('click', () => {
		document.querySelector('.Alert').style.display = '';
	})

	let game = new Game();
})
</script>

<template>
	<ElDialog v-model="dialogVisible" title="¡Has ganado!" width="500px">
		<ElText>
			<ElText size="large" tag="b">¡Felicidades!</ElText>
			Has logrado colocar todas las reinas en el tablero sin que se
			amenacen entre ellas.
		</ElText>
		<div class="mb-4"></div>
		<!-- Registrar nombre del record -->
		<ElForm>
			<div class="mb-2">
				<ElText>
					Registra tu nombre para que aparezca en el ranking:
				</ElText>
			</div>
			<ElFormItem label="Nombre">
				<ElInput v-model="inputValue" />
			</ElFormItem>
		</ElForm>
		<div class="flex justify-end">
			<ElButton type="success" plain @click="handleCloseWinDialog">
				Confirmar
			</ElButton>
		</div>
	</ElDialog>
	<el-alert :title="`Tiempo: ${time ? time : '0'}s`" type="success" class="!mb-3" :closable="false" />
	<div class="Board" id="board">
		<div class="Row">
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
		</div>
		<div class="Row">
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
		</div>
		<div class="Row">
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
		</div>
		<div class="Row">
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
		</div>
		<div class="Row">
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
		</div>
		<div class="Row">
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
		</div>
		<div class="Row">
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
		</div>
		<div class="Row">
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
			<div class="Square">
				<p></p>
			</div>
		</div>
	</div>
</template>