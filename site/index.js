"use strict";
class ElementSelect {
    constructor(element, obj) {
        this.element = element;
        this.obj = obj;
        for (const name of Object.keys(obj)) {
            const x = document.createElement("OPTION");
            x.setAttribute("value", name);
            const t = document.createTextNode(name);
            x.appendChild(t);
            this.element.appendChild(x);
        }
    }
    getChoice() {
        return this.obj[this.element.options[this.element.selectedIndex].value];
    }
}
class State {
    constructor(oscillator) {
        this.oscillator = oscillator;
        this.active = [];
        this.array = [];
        this.canvas = document.getElementById("MAIN_CANVAS") ?? new HTMLCanvasElement();
        this.context = this.canvas.getContext("2d");
    }
    async overwrite(start, amount, ...args) {
        this.active = range(start, start + amount);
        this.playNote(args[0]);
        this.array.splice(start, amount, ...args);
        await this.draw();
    }
    async swap(a, b) {
        this.active = [a, b];
        this.playNote(this.get(a));
        if (a < 0 || a > this.length() - 1)
            throw RangeError();
        if (b < 0 || b > this.length() - 1)
            throw RangeError();
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
    async compare(a, b) {
        this.playNote(a);
        if (a > b) {
            return CompareResult.Greater;
        }
        else if (a < b) {
            return CompareResult.Smaller;
        }
        else {
            return CompareResult.Equal;
        }
    }
    get(i) {
        if (i < 0 || i >= this.length())
            throw RangeError();
        return this.array[i];
    }
    set(i, el) {
        if (i < 0 || i >= this.length())
            throw RangeError();
        this.array[i] = el;
    }
    length() {
        return this.array.length;
    }
    drawBar(i, height, width) {
        this.context.fillRect(i * width, this.canvas.height - height, width, height);
    }
    async draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const length = this.length();
        for (let i = 0; i < length; i++) {
            if (this.active.some((v) => v === i)) {
                this.context.fillStyle = "rgb(255, 0, 0)";
            }
            const val = this.get(i);
            this.drawBar(i, val !== undefined ? 10 + map(this.get(i)?.valueOf() ?? 0, 1, length, 1, this.canvas.height - 10) : 0, this.canvas.width / length);
            this.context.fillStyle = "rgb(0, 0, 0)";
        }
        await sleep(0);
    }
    playNote(value) {
        const frequency = map(value.valueOf(), 1, this.length(), 300, 2400);
        try {
            this.oscillator.frequency.value = frequency;
        }
        catch (error) {
            console.error(`frequency=${frequency} error=${error}`);
        }
    }
    async fill(size, gen) {
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
    async slice(lower, upperExclusive) {
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
function loaded() {
    const Algorithms = {
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
    const Fills = {
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
    const elementSelect = document.getElementById("ELEMENT_SELECT");
    const algorithmSelect = new ElementSelect(document.getElementById("ALGORITHM_SELECT"), Algorithms);
    const inputSelect = new ElementSelect(document.getElementById("FILL_SELECT"), Fills);
    async function play() {
        const audioCtx = new window.AudioContext();
        const oscillator = audioCtx.createOscillator();
        oscillator.type = "triangle";
        oscillator.connect(audioCtx.destination);
        oscillator.start();
        const algorithm = algorithmSelect.getChoice();
        const elementCount = parseInt(elementSelect.value) || algorithm[1];
        const state = new State(oscillator);
        const chosenFill = inputSelect.getChoice();
        await chosenFill(state, elementCount);
        await algorithm[0](state);
        await state.clearActive();
        oscillator.stop();
    }
    document.getElementById("START_BUTTON").onclick = play;
}
var CompareResult;
(function (CompareResult) {
    CompareResult["Equal"] = "0";
    CompareResult["Greater"] = "1";
    CompareResult["Smaller"] = "-1";
})(CompareResult || (CompareResult = {}));
var FillType;
(function (FillType) {
    FillType["Random"] = "Random";
    FillType["Shuffled"] = "Shuffled";
    FillType["Reversed"] = "Reversed";
    FillType["Sorted"] = "Sorted";
    FillType["Equal"] = "Equal";
})(FillType || (FillType = {}));
function map(num, fromBottom, fromTop, toBottom, toTop) {
    const toDiff = toTop - toBottom;
    const fromDiff = fromTop - fromBottom;
    const frac = (num - fromBottom) / fromDiff;
    return toBottom + frac * toDiff;
}
function range(lower, upper) {
    const array = [];
    for (let i = lower; i <= upper; i++) {
        array.push(i);
    }
    return array;
}
async function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
var BogoSort;
(function (BogoSort) {
    BogoSort.algorithm = async (state) => {
        while (!(await state.isSorted())) {
            await state.shuffle();
        }
    };
})(BogoSort || (BogoSort = {}));
var BubbleSort;
(function (BubbleSort) {
    BubbleSort.algorithm = async (state) => {
        const length = state.length();
        for (let i = 0; i < length; i++) {
            for (let j = 0; j < length - i - 1; j++) {
                if ((await state.compare(state.get(j + 1), state.get(j))) === CompareResult.Smaller) {
                    await state.swap(j, j + 1);
                }
            }
        }
    };
})(BubbleSort || (BubbleSort = {}));
var GnomeSort;
(function (GnomeSort) {
    GnomeSort.algorithm = async (state) => {
        let index = 0;
        while (index < state.length()) {
            if (index === 0) {
                index++;
            }
            if ((await state.compare(state.get(index), state.get(index - 1))) !== CompareResult.Smaller) {
                index++;
            }
            else {
                await state.swap(index, index - 1);
                index--;
            }
        }
    };
})(GnomeSort || (GnomeSort = {}));
var HeapSort;
(function (HeapSort) {
    function parent(i) {
        return Math.floor((i - 1) / 2);
    }
    function lChild(i) {
        return i * 2 + 1;
    }
    async function siftDown(i, state, heapLength) {
        const root = i;
        const lChildI = lChild(root);
        let swap = root;
        if (lChildI < heapLength &&
            (await state.compare(state.get(swap), state.get(lChildI))) === CompareResult.Smaller) {
            swap = lChildI;
        }
        if (lChildI + 1 < heapLength &&
            (await state.compare(state.get(swap), state.get(lChildI + 1))) === CompareResult.Smaller) {
            swap = lChildI + 1;
        }
        if (swap !== root) {
            await state.swap(root, swap);
            await siftDown(swap, state, heapLength);
        }
    }
    async function heapify(state) {
        let i = parent(state.length() - 1);
        while (i >= 0) {
            await siftDown(i, state, state.length());
            i--;
        }
    }
    HeapSort.algorithm = async (state) => {
        await heapify(state);
        let sorted = 0;
        while (sorted !== state.length()) {
            await state.swap(0, state.length() - sorted - 1);
            sorted++;
            await siftDown(0, state, state.length() - sorted);
        }
    };
})(HeapSort || (HeapSort = {}));
var InsertionSort;
(function (InsertionSort) {
    InsertionSort.algorithm = async (state) => {
        for (let i = 1; i < state.length(); i++) {
            const element = state.get(i);
            let sorted = false;
            let comparing = i;
            while (!sorted) {
                comparing--;
                if (comparing < 0) {
                    sorted = true;
                }
                else if ((await state.compare(element, state.get(comparing))) !== CompareResult.Smaller) {
                    sorted = true;
                }
                else {
                    await state.swap(comparing, comparing + 1);
                }
            }
        }
    };
})(InsertionSort || (InsertionSort = {}));
var MergeSort;
(function (MergeSort_1) {
    async function MergeSort(state, starti, numElements) {
        if (numElements > 1) {
            const half = Math.floor(numElements / 2);
            await MergeSort(state, starti, half);
            await MergeSort(state, starti + half, numElements - half);
            const Larray = await state.slice(starti, starti + half);
            const Rarray = await state.slice(starti + half, starti + numElements);
            let insertPos = starti;
            while (Larray.length && Rarray.length) {
                const Lelement = Larray.shift();
                const Relement = Rarray.shift();
                if ((await state.compare(Lelement, Relement)) === CompareResult.Greater) {
                    await state.overwrite(insertPos, 1, Relement);
                    Larray.unshift(Lelement);
                }
                else {
                    await state.overwrite(insertPos, 1, Lelement);
                    Rarray.unshift(Relement);
                }
                insertPos++;
            }
            await state.overwrite(insertPos, Larray.length + Rarray.length, ...Larray, ...Rarray);
        }
    }
    MergeSort_1.algorithm = async (state) => MergeSort(state, 0, state.length());
})(MergeSort || (MergeSort = {}));
var MergeSortInPlace;
(function (MergeSortInPlace_1) {
    async function merge(state, start, mid, end) {
        let start2 = mid + 1;
        if ((await state.compare(state.get(mid), state.get(start2))) !== CompareResult.Greater) {
            return;
        }
        while (start <= mid && start2 <= end) {
            if ((await state.compare(state.get(start), state.get(start2))) !== CompareResult.Greater) {
                start++;
            }
            else {
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
    async function MergeSortInPlace(state, start, end) {
        if (start < end) {
            const m = Math.floor((start + end) / 2);
            await MergeSortInPlace(state, start, m);
            await MergeSortInPlace(state, m + 1, end);
            await merge(state, start, m, end);
        }
    }
    MergeSortInPlace_1.algorithm = async (state) => MergeSortInPlace(state, 0, state.length() - 1);
})(MergeSortInPlace || (MergeSortInPlace = {}));
var PancakeSort;
(function (PancakeSort) {
    async function flip(state, back) {
        let front = 0;
        while (front < back) {
            await state.swap(front, back);
            front++;
            back--;
        }
    }
    async function findMax(state, n) {
        let maxi = n - 1;
        for (let i = n - 1; i >= 0; i--) {
            if ((await state.compare(state.get(maxi), state.get(i))) === CompareResult.Smaller) {
                maxi = i;
            }
        }
        return maxi;
    }
    PancakeSort.algorithm = async (state) => {
        for (let notSortedYet = state.length(); notSortedYet > 1; --notSortedYet) {
            const maxi = await findMax(state, notSortedYet);
            if (maxi !== notSortedYet - 1) {
                await flip(state, maxi);
                await flip(state, notSortedYet - 1);
            }
        }
    };
})(PancakeSort || (PancakeSort = {}));
var QuickSort;
(function (QuickSort_1) {
    async function QuickSort(state, starti, numElements) {
        if (numElements > 1) {
            const partitioni = Math.round(starti + Math.random() * (numElements - 1));
            const partition = state.get(partitioni);
            await state.swap(partitioni, starti + numElements - 1);
            let greaterStart = starti;
            let unsortedStart = starti;
            for (let i = starti; i < numElements + starti - 1; i++) {
                const element = state.get(i);
                if ((await state.compare(element, partition)) !== CompareResult.Smaller) {
                    unsortedStart++;
                }
                else {
                    await state.swap(i, greaterStart);
                    greaterStart++;
                    unsortedStart++;
                }
            }
            await state.swap(greaterStart, starti + numElements - 1);
            await QuickSort(state, starti, greaterStart - starti);
            await QuickSort(state, greaterStart + 1, unsortedStart - greaterStart);
        }
    }
    QuickSort_1.algorithm = async (state) => QuickSort(state, 0, state.length());
})(QuickSort || (QuickSort = {}));
var SelectionSort;
(function (SelectionSort) {
    SelectionSort.algorithm = async (state) => {
        for (let i = 0; i < state.length() - 1; i++) {
            let element = state.get(i + 1);
            let chosen = i + 1;
            for (let comparing = i + 2; comparing < state.length(); comparing++) {
                if ((await state.compare(state.get(comparing), element)) === CompareResult.Smaller) {
                    chosen = comparing;
                    element = state.get(chosen);
                }
            }
            if ((await state.compare(state.get(i), state.get(chosen))) === CompareResult.Greater) {
                await state.swap(i, chosen);
            }
        }
    };
})(SelectionSort || (SelectionSort = {}));
var SleepSort;
(function (SleepSort) {
    SleepSort.algorithm = async (state) => {
        const array = [];
        let written = 0;
        for (let i = 0; i < state.length(); i++) {
            const value = state.get(i);
            array.push(sleep(value * 10).then(() => state.overwrite(written++, 1, value)));
        }
        await Promise.all(array);
    };
})(SleepSort || (SleepSort = {}));
var SlowSort;
(function (SlowSort_1) {
    async function SlowSort(state, start, end) {
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
    SlowSort_1.algorithm = async (state) => SlowSort(state, 0, state.length() - 1);
})(SlowSort || (SlowSort = {}));
var StoogeSort;
(function (StoogeSort_1) {
    async function StoogeSort(state, start, end) {
        if (end - start === 0) {
            return;
        }
        if (end - start === 1) {
            if ((await state.compare(state.get(start), state.get(end))) === CompareResult.Greater) {
                await state.swap(start, end);
            }
            return;
        }
        const aThird = Math.floor((end - start + 1) / 3) + start;
        const twoThird = Math.ceil(((end - start + 1) / 3) * 2) + start - 1;
        await StoogeSort(state, start, twoThird);
        await StoogeSort(state, aThird, end);
        await StoogeSort(state, start, twoThird);
    }
    StoogeSort_1.algorithm = async (state) => StoogeSort(state, 0, state.length() - 1);
})(StoogeSort || (StoogeSort = {}));
