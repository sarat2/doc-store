import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DocSearchComponent } from './doc-search/doc-search.component';
import { DocUploadComponent } from './doc-upload/doc-upload.component';

@NgModule({
  declarations: [
    AppComponent,
    DocSearchComponent,
    DocUploadComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
