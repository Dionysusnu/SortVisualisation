/* global sleep */
async function QuickSort(array, comparison, starti, numElements) {
	if ((numElements) > 1) {
		const partitioni = Math.round(starti + Math.random() * (numElements - 1));
		const partition = array[partitioni];
		const before = [];
		const after = [];
		for (let i = starti || 0; i < numElements + (starti || 0); i++) {
			const element = array[i];
			if (i === partitioni) {
				continue;
			}
			if (await comparison(element, partition)) {
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
	}
}

export { QuickSort };