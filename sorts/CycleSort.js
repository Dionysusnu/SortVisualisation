async function SortElementI(array, iToSort) {
	if (array.isSorted()) {
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
	await SortElementI(array, iToSort);
}

async function CycleSort(array, comparison) {
	// comparison true=>element 1 must come AFTER element 2
	await SortElementI(array, 0);
}

export { CycleSort };
