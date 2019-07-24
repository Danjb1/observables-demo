import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {
  GemComponent,
  GemcutterOptionComponent,
  GemOrderListComponent
} from '@app/components';

@NgModule({
  declarations: [
    AppComponent,
    GemComponent,
    GemcutterOptionComponent,
    GemOrderListComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
