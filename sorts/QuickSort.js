/* global sleep */
async function QuickSort(array, comparison, starti, numElements) {
	console.log(`starti = ${starti} numElements = ${numElements}`);
	if ((numElements) > 1) {
		await sleep(20);
		const partitioni = Math.round(starti + Math.random() * (numElements - 1));
		const partition = array[partitioni];
		console.log(`partition = ${partition}`);
		console.log(array);
		const before = [];
		const after = [];
		for (let i = starti || 0; i < numElements + (starti || 0); i++) {
			const element = array[i];
			if (i === partitioni) {
				continue;
			}
			const compared = comparison(element, partition);
			console.log(`${element}=${compared}`);
			if (compared) {
				after.push(element);
			} else {
				before.push(element);
			}
		}
		array.splice(starti + before.length, 1, partition);
		array.splice(starti, before.length, ...before);
		array.splice(starti + before.length + 1, after.length, ...after);
		await QuickSort(array, comparison, starti, before.length);
		await QuickSort(array, comparison, starti + before.length + 1, after.length);
	} else if (numElements === 1) {
		// array.splice(starti, 1, array[starti]);
	}
}

export { QuickSort };