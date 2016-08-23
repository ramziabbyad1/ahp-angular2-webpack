import {Pair} from './pair';

export class Group {
	dimension: number;
	groupName: string;
	pairs: Pair[] = [];	
	constructor(groupName: string) {this.groupName = groupName;} 
}
