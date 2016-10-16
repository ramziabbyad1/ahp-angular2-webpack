import { Injectable }    from '@angular/core';
import { Headers, Http, Jsonp, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/toPromise';

import { Criterium } from '../models/criterium';

@Injectable()
export class CriteriaService {

  private criteriaUrl = 'app/criteria';  // URL to web api
	private criteriaUrlTest = 'http://blog.app/ahpda';
	private subject;
  constructor(private http: Http, private jsonp: Jsonp) { }

  getCriteria(): Promise<Criterium[]> {
    return this.http.get(this.criteriaUrl)
               .toPromise()
               .then(response => response.json().data as Criterium[])
               .catch(this.handleError);
  }

  getCriteriaTest(id: number):Observable<Criterium[]>  {
    let params = new URLSearchParams();

		params.set('callback', 'JSONP_CALLBACK');
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    this.subject= this.jsonp
							.get(this.criteriaUrlTest+`/${id}`, {headers: headers, search: params})
              .map((response: Response) => {
									return response.json() as Criterium[];
							})
              .catch(this.handleErrorJsonp);
		console.log(this.subject);
		return this.subject;
		//this.subject.subscribe(r => console.log(r));
  }

  getCriterium(id: number): Promise<Criterium> {
    return this.getCriteria()
               .then(criteria => criteria.find(c => c.id === id));
  }

  save(criterium: Criterium): Promise<Criterium>  {
    if (criterium.id) {
      return this.put(criterium);
    }
	 	return this.post(criterium);

  }

  delete(criterium: Criterium): Promise<Response> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let url = `${this.criteriaUrl}/${criterium.id}`;
    return this.http
               .delete(url, {headers: headers})
               .toPromise()
               .catch(this.handleError);
  }

  // Add new Criterium
  private post(criterium: Criterium): Promise<Criterium> {
    let headers = new Headers({
      'Content-Type': 'application/json'});
    return this.http
               .post(this.criteriaUrl, JSON.stringify(criterium), {headers: headers})
               .toPromise()
               .then(res => res.json().data)
               .catch(this.handleError);
  }

  // Update existing Criterium
  private put(criterium: Criterium): Promise<Criterium> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let url = `${this.criteriaUrl}/${criterium.id}`;
    return this.http
               .put(url, JSON.stringify(criterium), {headers: headers})
               .toPromise()
               .then(() => criterium)
               .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
 	private handleErrorJsonp(error: any) {
 	   let errMsg = (error.message) ? error.message :
 	     error.status ? `${error.status} - ${error.statusText}` : 'Server error';
 	   console.error(errMsg); // log to console instead
 	   return Observable.throw(errMsg);
 	 }
}
