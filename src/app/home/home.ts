import {Component} from '@angular/core';
import {Hierarchy} from '../components/hierarchy/hierarchy';
@Component({
  selector: 'home',
	directives: [Hierarchy],
  styleUrls: ['./home.css'],
  templateUrl: './home.html'
})
export class Home {
}
