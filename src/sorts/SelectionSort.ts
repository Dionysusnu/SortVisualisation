namespace SelectionSort {
	export const algorithm: SortAlgorithm = async (state) => {
		for (let i = 0; i < state.length() - 1; i++) {
			let element = state.get(i + 1);
			let chosen = i + 1;
			for (let comparing = i + 2; comparing < state.length(); comparing++) {
				if ((await state.compare(state.get(comparing), element)) === CompareResult.Smaller) {
					chosen = comparing;
					element = state.get(chosen);
				}
			}
			if ((await state.compare(state.get(i), state.get(chosen))) === CompareResult.Greater) {
				await state.swap(i, chosen);
			}
		}
	};
}
