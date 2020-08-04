function loaded() {
	const Algorithms: Record<string, [SortAlgorithm, number]> = {
		QuickSort: [QuickSort.algorithm, 500],
		InsertionSort: [InsertionSort.algorithm, 150],
		MergeSort: [MergeSort.algorithm, 500],
		BubbleSort: [BubbleSort.algorithm, 100],
		SelectionSort: [SelectionSort.algorithm, 1000],
		HeapSort: [HeapSort.algorithm, 400],
		BogoSort: [BogoSort.algorithm, 5],
		InPlaceMergeSort: [MergeSortInPlace.algorithm, 200],
		StoogeSort: [StoogeSort.algorithm, 90],
		SlowSort: [SlowSort.algorithm, 100],
		PancakeSort: [PancakeSort.algorithm, 100],
		GnomeSort: [GnomeSort.algorithm, 100],
		SleepSort: [SleepSort.algorithm, 100],
	};

	const Fills: Record<FillType, (state: State, elCount: number) => Promise<void>> = {
		[FillType.Random]: async (state, elCount) => {
			await state.fill(elCount, () => Math.round(Math.random() * elCount));
		},
		[FillType.Shuffled]: async (state, elCount) => {
			let i = 0;
			await state.fill(elCount, () => ++i);
			await state.shuffle();
		},
		[FillType.Sorted]: async (state, elCount) => {
			let i = 0;
			await state.fill(elCount, () => ++i);
		},
		[FillType.Reversed]: async (state, elCount) => {
			let i = elCount;
			await state.fill(elCount, () => i--);
		},
		[FillType.Equal]: async (state, elCount) => {
			await state.fill(elCount, () => elCount / 2);
		},
	};

	const elementSelect = document.getElementById("ELEMENT_SELECT") as HTMLInputElement;
	const algorithmSelect = new ElementSelect(
		document.getElementById("ALGORITHM_SELECT") as HTMLSelectElement,
		Algorithms,
	);
	const inputSelect = new ElementSelect(document.getElementById("FILL_SELECT") as HTMLSelectElement, Fills);

	async function play() {
		const audioCtx = new window.AudioContext();
		const oscillator = audioCtx.createOscillator();
		oscillator.type = "triangle";
		oscillator.connect(audioCtx.destination);
		oscillator.start();

		const algorithm = algorithmSelect.getChoice();
		const elementCount = parseInt(elementSelect.value) || algorithm[1];
		const state = new State(oscillator);
		const canvas = document.getElementById("MAIN_CANVAS") as HTMLCanvasElement;
		canvas.width = 0.9 * window.innerWidth;
		canvas.height = 0.9 * window.innerHeight;
		const chosenFill = inputSelect.getChoice();
		await chosenFill(state, elementCount);
		await algorithm[0](state);
		await state.clearActive();
		oscillator.stop();
	}

	(document.getElementById("START_BUTTON") as HTMLButtonElement).onclick = play;
}
