namespace PancakeSort {
	async function flip(state: State, back: number) {
		let front = 0;
		while (front < back) {
			await state.swap(front, back);
			front++;
			back--;
		}
	}

	async function findMax(state: State, n: number) {
		let maxi = n - 1;
		for (let i = n - 1; i >= 0; i--) {
			if ((await state.compare(state.get(maxi), state.get(i))) === CompareResult.Smaller) {
				maxi = i;
			}
		}
		return maxi;
	}

	export const algorithm: SortAlgorithm = async (state) => {
		for (let notSortedYet = state.length(); notSortedYet > 1; --notSortedYet) {
			const maxi = await findMax(state, notSortedYet);
			if (maxi !== notSortedYet - 1) {
				await flip(state, maxi);
				await flip(state, notSortedYet - 1);
			}
		}
	};
}
