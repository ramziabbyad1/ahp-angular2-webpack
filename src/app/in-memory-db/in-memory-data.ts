import {InMemoryDbService} from 'angular2-in-memory-web-api';

export class InMemoryData implements InMemoryDbService{
	createDb() {
		let criteria = [
			{id: 11, name: 'Decision', parent_name: null, parent_id: null, changed: true},
			{id: 22, name: 'A', parent_name: 'Decision', parent_id: 11, changed: false},
			{id: 33, name: 'B', parent_name: 'Decision', parent_id: 11, changed: false},
			{id: 44, name: 'C', parent_name: 'Decision', parent_id: 11, changed: false},
			{id: 55, name: 'A1', parent_name: 'A', parent_id: 22, changed: false},
			{id: 66, name: 'A2', parent_name: 'A', parent_id: 22, changed: false},
			{id: 77, name: 'B1', parent_name: 'B', parent_id: 33, changed: false},
			{id: 88, name: 'B2', parent_name: 'B', parent_id: 33, changed: false},
			{id: 99, name: 'A1-1', parent_name: 'A1', parent_id: 55, changed: false},
			{id: 100, name: 'A1-2', parent_name: 'A1', parent_id: 55, changed: false},
			{id: 101, name: 'A1-3', parent_name: 'A1', parent_id: 55, changed: false},
			{id: 102, name: 'A1-4', parent_name: 'A1', parent_id: 55, changed: false},
			{id: 103, name: 'A2-1', parent_name: 'A2', parent_id: 66, changed: false},
			{id: 104, name: 'A2-2', parent_name: 'A2', parent_id: 66, changed: false},
			{id: 105, name: 'A2-3', parent_name: 'A2', parent_id: 66, changed: false},
			{id: 106, name: 'B2-1', parent_name: 'B2', parent_id: 88, changed: false},
			{id: 107, name: 'B2-2', parent_name: 'B2', parent_id: 88, changed: false},
			{id: 108, name: 'B2-3', parent_name: 'B2', parent_id: 88, changed: false}
		];
		return {
				criteria: criteria,
				matrices: []
		};
	}

	
}
