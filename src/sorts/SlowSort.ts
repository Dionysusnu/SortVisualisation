namespace SlowSort {
	async function SlowSort(state: State, start: number, end: number) {
		if (start < end) {
			const m = Math.floor((start + end) / 2);

			await SlowSort(state, start, m);
			await SlowSort(state, m + 1, end);

			if ((await state.compare(state.get(m), state.get(end))) === CompareResult.Greater) {
				await state.swap(m, end);
			}

			await SlowSort(state, start, end - 1);
		}
	}

	export const algorithm: SortAlgorithm = async (state) => SlowSort(state, 0, state.length() - 1);
}
