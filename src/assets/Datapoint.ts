export type Month = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export type Gender = 'Combined' | 'Men' | 'Women';

export interface Datapoint {
	gender: Gender;
	month: Month;
	source: string;
	year: number;
	value: number | null;
}
