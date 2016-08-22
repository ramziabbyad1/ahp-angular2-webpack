export class InMemoryData {
	createDb() {
		let criteria = [
			{id: 11, name: 'Eve', parent_name: null, parent_id: null},
			{id: 22, name: 'Cain', parent_name: 'Eve', parent_id: 11},
			{id: 33, name: 'Seth', parent_name: 'Eve', parent_id: 11},
			{id: 44, name: 'Abel', parent_name: 'Eve', parent_id: 11},
			{id: 55, name: 'Awan', parent_name: 'Eve', parent_id: 11},
			{id: 66, name: 'Azura', parent_name: 'Eve', parent_id: 11},
			{id: 77, name: 'Enos', parent_name: 'Seth', parent_id: 33},
			{id: 88, name: 'Noam', parent_name: 'Seth', parent_id: 33},
			{id: 99, name: 'Enoch', parent_name: 'Awan', parent_id: 55}
		];
		return {criteria};
	}
}
