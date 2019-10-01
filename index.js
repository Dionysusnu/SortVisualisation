const canvas = document.getElementById('MAIN_CANVAS');
canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.9;
const context = canvas.getContext('2d');

const NUM_ELEMENTS = canvas.width * 0.5;
const RANDOM_NUMS = true;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playNote(frequency, oscillator) {
	oscillator.frequency.value = frequency;
}

function drawBar(i, height) {
	const barWidth = canvas.width / NUM_ELEMENTS;
	context.fillRect(i * barWidth, canvas.height - height, barWidth, height);
}

function redraw(array) {
	context.clearRect(0, 0, canvas.width, canvas.height);
	for (let i = 0; i < array.length; i++) {
		drawBar(i, array[i]);
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
	}
}

import { QuickSort } from './sorts/QuickSort.js';
import { InsertionSort } from './sorts/InsertionSort.js';
const Algorithms = new Map([
	['QuickSort', QuickSort],
	['InsertionSort', InsertionSort],
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
	const array = new CustomArray();
	if (RANDOM_NUMS) {
		for (let i = 0; i < NUM_ELEMENTS; i++) {
			array.push(Math.round(Math.random() * canvas.height));
		}
	} else {
		for (let i = NUM_ELEMENTS; i > 0; i -= 2) {
			array.push(Math.round(i * canvas.height / NUM_ELEMENTS));
			array.push(Math.round(i * canvas.height / NUM_ELEMENTS));
		}
	}
	redraw(array);
	const oscillator = audioCtx.createOscillator();
	oscillator.type = 'sine';
	oscillator.connect(audioCtx.destination);
	oscillator.start();
	await Algorithms.get(algorithm)(array, (a, b) => {
		playNote(a + 100, oscillator);
		return a >= b;
	}, 0, array.length);
	oscillator.stop();
}

document.getElementById('START_BUTTON').onclick = play;