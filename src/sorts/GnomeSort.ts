namespace GnomeSort {
	export const algorithm: SortAlgorithm = async (state: State) => {
		let index = 0;
		while (index < state.length()) {
			if (index === 0) {
				index++;
			}
			if ((await state.compare(state.get(index), state.get(index - 1))) !== CompareResult.Smaller) {
				index++;
			} else {
				await state.swap(index, index - 1);
				index--;
			}
		}
	};
}
