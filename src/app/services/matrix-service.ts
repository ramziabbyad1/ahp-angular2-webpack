import { Injectable }    from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Matrix } from '../models/matrix';

@Injectable()
export class MatrixService {

  private matrixUrl = 'app/matrices';  // URL to web api
  constructor(private http: Http) { }

  getMatrices(): Promise<Matrix[]> {
    return this.http.get(this.matrixUrl)
               .toPromise()
               .then(response => {
											 console.log('response from matrix service');
											 console.log(response.json().data);
											 return response.json().data[0] as Matrix[];
							 })
               .catch(this.handleError);
  }

	/*
	 * Could break it into puts for each matrix but keep batched for now
	 * */

  save(matrices: Matrix[]): Promise<Matrix[]>  {
		console.log('saving matrices in service');
	 	return this.post(matrices);
  }

  // Add new Criterium
  private post(matrices: Matrix[]): Promise<Matrix[]> {
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
											 console.log('data from post');
											 console.log(res.json().data);
											 return res.json().data;
							 })
               .catch(this.handleError);
  }


  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
