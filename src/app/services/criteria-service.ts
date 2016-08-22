import { Injectable }    from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Criterium } from '../models/criterium';

@Injectable()
export class CriteriaService {

  private criteriaUrl = 'app/criteria';  // URL to web api
  constructor(private http: Http) { }

  getCriteria(): Promise<Criterium[]> {
    return this.http.get(this.criteriaUrl)
               .toPromise()
               .then(response => response.json().data as Criterium[])
               .catch(this.handleError);
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
}
