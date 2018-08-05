import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-doc-search',
  templateUrl: './doc-search.component.html',
  styleUrls: ['./doc-search.component.css']
})
export class DocSearchComponent implements OnInit {
  application: string;
  constructor() {
    this.application = '';
  }

  ngOnInit() {
  }

  search(sq: string): void {
    console.log(sq);
  }

}
