import { Injectable }    from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Matrix } from '../models/matrix';
import { Matrices } from '../models/matrices';

@Injectable()
export class MatrixService {

  private matrixUrl = 'app/matrices';  // URL to web api
  constructor(private http: Http) { }

  getMatrices(): Promise<Matrices> {
    return this.http.get(this.matrixUrl)
               .toPromise()
               .then(response => {
											 return response.json().data[0] as Matrices;
							 })
               .catch(this.handleError);
  }

	/*
	 * Could break it into puts for each matrix but keep batched for now
	 * */

  save(matrices: Matrices): Promise<Matrices>  {
	 	return this.post(matrices);
  }

  delete(id: number): Promise<Response> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let url = `${this.matrixUrl}/${id}`;
    return this.http
               .delete(url, {headers: headers})
               .toPromise()
               .catch(this.handleError);
  }

  // Add new Criterium
  private post(matrices: Matrices): Promise<Matrices> {
    let headers = new Headers({
      'Content-Type': 'application/json'});
    return this.http
               .post(
										this.matrixUrl, 
										JSON.stringify(matrices), 
										{headers: headers}
								)
               .toPromise()
               .then(res => {
											 return res.json().data;
							 })
               .catch(this.handleError);
  }


  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
