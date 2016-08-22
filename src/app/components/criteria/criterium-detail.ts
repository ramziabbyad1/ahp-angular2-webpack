import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {ActivatedRoute, Params} from '@angular/router';

import {Criterium} from '../../models/criterium';
import {CriteriaService} from '../../services/criteria-service';
import {CriteriaSearch} from './criteria-search';

@Component({
	selector: 'criterium-detail',
	directives: [CriteriaSearch],
	templateUrl: 'criterium-detail.html',
	styleUrls: ['criterium-detail.css']
})

export class CriteriumDetail implements OnInit {
	@Input() criterium: Criterium;
	@Output() close = new EventEmitter();
	error: any;
	navigated = false; //true if navigated here

	constructor(
		private criteriaService: CriteriaService,
		private route: ActivatedRoute
	){}

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      if (params['id'] !== undefined) {
        let id = +params['id'];
        this.navigated = true;
        this.criteriaService.getCriterium(id)
            .then(criterium => this.criterium = criterium);
      } else {
        this.navigated = false;
        this.criterium = new Criterium();
      }
    });
  }

  save(): void {
    this.criteriaService
        .save(this.criterium)
        .then(criterium => {
          this.criterium = criterium; // saved criterium, w/ id if new
          this.goBack(criterium);
        })
        .catch(error => this.error = error); // TODO: Display error message
  }

  goBack(savedCriterium: Criterium = null): void {
    this.close.emit(savedCriterium);
    if (this.navigated) { window.history.back(); }
  }
}
