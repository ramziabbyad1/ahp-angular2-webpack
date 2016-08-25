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
import { Comparisons }      from './components/criteria/comparisons';
import { CriteriumDetail }  from './components/criteria/criterium-detail';
import { CriteriaService }          from './services/criteria-service';
import { CriteriaSearch }          from './components/criteria/criteria-search';
import { MatrixService }          from './services/matrix-service';
import { ComparisonResults }      from './components/criteria/comparison-results';
import { PieChart }								from './components/charts/pie-chart';

@NgModule({
  declarations: [
		AppComponent, 
		About, 
		RepoBrowser, 
		RepoList, 
		RepoDetail, 
		Home,
		Criteria,
		Comparisons,
		CriteriaSearch,
		CriteriumDetail,
		ComparisonResults,
		PieChart
	],
  imports     : [BrowserModule, FormsModule, HttpModule, RouterModule.forRoot(rootRouterConfig)],
  providers   : [
		Github, 
		CriteriaService,
		MatrixService,
		{provide: LocationStrategy, useClass: HashLocationStrategy},
		{provide: XHRBackend, useClass: InMemoryBackendService},
		{provide: SEED_DATA, useClass: InMemoryData}
	],
  bootstrap   : [AppComponent]
})
export class AppModule {

}
