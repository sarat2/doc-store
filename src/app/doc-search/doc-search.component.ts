import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { String, StringBuilder } from 'typescript-string-operations';

@Component({
  selector: 'app-doc-search',
  templateUrl: './doc-search.component.html',
  styleUrls: ['./doc-search.component.css']
})
export class DocSearchComponent implements OnInit {
  // tslint:disable-next-line:max-line-length
  apibase = 'https://docustore.search.windows.net/indexes/{0}/docs?api-version=2017-11-11&api-key=AA139490D4BD46717692A9E0E38AFBF9&queryType=full&search=/.*{1}.*/';
  appName: string; result: any; list:  any;

  constructor(private http: HttpClient) {
    this.appName = '';
    this.getCount();
  }

  ngOnInit() { }

  search(sq: string): void {
    // if (sq.length > 3) {
      const url = String.Format(this.apibase, this.appName, sq);
      this.http.get(url).subscribe(data => {
        this.result = data;
      });
    // } else {
    //   this.result = null;
    // }
  }

  getCount() {
    this.http.get('/api/search/list').subscribe(data => {
      this.list = data;
    });
  }

  onDownload(p: string, n: string) {
    console.log(`container - ${this.appName},\npath - ${p},\nfilename - ${n}`);
    return this.http.get(`/api/document/download?c=${this.appName}&p=${p}`, { responseType: 'blob' }).subscribe(res => {
      // console.log('start download:', res);
      const url = window.URL.createObjectURL(res);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = n;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove(); // remove the element
    }, error => {
      console.log('download error:', JSON.stringify(error));
    }, () => {
      console.log('Completed file download.');
    });
  }



}
