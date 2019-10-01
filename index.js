const canvas = document.getElementById('MAIN_CANVAS');
canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.9;
const context = canvas.getContext('2d');

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playNote(frequency, oscillator) {
	oscillator.frequency.value = frequency;
}

function drawBar(i, height, width) {
	context.fillRect(i * width, canvas.height - height, width, height);
}

function redraw(array) {
	context.clearRect(0, 0, canvas.width, canvas.height);
	for (let i = 0; i < array.length; i++) {
		drawBar(i, array[i], canvas.width / array.length);
	}
}

class CustomArray extends Array {
	splice() {
		const args = Array.prototype.slice.call(arguments);
		super.splice(args[0], args[1], ...args.slice(2));
		redraw(this);
	}

	swap(a, b) {
		const obja = this[a];
		const objb = this[b];
		this[a] = objb;
		this[b] = obja;
		redraw(this);
	}
}

import { QuickSort } from './sorts/QuickSort.js';
import { InsertionSort } from './sorts/InsertionSort.js';
import { MergeSort } from './sorts/MergeSort.js';
import { BubbleSort } from './sorts/BubbleSort.js';
const Algorithms = new Map([
	['QuickSort', [QuickSort, 1000]],
	['InsertionSort', [InsertionSort, 200]],
	['MergeSort', [MergeSort, 400]],
	['BubbleSort', [BubbleSort, 100]],
]);

const select = document.getElementById('ALGORITHM_SELECT');
for (const [name] of Algorithms) {
	const x = document.createElement('OPTION');
	x.setAttribute('value', name);
	const t = document.createTextNode(name);
	x.appendChild(t);
	select.appendChild(x);
}

async function play() {
	const algorithm = select.options[select.selectedIndex].value;
	const data = Algorithms.get(algorithm);
	const array = new CustomArray();
	for (let i = 0; i < data[1]; i++) {
		array.push(Math.round(Math.random() * canvas.height));
	}
	/*
		for (let i = NUM_ELEMENTS; i > 0; i -= 2) {
			array.push(Math.round(i * canvas.height / NUM_ELEMENTS));
			array.push(Math.round(i * canvas.height / NUM_ELEMENTS));
		}
	*/
	redraw(array);
	const oscillator = audioCtx.createOscillator();
	oscillator.type = 'sine';
	oscillator.connect(audioCtx.destination);
	oscillator.start();
	await data[0](array, (a, b) => {
		playNote(a + 300, oscillator);
		return a >= b;
	}, 0, array.length);
	oscillator.stop();
}

document.getElementById('START_BUTTON').onclick = play;