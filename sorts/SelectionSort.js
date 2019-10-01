/* global sleep */
async function SelectionSort(array, comparison) {
	for (let i = 0; i < array.length - 1; i++) {
		let element = array[i + 1];
		let chosen = i + 1;
		for (let comparing = i + 2; comparing < array.length; comparing++) {
			if (await comparison(element, array[comparing])) {
				chosen = comparing;
				element = array[chosen];
			}
		}
		array.swap(i, chosen);
	}
}

export { SelectionSort };