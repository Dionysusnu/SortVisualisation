namespace QuickSort {
	async function QuickSort(state: State, starti: number, numElements: number) {
		if (numElements > 1) {
			const partitioni = Math.round(starti + Math.random() * (numElements - 1));
			const partition = state.get(partitioni);
			// Put partition at the end
			await state.swap(partitioni, starti + numElements - 1);
			let greaterStart = starti;
			let unsortedStart = starti;
			for (let i = starti; i < numElements + starti - 1; i++) {
				const element = state.get(i);
				if ((await state.compare(element, partition)) !== CompareResult.Smaller) {
					// Greater, leave element where it is
					unsortedStart++;
				} else {
					// Smaller, swap element with first element of greater array
					await state.swap(i, greaterStart);
					greaterStart++;
					unsortedStart++;
				}
			}
			// Swap partition with first element of greater array
			await state.swap(greaterStart, starti + numElements - 1);
			await QuickSort(state, starti, greaterStart - starti);
			await QuickSort(state, greaterStart + 1, unsortedStart - greaterStart);
		}
	}

	export const algorithm: SortAlgorithm = async (state) => QuickSort(state, 0, state.length());
}
