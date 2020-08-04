namespace BubbleSort {
	export const algorithm: SortAlgorithm = async (state) => {
		const length = state.length();
		for (let i = 0; i < length; i++) {
			for (let j = 0; j < length - i - 1; j++) {
				if ((await state.compare(state.get(j + 1), state.get(j))) === CompareResult.Smaller) {
					await state.swap(j, j + 1);
				}
			}
		}
	};
}
