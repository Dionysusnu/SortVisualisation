function map(num: number, fromBottom: number, fromTop: number, toBottom: number, toTop: number) {
	const toDiff = toTop - toBottom;
	const fromDiff = fromTop - fromBottom;
	const frac = (num - fromBottom) / fromDiff;
	return toBottom + frac * toDiff;
}

function range(lower: number, upper: number) {
	const array = [];
	for (let i = lower; i <= upper; i++) {
		array.push(i);
	}
	return array;
}

async function sleep(ms?: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}
