import {Component, OnInit} 	from '@angular/core';
import {Router} 						from '@angular/router';

import {Criterium} 					from '../../models/criterium';
import {CriteriaService} 	from '../../services/criteria-service';

@Component({
	selector: 'criteria',
	providers: [CriteriaService],
	templateUrl: 'criteria.html',
	styleUrls: ['criteria.css']
})

export class Criteria implements OnInit {
	criteria: Criterium[];
	selectedCriterium: Criterium;
	addingCriterium = false;
	error: any;

	constructor(
		private router: Router,
		private criteriaService: CriteriaService
	){}

	getCriteria(): void {
		console.log("hi");
		this.criteriaService
				.getCriteria()
				.then(criteria => this.criteria = criteria)
				.catch(error => this.error = error);
	}	

	addCriterium(): void {
		this.addingCriterium = true;
		this.selectedCriterium = null;
	}

	close(savedCriterium: Criterium): void {
		this.addingCriterium = false;
		if (savedCriterium) {this.getCriteria();}
	}

	deleteCriterium(criterium: Criterium, event: any): void {
		event.stopPropagation();
		this.criteriaService
				.delete(criterium)
				.then(res => {
					this.criteria = this.criteria.filter(c => c !== criterium);
					if (this.selectedCriterium === criterium) {
						this.selectedCriterium = null;
					}
				})
				.catch(error => this.error = error);
	}

	ngOnInit(): void {
		console.log('oninit criteria list');
		this.getCriteria();
	}

	onSelect(criterium: Criterium): void {
		this.selectedCriterium = criterium;
		this.addingCriterium = false;
	}

	gotoDetail(): void {
		this.router.navigate([
				'/detail', 
				this.selectedCriterium.id
		]);
	}

}