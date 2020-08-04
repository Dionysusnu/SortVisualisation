type SortAlgorithm = (state: State<number>) => Promise<void>;
enum CompareResult {
	Equal = "0",
	Greater = "1",
	Smaller = "-1",
}
type Comparison = (a: number, b: number) => CompareResult;
enum FillType {
	Random = "Random",
	Shuffled = "Shuffled",
	Reversed = "Reversed",
	Sorted = "Sorted",
	Equal = "Equal",
}
type ArrayValue<T extends Array<unknown>> = T extends Array<infer R> ? R : never;
