/* global sleep */
async function MergeSort(array, comparison, starti, numElements) {
	if (numElements > 1) {
		const half = Math.floor(numElements / 2);
		await MergeSort(array, comparison, starti, half);
		await MergeSort(array, comparison, starti + half, numElements - half);
		const Larray = array.slice(starti, starti + half);
		const Rarray = array.slice(starti + half, starti + numElements);
		let insertPos = starti;
		while (Larray.length && Rarray.length) {
			const Lelement = Larray.shift();
			const Relement = Rarray.shift();
			if (await comparison(Lelement, Relement)) {
				await array.splice(insertPos, 1, Relement);
				Larray.unshift(Lelement);
			} else {
				await array.splice(insertPos, 1, Lelement);
				Rarray.unshift(Relement);
			}
			insertPos++;
		}
		await array.splice(insertPos, Larray.length + Rarray.length, ...Larray, ...Rarray);
	}
}

export { MergeSort };