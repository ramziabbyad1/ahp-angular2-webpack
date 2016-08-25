import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

import * as D3 from 'd3';

import {Hierarchy} from '../../components/hierarchy/hierarchy';
import {PieChart} from '../../components/charts/pie-chart';
import {MatrixService} from '../../services/matrix-service';
import {Matrix}	from '../../models/matrix';
import {Matrices}	from '../../models/matrices';

@Component({
	selector: 'comparison-results',
	directives: [Hierarchy, PieChart],
	templateUrl: 'comparison-results.html',
	styleUrls: ['comparison-results.css']
})

export class ComparisonResults implements OnInit {
	
	@Input() matrices: Matrices;
	@Output() close = new EventEmitter();
	private navigated=false;
	error: any;
	
	constructor(
		//private comparison
		private matrixService: MatrixService,
		private route: ActivatedRoute	){}

	/*
	 * TODO: could do with better error handling
	 * */
	ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      if (params['naved'] !== undefined) {
        let id = +params['naved'];
        this.navigated = true;
				this.matrixService.getMatrices()
						.then(matrices => {
										this.matrices=matrices;
						})
						.catch(e => this.error = e);			
      } else {
        this.navigated = false;
      }
		});
	}	

  goBack(comparisonsSaved: boolean = true): void {
    this.close.emit(comparisonsSaved);
    if (this.navigated) { window.history.back(); }
  }
}
