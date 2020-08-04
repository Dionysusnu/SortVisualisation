namespace BogoSort {
	export const algorithm: SortAlgorithm = async (state) => {
		while (!(await state.isSorted())) {
			await state.shuffle();
		}
	};
}
