export class Criterium {
	parent_id: number;	
	parent_name: string;	
	name: string;
	id: number;
	weight?: number;
	changed?: boolean;
	constructor(name?: string) {
		this.name = name;
	}
}
