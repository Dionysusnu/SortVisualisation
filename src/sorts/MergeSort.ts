namespace MergeSort {
	async function MergeSort(state: State, starti: number, numElements: number) {
		if (numElements > 1) {
			const half = Math.floor(numElements / 2);
			await MergeSort(state, starti, half);
			await MergeSort(state, starti + half, numElements - half);
			const Larray = await state.slice(starti, starti + half);
			const Rarray = await state.slice(starti + half, starti + numElements);
			let insertPos = starti;
			while (Larray.length && Rarray.length) {
				const Lelement = Larray.shift()!;
				const Relement = Rarray.shift()!;
				if ((await state.compare(Lelement, Relement)) === CompareResult.Greater) {
					await state.overwrite(insertPos, 1, Relement);
					Larray.unshift(Lelement);
				} else {
					await state.overwrite(insertPos, 1, Lelement);
					Rarray.unshift(Relement);
				}
				insertPos++;
			}
			await state.overwrite(insertPos, Larray.length + Rarray.length, ...Larray, ...Rarray);
		}
	}

	export const algorithm: SortAlgorithm = async (state) => MergeSort(state, 0, state.length());
}
