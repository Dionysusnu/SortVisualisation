/* global sleep */
async function InsertionSort(array, comparison) {
	for (let i = 1; i < array.length; i++) {
		const element = array[i];
		let sorted = false;
		let comparing = i;
		while (!sorted) {
			comparing--;
			if (comparing < 0) {
				sorted = true;
			} else if (!await comparison(array[comparing], element)) {
				sorted = true;
			} else {
				await array.swap(comparing, comparing + 1);
			}
		}
	}
}

export { InsertionSort };