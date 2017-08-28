import { Component } from '@angular/core';
import * as Rx from 'rxjs';
import { rxjsExmaples } from './rxjs/rxjs';
import * as DesignPatternsExmaples from './design-patterns';
//import  * as fs from 'fs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private designPatternsExamples
  constructor(private rxjsExmaples: rxjsExmaples) {
    DesignPatternsExmaples.runExamples();
  }


}
