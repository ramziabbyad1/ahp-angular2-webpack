import {Component, Input} from '@angular/core';
import {Github} from '../shared/github';
import {Observable} from 'rxjs/Observable';
import {ActivatedRoute} from '@angular/router';
import {Repo} from '../repo'

@Component({
  selector: 'repo-list',
  styleUrls: ['./repo-list.css'],
  templateUrl: './repo-list.html',
})
export class RepoList {
  org: string;
  @Input() repos: Observable<Repo[]>;

  constructor(public github: Github, private route: ActivatedRoute) {
  }

}
