namespace InsertionSort {
	export const algorithm: SortAlgorithm = async (state) => {
		for (let i = 1; i < state.length(); i++) {
			const element = state.get(i);
			let sorted = false;
			let comparing = i;
			while (!sorted) {
				comparing--;
				if (comparing < 0) {
					sorted = true;
				} else if ((await state.compare(element, state.get(comparing))) !== CompareResult.Smaller) {
					sorted = true;
				} else {
					await state.swap(comparing, comparing + 1);
				}
			}
		}
	};
}
