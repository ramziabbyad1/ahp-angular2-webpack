export interface Matrix {
	groupName: string;
	names: string[];
	data: number[][];
	consistencyRatio?: number;
	weights?: number[];
}

