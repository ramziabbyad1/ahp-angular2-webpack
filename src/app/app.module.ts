import {NgModule} from '@angular/core'
import {RouterModule} from "@angular/router";
import {rootRouterConfig} from "./app.routes";
import {AppComponent} from "./app";
import {Github} from "./github/shared/github";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {HttpModule} from "@angular/http";
import {About} from './about/about';
import {Home} from './home/home';
import {RepoBrowser} from './github/repo-browser/repo-browser';
import {RepoList} from './github/repo-list/repo-list';
import {RepoDetail} from './github/repo-detail/repo-detail';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';

// Imports for loading & configuring the in-memory web api
import { XHRBackend } from '@angular/http';
import { InMemoryBackendService, SEED_DATA } from 'angular2-in-memory-web-api';
import { InMemoryData }               from './in-memory-db/in-memory-data';
import { Criteria }      from './components/criteria/criteria';
import { CriteriumDetail }  from './components/criteria/criterium-detail';
import { CriteriaService }          from './services/criteria-service';
import { CriteriaSearch }          from './components/criteria/criteria-search';

@NgModule({
  declarations: [
		AppComponent, 
		About, 
		RepoBrowser, 
		RepoList, 
		RepoDetail, 
		Home,
		Criteria,
		CriteriaSearch,
		CriteriumDetail
	],
  imports     : [BrowserModule, FormsModule, HttpModule, RouterModule.forRoot(rootRouterConfig)],
  providers   : [
		Github, 
		CriteriaService,
		{provide: LocationStrategy, useClass: HashLocationStrategy},
		{provide: XHRBackend, useClass: InMemoryBackendService},
		{provide: SEED_DATA, useClass: InMemoryData}
	],
  bootstrap   : [AppComponent]
})
export class AppModule {

}
