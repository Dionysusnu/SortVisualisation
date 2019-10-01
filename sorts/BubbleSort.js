/* global sleep */
async function BubbleSort(array, comparison) {
	let madeChanges = true;
	while (madeChanges) {
		madeChanges = false;
		for (let i = 0; i < array.length - 1; i++) {
			if (!await comparison(array[i + 1], array[i])) {
				array.swap(i, i + 1);
				madeChanges = true;
			}
		}
	}
}

export { BubbleSort };