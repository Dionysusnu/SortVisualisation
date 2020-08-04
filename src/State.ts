class State<T extends { valueOf(): number } = number> {
	private active: Array<number> = [];
	private array: Array<T> = [];
	private canvas = (document.getElementById("MAIN_CANVAS") as HTMLCanvasElement) ?? new HTMLCanvasElement();
	private context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
	constructor(private oscillator: OscillatorNode) {}

	async overwrite(start: number, amount: number, ...args: Array<T>) {
		this.active = range(start, start + amount);
		this.playNote(args[0]);
		this.array.splice(start, amount, ...args);
		await this.draw();
	}

	async swap(a: number, b: number) {
		this.active = [a, b];
		this.playNote(this.get(a));
		if (a < 0 || a > this.length() - 1) throw RangeError();
		if (b < 0 || b > this.length() - 1) throw RangeError();
		const tempObj = this.get(a);
		this.set(a, this.get(b));
		this.set(b, tempObj);
		await this.draw();
	}

	async isSorted() {
		for (let i = 0; i < this.array.length - 1; i++) {
			if ((await this.compare(this.get(i + 1), this.get(i))) === CompareResult.Smaller) {
				return false;
			}
		}
		return true;
	}

	async compare(a: T, b: T) {
		this.playNote(a);
		if (a > b) {
			return CompareResult.Greater;
		} else if (a < b) {
			return CompareResult.Smaller;
		} else {
			return CompareResult.Equal;
		}
	}

	get(i: number) {
		if (i < 0 || i >= this.length()) throw RangeError();
		return this.array[i];
	}

	private set(i: number, el: T) {
		if (i < 0 || i >= this.length()) throw RangeError();
		this.array[i] = el;
	}

	length() {
		return this.array.length;
	}

	private drawBar(i: number, height: number, width: number) {
		this.context.fillRect(i * width, this.canvas.height - height, width, height);
	}

	private async draw() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		const length = this.length();
		for (let i = 0; i < length; i++) {
			if (this.active.some((v) => v === i)) {
				this.context.fillStyle = "rgb(255, 0, 0)";
			}
			const val = this.get(i);
			this.drawBar(
				i,
				val !== undefined ? 10 + map(this.get(i)?.valueOf() ?? 0, 1, length, 1, this.canvas.height - 10) : 0,
				this.canvas.width / length,
			);
			this.context.fillStyle = "rgb(0, 0, 0)";
		}
		await sleep(0);
	}

	private playNote(value: T) {
		const frequency = map(value.valueOf(), 1, this.length(), 300, 2400);
		try {
			this.oscillator.frequency.value = frequency;
		} catch (error) {
			console.error(`frequency=${frequency} error=${error}`);
		}
	}

	async fill(size: number, gen: () => T) {
		this.array = new Array(size);
		for (let i = 0; i < size; i++) {
			const el = gen();
			this.playNote(el);
			this.array[i] = el;
			await this.draw();
		}
	}

	async shuffle() {
		const length = this.length();
		for (let i = 0; i < length; i++) {
			const chosen = Math.round(Math.random() * (length - 1 - i) + i);
			await this.swap(chosen, i);
		}
	}

	async slice(lower: number, upperExclusive: number) {
		const array = [];
		for (let i = lower; i < upperExclusive; i++) {
			array.push(this.get(i));
		}
		return array;
	}

	async clearActive() {
		this.active = [];
		await this.draw();
	}
}
