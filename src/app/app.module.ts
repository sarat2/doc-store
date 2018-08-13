import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { DocSearchComponent } from './doc-search/doc-search.component';
import { DocUploadComponent } from './doc-upload/doc-upload.component';
import { DocFormComponent } from './doc-form/doc-form.component';
import { ControlComponent } from './doc-form/control/control.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCoffee, faFileExcel, faFileWord, faFilePdf } from '@fortawesome/free-solid-svg-icons';
library.add(faCoffee, faFileExcel, faFileWord, faFilePdf);
const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  { path: 'search', component: DocSearchComponent },
  { path: 'upload', component: DocUploadComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    DocSearchComponent,
    DocUploadComponent,
    DocFormComponent,
    ControlComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
