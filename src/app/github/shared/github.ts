import { Injectable } from '@angular/core';
import { Jsonp, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {Repo} from '../repo'

@Injectable()
export class Github {
  constructor(private jsonp: Jsonp) {}

  getOrg(org: string) {
    return this.makeRequest(`orgs/${org}`);
  }

  getReposForOrg(org: string) {
    return this.makeRequest(`orgs/${org}/repos`);
  }

  getRepoForOrg(org: string, repo: string) {
    return this.makeRequest(`repos/${org}/${repo}`);
  }

	getReposForUserFileSearch(user: string, fileType: string) {
		return this.makeRequest(`search/repositories?q=user:${user}+language:${fileType}`);
	}

  private makeRequest(path: string): Observable<Repo[]> {
    let params = new URLSearchParams();
    params.set('per_page', '100');
		params.set('callback', 'JSONP_CALLBACK');

    let url = `https://api.github.com/${ path }`;
		console.log('url');
		console.log(url);
    return this.jsonp.get(url, {search: params})
      .map((res: Response) => res.json().data.items as Repo[])
			.catch(this.handleError);
  }

 	private handleError (error: any) {
 	   let errMsg = (error.message) ? error.message :
 	     error.status ? `${error.status} - ${error.statusText}` : 'Server error';
 	   console.error(errMsg); // log to console instead
 	   return Observable.throw(errMsg);
 	 }
}
