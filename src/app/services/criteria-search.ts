import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { Criterium }           from '../models/criterium';

@Injectable()
export class CriteriaSearchService {
  constructor(private http: Http) {}
  search(term: string): Observable<Criterium[]> {
    return this.http
               .get(`app/criteria/?name=${term}`)
               .map((r: Response) => r.json().data as Criterium[]);
  }
}

