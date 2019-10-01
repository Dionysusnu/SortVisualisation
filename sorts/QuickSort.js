/* global sleep */
/* out-of-place removed because it didn't show the partitioning
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
*/

async function QuickSort(array, comparison, starti, numElements) {
	if (numElements > 1) {
		const partitioni = Math.round(starti + Math.random() * (numElements - 1));
		const partition = array[partitioni];
		// Put partition at the end
		array.swap(partitioni, starti + numElements - 1);
		console.log(`sorting ${starti}-${starti + numElements} partition=${partition}`);
		let greaterStart = starti;
		let unsortedStart = starti;
		for (let i = starti; i < numElements + starti - 1; i++) {
			const element = array[i];
			if (await comparison(element, partition)) {
				// Greater, leave element where it is
				unsortedStart++;
				console.log(`${element} greater`);
				console.log(`greaterStart=${greaterStart} unsortedStart=${unsortedStart}`);
			} else {
				// Smaller, swap element with first element of greater array
				array.swap(i, greaterStart);
				greaterStart++;
				unsortedStart++;
				console.log(`${element} smaller`);
				console.log(`greaterStart=${greaterStart} unsortedStart=${unsortedStart}`);
			}
		}
		// Swap partition with first element of greater array
		console.log(`starti=${starti} greaterStart=${greaterStart} unsortedStart=${unsortedStart}`);
		array.swap(greaterStart, starti + numElements - 1);
		console.log(array);
		await QuickSort(array, comparison, starti, greaterStart - starti);
		await QuickSort(array, comparison, greaterStart + 1, unsortedStart - greaterStart);
	}
}

export { QuickSort };