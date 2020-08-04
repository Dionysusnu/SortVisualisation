namespace MergeSortInPlace {
	async function merge(state: State, start: number, mid: number, end: number) {
		let start2 = mid + 1;

		if ((await state.compare(state.get(mid), state.get(start2))) !== CompareResult.Greater) {
			return;
		}

		while (start <= mid && start2 <= end) {
			if ((await state.compare(state.get(start), state.get(start2))) !== CompareResult.Greater) {
				start++;
			} else {
				const value = state.get(start2);
				let index = start2;

				while (index !== start) {
					await state.overwrite(index, 1, state.get(index - 1));
					index--;
				}
				await state.overwrite(start, 1, value);

				start++;
				mid++;
				start2++;
			}
		}
	}

	async function MergeSortInPlace(state: State, start: number, end: number) {
		if (start < end) {
			const m = Math.floor((start + end) / 2);

			await MergeSortInPlace(state, start, m);
			await MergeSortInPlace(state, m + 1, end);

			await merge(state, start, m, end);
		}
	}

	export const algorithm: SortAlgorithm = async (state) => MergeSortInPlace(state, 0, state.length() - 1);
}
