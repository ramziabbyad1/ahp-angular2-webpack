import {Component, OnInit} from '@angular/core';

import {Criterium} from '../../models/criterium';
import {Group} from '../../models/group';
import {Pair} from '../../models/pair';
import {CriteriaService} from '../../services/criteria-service';
import {Calculator}  from '../../calculators/calculator';
import {Matrix}				from '../../models/matrix';

@Component({
	selector: 'comparisons',
	templateUrl: 'comparisons.html',
	styleUrls: ['./comparisons.css']
})

export class Comparisons implements OnInit {
	private criteria: Criterium[];	
	private groups_obj: any;
	private groups: Group[];
	private calculator: Calculator;
	private matrices: Matrix[] = [];
	
	error: any;

	constructor(
					private criteriaService: CriteriaService
	){
		this.calculator = new Calculator();
	}

	ngOnInit() {
		this.groups = [];
		this.groups_obj = {};
		this.criteriaService
				.getCriteria()
				.then(criteria => {
					this.criteria = criteria;
					this.groupBy(criteria);
				})
				.catch(error => this.error = error);
	}

	groupBy(criteria: Criterium[]): void {
		criteria.reduce(
			(acc, item) => {
				let key = item.parent_name;
				key && (acc[key] = acc[key] || []);
				key && acc[key].push(item);
				return acc;
			}
		, this.groups_obj);
		this.pairwiseGroup(this.groups_obj);
	}

	/*
	 * This is the ghetto way, a better way is to use D3 to do topological sort
	 * 
	 * */

	pairwiseGroup(groups_obj: any): void {
		for(let key in groups_obj) {
			let criteria: Criterium[] = groups_obj[key];
			let group:Group = new Group(key);
			group.dimension = criteria.length;
			for(let i = 0; i < criteria.length; i++) {
				for(let j = i+1; j < criteria.length; j++) {
					group.pairs.push(new Pair(criteria[i], criteria[j]));
				}
			}
			this.groups.push(group);
		}
	}

	loadMatrices(): void {
		this.groups.forEach(
			(g, groupIndex) => {
				this.matrices.push({
					groupName: g.groupName,
					names: [],
					data: []
				});
				let dim = g.dimension;
				let pair_index = 0;
				let matrix: Matrix = this.matrices[groupIndex];
				if(g.pairs.length > 0) {
					matrix.names.push(g.pairs[0].left.name);
				}
				for(let row = 0; row < dim; row++) {
					matrix.data.push([]);
					for(let col = 0; col < dim; col++) {
						if(row == col) {
							matrix.data[row].push(1);
							if(row !== (dim-1)) {
								matrix.names.push(g.pairs[row].right.name);
							}
						} else if(row < col) {
							matrix
									.data[row]
									.push(+g.pairs[pair_index].score);
							++pair_index;
						} else {
							matrix.data[row].push(0);
						}
					}
				}
			console.log('done');
			}
		);
		console.log(this.matrices);
	}

	invertUpperTriangle(): void {
		for(let matrixIndex = 0; matrixIndex < this.matrices.length; matrixIndex++)		{
			let matrix: number[][] =this.matrices[matrixIndex].data;
			for(let row = 0; row < matrix.length; row++) {
				for(let col = 0; col < row; col++) {
					matrix[row][col] = 1/matrix[col][row];
				}
			}
		}
	}

	onCompute(): void {
		this.loadMatrices();
		this.invertUpperTriangle();
		console.log(this.matrices);
		console.log(this.calculator.eigs([[1,2,3],[4,5,6],[7,8,9]]));
	}

}


