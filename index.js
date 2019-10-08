/* global sleep */
const canvas = document.getElementById('MAIN_CANVAS');
canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.9;
const context = canvas.getContext('2d');
const comparisons = document.getElementById('COMPARISON_COUNT');
const accesses = document.getElementById('ACCESS_COUNT');

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playNote(frequency, oscillator) {
	try {
		oscillator.frequency.value = frequency;
	} catch (error) {
		console.error(`frequency=${frequency} error=${error}`);
	}
}

function drawBar(i, height, width) {
	context.fillRect(i * width, canvas.height - height, width, height);
}

function redraw(array) {
	context.clearRect(0, 0, canvas.width, canvas.height);
	for (let i = 0; i < array.length; i++) {
		drawBar(i, array[i], canvas.width / array.length);
	}
	accesses.innerHTML = array.accesses + '';
}

class CustomArray extends Array {
	constructor() {
		super(...arguments);
		this.accesses = 0;
		this.comparisons = 0;
	}
	async splice() {
		const args = Array.prototype.slice.call(arguments);
		for (let i = 2; i < args.length; i++) {
			// For every element replaced, count an array access and sleep 2ms
			this.accesses++;
			await sleep(2);
		}
		super.splice(args[0], args[1], ...args.slice(2));
		redraw(this);
	}

	async swap(a, b) {
		const obja = this[a];
		const objb = this[b];
		// For every swap, count an array access and sleep 2ms
		this.accesses++;
		await sleep(2);
		this[a] = objb;
		this[b] = obja;
		redraw(this);
	}
}

import { QuickSort } from './sorts/QuickSort.js';
import { InsertionSort } from './sorts/InsertionSort.js';
import { MergeSort } from './sorts/MergeSort.js';
import { BubbleSort } from './sorts/BubbleSort.js';
import { SelectionSort } from './sorts/SelectionSort.js';
import { HeapSort } from './sorts/HeapSort.js';
import { CycleSort } from './sorts/CycleSort.js';
const Algorithms = new Map([
	['QuickSort', [QuickSort, 500]],
	['InsertionSort', [InsertionSort, 200]],
	['MergeSort', [MergeSort, 500]],
	['BubbleSort', [BubbleSort, 100]],
	['SelectionSort', [SelectionSort, 100]],
	['HeapSort', [HeapSort, 400]],
        ['WIP: CycleSort', [CycleSort, 50]],
]);

const elementSelect = document.getElementById('ELEMENT_SELECT');
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
	const elementCount = parseInt(elementSelect.value) || data[1];
	for (let i = 0; i < elementCount; i++) {
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
	await data[0](array, async (a, b) => {
		playNote(a + 300, oscillator);
		// For every comparison, count one and sleep 1ms
		array.comparisons++;
		comparisons.innerHTML = array.comparisons + '';
		await sleep(1);
		return a >= b;
	}, 0, array.length);
	oscillator.stop();
}

document.getElementById('START_BUTTON').onclick = play;
