namespace HeapSort {
	function parent(i: number) {
		return Math.floor((i - 1) / 2);
	}

	function lChild(i: number) {
		return i * 2 + 1;
	}

	async function siftDown(i: number, state: State, heapLength: number) {
		const root = i;
		const lChildI = lChild(root);
		let swap = root;
		if (
			lChildI < heapLength &&
			(await state.compare(state.get(swap), state.get(lChildI))) === CompareResult.Smaller
		) {
			swap = lChildI;
		}
		if (
			lChildI + 1 < heapLength &&
			(await state.compare(state.get(swap), state.get(lChildI + 1))) === CompareResult.Smaller
		) {
			swap = lChildI + 1;
		}
		if (swap !== root) {
			await state.swap(root, swap);
			await siftDown(swap, state, heapLength);
		}
	}

	async function heapify(state: State) {
		let i = parent(state.length() - 1);
		while (i >= 0) {
			await siftDown(i, state, state.length());
			i--;
		}
	}

	export const algorithm: SortAlgorithm = async (state) => {
		await heapify(state);
		let sorted = 0;
		while (sorted !== state.length()) {
			await state.swap(0, state.length() - sorted - 1);
			sorted++;
			await siftDown(0, state, state.length() - sorted);
		}
	};
}
