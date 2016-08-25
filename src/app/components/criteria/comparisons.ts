import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {Criterium} from '../../models/criterium';
import {Group} from '../../models/group';
import {Pair} from '../../models/pair';
import {CriteriaService} from '../../services/criteria-service';
import {Calculator}  from '../../calculators/calculator';
import {Matrix}				from '../../models/matrix';
import {Matrices}				from '../../models/matrices';
import {MatrixService} from '../../services/matrix-service';

@Component({
	selector: 'comparisons',
	templateUrl: 'comparisons.html',
	styleUrls: ['./comparisons.css']
})

export class Comparisons implements OnInit {
	private criteria: Criterium[];	
	private comparisonsSaved = false;
	private groups_obj: any;
	@Input() private groups: Group[];
	private calculator: Calculator;
	@Input() private matrices: Matrices;
	private CONVERSIONS = {
		'1': 1/9, '2': 1/8, '3': 1/7, '4': 1/6, '5': 1/5, '6': 1/4, '7': 1/3,
		'8': 1/2, '9': 1, '10': 2, '11': 3, '12': 4, '13': 5, '14': 6, '15': 7,
		'16': 8, '17': 9
	};
	
	error: any;

	constructor(
		private criteriaService: CriteriaService,
		private matrixService: MatrixService,
		private router: Router
	){
		this.calculator = new Calculator();
	}
	//this works okay, but if you use only matrices with names replaced by criteria it will be best
	ngOnInit() {
		this.groups = [];
		this.groups_obj = {};
		this.matrixService
			.getMatrices()
			.then(matrices => {

					this.matrices = matrices  || new Matrices();

					this.criteriaService
						.getCriteria()
						.then(criteria => {
							this.criteria = criteria;
							let changed = this.criteriaChanged(this.criteria);
							/*
							 * If changed, clear all comparisons, otherwise use saved matrices
							 * */
							if (changed) {
								this.matrices.matrices = [];
								this.groupBy(this.criteria);
							} 
							else {
								this.constructGroupsFromMatrices();
							}
							this.clearCriteria(this.criteria);
						})
						.catch(error => this.error = error);
			})
			.catch(error => this.error = error);
	}

	private criteriaChanged(criteria: Criterium[]): boolean {
		for(let criterium of criteria) {
			if(criterium.changed) return true;
		}
		return false;
	}

	private clearCriteria(criteria: Criterium[]): void {
		criteria.forEach(c => c.changed = false);
		let criterium = criteria[0];
		criterium.changed = false;

	}

	/*
	 *TODO: we can work with JUST matrices, not both groups and matrices
	 * */

	private constructGroupsFromMatrices(): void {
		this.groups = [];
		for(let matrix of this.matrices.matrices) {
			let group = new Group(matrix.groupName);
			group.dimension = matrix.names.length;
			for(let i = 0; i < matrix.names.length; i++) {
				for(let j = i+1; j < matrix.names.length; j++) {
					let pair = new Pair(new Criterium(matrix.names[i]), 
															new Criterium(matrix.names[j]));
					if (matrix.data[i][j] < 1) {
						pair.score = ""+ (matrix.data[j][i] - 8);
					} else {
						pair.score = ""+(matrix.data[i][j] + 8);
					}
					group.pairs.push(pair);
				}
			}
			this.groups.push(group);
		}
		console.log(this.groups);
	}

	private groupBy(criteria: Criterium[]): void {
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

	private pairwiseGroup(groups_obj: any): void {
		this.groups = [];
		for (let key in groups_obj) {
			if (groups_obj[key].length > 1) {
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
	}

	private loadMatrices(): void {
		this.matrices = new Matrices();
		this.groups.forEach(
			(g, groupIndex) => this.loadUpperTriangle(g, groupIndex)
		);
		this.invertUpperTriangle();
	}

	/*
	 * Load user provided comparisons into the upper triangle
	 * TODO: get rid of some of the confusion by seperating out into:
	 * 0) load an empty Matrix
	 * 1) init zeros using numeric.rep
	 * 2) extract names
	 * 3) load upper triangle
	 * TODO: this logic looks like it belongs in Matrix
	 * */
	private loadUpperTriangle(g: Group, groupIndex: number) {
		this.matrices.matrices.push({
			groupName: g.groupName,
			names: [],
			data: []
		});
		let dim = g.dimension;
		let pair_index = 0;
		let matrix: Matrix = this.matrices.matrices[groupIndex];
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
							.push(this.CONVERSIONS[g.pairs[pair_index].score]);
					++pair_index;
				} else {
					matrix.data[row].push(0);
				}
			}
		}
	}

	private invertUpperTriangle(): void {
		for(let matrixIndex = 0; matrixIndex < this.matrices.matrices.length; matrixIndex++)
		{
			let matrix: number[][] =this.matrices.matrices[matrixIndex].data;
			for(let row = 0; row < matrix.length; row++) {
				for(let col = 0; col < row; col++) {
					matrix[row][col] = 1/matrix[col][row];
				}
			}
		}
	}

  save(): void {
    this.matrixService
				.delete(1)
				.then(() =>
        	this.matrixService.save(this.matrices)
        		.then(matrices => {
        		  this.matrices = matrices; // saved criterium, w/ id if new
        		  this.goToResults(matrices);
        		})
					)
        	.catch(error => this.error = error); // TODO: Display error message
		this.criteriaService
			.save(this.criteria[0])
			.catch(e => this.error = e);
  }

	onCompute(): void {
		this.loadMatrices();
		this.calculator.calculateAll(this.matrices.matrices);	
		this.save();
	}

	goToResults(matrices: Matrices): void {
		this.router.navigate(['/results', true]);
	}

}


