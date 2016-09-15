import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Github } from '../shared/github';
import { Observable } from 'rxjs/Observable';
import { RepoList } from '../repo-list/repo-list'
import {Repo} from '../repo'

@Component({
  selector: 'repo-browser',
	directives: [RepoList],
  templateUrl: './repo-browser.html',
  styleUrls: ['./repo-browser.css']
})
export class RepoBrowser {
  repos: Observable<Repo[]>;

  constructor(private router: Router, private github: Github) {
  }

  searchUserFiles(fileType: string) {
		let user = 'ramziabbyad1';
		console.log('fileType = ' + fileType);
    this.repos = this.github.getReposForUserFileSearch(user, fileType);
		//this.repos.subscribe(results => console.log(results));
  }

}
