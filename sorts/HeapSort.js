function parent(i) {
	return Math.floor((i - 1) / 2);
}

function lChild(i) {
	return i * 2 + 1;
}

async function siftDown(i, array, comparison, heapLength) {
	const root = i;
	const lChildI = lChild(root);
	let swap = root;
	// console.log(`siftdown root=${root} lChildI=${lChildI} heapLength=${heapLength} array=${array}`);
	// console.log(!await comparison(array[swap], array[lChildI]));
	if (lChildI < heapLength && !await comparison(array[swap], array[lChildI])) {
		// console.log('sifting left');
		swap = lChildI;
	}
	if (lChildI + 1 < heapLength && !await comparison(array[swap], array[lChildI + 1])) {
		// console.log('sifting right');
		swap = lChildI + 1;
	}
	if (swap !== root) {
		// console.log(`swap=${swap} root=${root}`);
		array.swap(root, swap);
		await siftDown(swap, array, comparison, heapLength);
	}
}

async function heapify(array, comparison) {
	let i = parent(array.length - 1);
	while (i >= 0) {
		// console.log(`i=${i} array=${array}`);
		await siftDown(i, array, comparison, array.length);
		i--;
	}
}

async function HeapSort(array, comparison) {
	await heapify(array, comparison);
	// console.log(`heapified array=${array}`);
	let sorted = 0;
	while (sorted !== array.length) {
		array.swap(0, array.length - sorted - 1);
		sorted++;
		// console.log(`sorted=${sorted} array=${array}`);
		await siftDown(0, array, comparison, array.length - sorted);
		// console.log(`sifted sorted=${sorted} array=${array}`);
	}
}

export { HeapSort };