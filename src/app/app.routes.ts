import {Routes} from '@angular/router';
import {About} from './about/about';
import {Home} from './home/home';
import {RepoBrowser} from './github/repo-browser/repo-browser';
import {RepoList} from './github/repo-list/repo-list';
import {RepoDetail} from './github/repo-detail/repo-detail';

import {Criteria} from './components/criteria/criteria';
import {Hierarchy} from './components/hierarchy/hierarchy';
import {Comparisons} from './components/criteria/comparisons';
import {CriteriumDetail} from './components/criteria/criterium-detail';
import {ComparisonResults} from './components/criteria/comparison-results';

export const rootRouterConfig: Routes = [
  {path: '', redirectTo: 'home', terminal: true},
  {path: 'home', component: Home},
  {path: 'hierarchy', component: Hierarchy},
  {path: 'criteria', component: Criteria},
  {path: 'comparisons', component: Comparisons},
  {path: 'detail/:id', component: CriteriumDetail},
  {path: 'results/:naved', component: ComparisonResults},
  {path: 'about', component: About},
  {path: 'github', component: RepoBrowser,
    children: [
      {path: '', component: RepoList},
      {path: ':org', component: RepoList,
        children: [
          {path: '', component: RepoDetail},
          {path: ':repo', component: RepoDetail}
        ]
      }]
  }
];

