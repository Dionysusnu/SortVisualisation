namespace StoogeSort {
	async function StoogeSort(state: State, start: number, end: number) {
		if (end - start === 0) {
			return;
		}
		if (end - start === 1) {
			if ((await state.compare(state.get(start), state.get(end))) === CompareResult.Greater) {
				await state.swap(start, end);
			}
			return;
		}
		const aThird = Math.floor((end - start + 1) / 3) + start;
		const twoThird = Math.ceil(((end - start + 1) / 3) * 2) + start - 1;
		await StoogeSort(state, start, twoThird);
		await StoogeSort(state, aThird, end);
		await StoogeSort(state, start, twoThird);
	}

	export const algorithm: SortAlgorithm = async (state) => StoogeSort(state, 0, state.length() - 1);
}
