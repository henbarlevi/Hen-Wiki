import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { rxjsExmaples} from './rxjs/rxjs';
import { ScssComponent } from './scss-sbs/scss.component';

@NgModule({
  declarations: [
    AppComponent,
    ScssComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [rxjsExmaples],
  bootstrap: [AppComponent]
})
export class AppModule { }
