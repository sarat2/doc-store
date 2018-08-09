import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { DocSearchComponent } from './doc-search/doc-search.component';
import { DocUploadComponent } from './doc-upload/doc-upload.component';

const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  { path: 'search', component: DocSearchComponent },
  { path: 'upload', component: DocUploadComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    DocSearchComponent,
    DocUploadComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
