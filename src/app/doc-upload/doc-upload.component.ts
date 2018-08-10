import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-doc-upload',
  templateUrl: './doc-upload.component.html',
  styleUrls: ['./doc-upload.component.css']
})
export class DocUploadComponent implements OnInit {
  metadata: FormGroup = null;
  appName: string = null;
  selectedFile: File = null;

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  formatShortDate(val) {
    return val.toISOString().substring(0, 10);
  }

  onAppChange(event) {
    this.appName = event.target.value;
    this.metadata = new FormGroup({
      contractNo: new FormControl('Contract1', [Validators.required]),
      fmsRegNo: new FormControl('2019000001', [Validators.required]),
      startDate: new FormControl(this.formatShortDate(new Date('07/01/2018')), [Validators.required]),
      endDate: new FormControl(this.formatShortDate(new Date('06/30/2019')), [Validators.required]),
      document: new FormControl('', [Validators.required])
    });
  }

  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
    this.metadata.controls['document'].setValue(this.selectedFile.name);
  }

  onSubmit() {
    const fd = new FormData();
    fd.append('file', this.selectedFile, this.selectedFile.name);
    // fd.append('fields', this.metadata.value);
    this.http.post('/api/upload', fd, {
      reportProgress: true,
      observe: 'events'
    }).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        console.log(Math.round(event.loaded / event.total * 100));
      } else if (event.type === HttpEventType.Response) {
        console.log(event);
      }
    });
  }

}
