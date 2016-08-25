export interface Matrix {
	id?: number;
	groupName: string;
	names: string[];
	data: number[][];
	consistencyRatio?: number;
	weights?: number[];
}

