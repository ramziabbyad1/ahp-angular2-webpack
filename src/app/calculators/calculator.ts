import * as numeric from 'numeric';
import {Matrix} from '../models/matrix';

export class Calculator {

	calculateAll(matrices: Matrix[]): void{
		matrices.forEach(m => this.calculate(m));	
	}

	calculate(matrix: Matrix): void {
		let result = this.eigs(matrix.data);
		let maxIndex = this.findMaxIndex(result);
		let N = result.E.x.length;

		matrix.consistencyRatio = 
			this.consistencyRatio(result.lambda.x[maxIndex], N);

		matrix.weights = numeric.transpose(result.E.x)[maxIndex];

		let weightScale = numeric.sum(matrix.weights);
		matrix.weights = matrix.weights
														.map(w => w / weightScale);

	}

	private consistencyRatio(lambda: number, dimension: number): number {
		return (lambda - dimension)/ (dimension - 1);
	}

	private findMaxIndex(result): number {
		let arr = result.lambda.x;
		let maxIndex = 0;
		let maxElem = arr[0];
		for (let curr_i = 1; curr_i < arr.length; curr_i++) {
			if (arr[curr_i] > maxElem) {
				maxIndex = curr_i;
				maxElem = arr[curr_i]
			}
		}
		return maxIndex;
	}


	private eigs(A: number[][]): any {
		return numeric.eig(A);
	}		
}
