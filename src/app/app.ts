import {Component, OnInit} from '@angular/core';

import {Criterium} from './models/criterium'
import {CriteriaService} from './services/criteria-service';

import './rxjs-extensions';

@Component({
  selector   : 'app',
  templateUrl: 'app.html',
})
export class AppComponent {
/*
	private criteria: Criterium[];
	error: any;

	constructor(private criteriaService: CriteriaService) { }

	getCriteria(): void {
		this.criteriaService
				.getCriteria()
				.then(criteria => this.criteria = criteria)
				.catch(error => this.error = error);
	}	

 	ngOnInit(): void {
		console.log('oninit app comp');

	}
*/
}
