import {Component} from '@angular/core';
import {About} from '../about/about';
@Component({
  selector: 'home',
	directives: [About],
  styleUrls: ['./home.css'],
  templateUrl: './home.html'
})
export class Home {
}
