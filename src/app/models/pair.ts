import {Criterium} from './criterium';

export class Pair {
	left: Criterium; right: Criterium;
	score: string =  "9";
	constructor(left: Criterium, right: Criterium) {
					this.left = left; 
					this.right= right;
	}
}
