async function SortElementI(array, comparison, iToSort) {
	if (array.isSorted(comparison)) {
		return
	}
	const element = array[iToSort];
	let before = 0;
	for (let i = 0; i < array.length; i++) {
		if (!await comparison(array[i], element)) {
			before += 1;
		}
	}
	await array.swap(iToSort, before);
	await SortElementI(array, comparison, iToSort);
}

async function CycleSort(array, comparison) {
	// comparison true=>element 1 must come AFTER element 2
	await SortElementI(array, comparison, 0);
}

export { CycleSort };
