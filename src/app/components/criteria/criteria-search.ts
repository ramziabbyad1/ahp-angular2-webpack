import { Component, Input, EventEmitter, OnInit, Output } from '@angular/core';
import { Router }            from '@angular/router';
import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';
import { CriteriaSearchService } from '../../services/criteria-search';
import { Criterium } from '../../models/criterium';

@Component({
  selector: 'criteria-search',
  templateUrl: 'criteria-search.html',
  styleUrls:  ['criteria-search.css'],
  providers: [CriteriaSearchService]
})
export class CriteriaSearch implements OnInit {
  criteria: Observable<Criterium[]>;
	@Input() childCriterium: Criterium;
	//@Output() talk = new EventEmitter();
  private searchTerms = new Subject<string>();

  constructor(
    private criteriaSearchService: CriteriaSearchService,
    private router: Router) {}
  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }
  ngOnInit(): void {
    this.criteria = this.searchTerms
      .debounceTime(300)        // wait for 300ms pause in events
      .distinctUntilChanged()   // ignore if next search term is same as previous
      .switchMap(term => term   // switch to new observable each time
        // return the http search observable
        ? this.criteriaSearchService.search(term)
        // or the observable of criteria heroes if no search term
        : Observable.of<Criterium[]>([]))
      .catch(error => {
        // TODO: real error handling
        console.log(error);
        return Observable.of<Criterium[]>([]);
      });
  }

	//bubble chosen parent up

	chooseParent(chosenParent: Criterium): void {
		this.childCriterium.parent_id = chosenParent.id;
		this.childCriterium.parent_name = chosenParent.name;
		this.criteria = null;
	}
}
