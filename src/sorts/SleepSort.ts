namespace SleepSort {
	export const algorithm: SortAlgorithm = async (state: State) => {
		const array = [];
		let written = 0;
		for (let i = 0; i < state.length(); i++) {
			const value = state.get(i);
			array.push(sleep(value * 10).then(() => state.overwrite(written++, 1, value)));
		}
		await Promise.all(array);
	};
}
