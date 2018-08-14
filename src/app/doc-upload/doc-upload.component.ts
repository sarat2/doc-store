import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpEventType, HttpParams, HttpHeaders } from '@angular/common/http';
import { DocFormService } from '../doc-form/doc-form.service';

@Component({
  selector: 'app-doc-upload',
  templateUrl: './doc-upload.component.html',
  styleUrls: ['./doc-upload.component.css'],
  providers: [DocFormService],
})
export class DocUploadComponent implements OnInit {
  // metadata: FormGroup = null;
  // selectedFile: File = null;
  appName: string = null;
  success = false;
  progress: string = null;

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  formatShortDate(val) {
    return val.toISOString().substring(0, 10);
  }

  onAppChange(event) {
    this.appName = event.target.value;
    this.success = false;
    this.progress = null;
    // this.metadata = new FormGroup({
    //   id: new FormControl('', []),
    //   appName: new FormControl(event.target.value, [Validators.required]),
    //   appKey: new FormControl('123456', [Validators.required]),
    //   contractNo: new FormControl('19AX04567R0A01', [Validators.required]),
    //   fmsRegNo: new FormControl('2019000001', [Validators.required]),
    //   startDate: new FormControl(this.formatShortDate(new Date('07/01/2018')), [Validators.required]),
    //   endDate: new FormControl(this.formatShortDate(new Date('06/30/2019')), [Validators.required]),
    //   category: new FormControl('', [Validators.required]),
    //   subCategory: new FormControl('', []),
    //   docName: new FormControl('', [Validators.required])
    // });
  }

  // onFileSelected(event) {
  //   this.selectedFile = <File>event.target.files[0];
  //   this.metadata.controls['docName'].setValue(this.selectedFile.name);
  //   this.success = false;
  //   this.progress = null;
  // }

  // formatFileName() {
  //   let fn = this.metadata.value.category + '\\';
  //   if (this.metadata.value.subCategory !== '') {
  //     fn += this.metadata.value.subCategory + '\\';
  //   }
  //   return fn + this.metadata.value.docName;
  // }

  onNotify(data) {
    data.metadata['id'] = '';
    data.metadata['appName'] = this.appName;
    data.metadata['docName'] = data.file.name;

    const fd = new FormData();
    fd.append('metadata', JSON.stringify(data.metadata));
    fd.append('file', data.file, data.file.name);


    this.http.post('/api/document/upload', fd, { reportProgress: true, observe: 'events' }).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        const p = Math.round(event.loaded / event.total * 100);
        this.progress = p + '%' + ((p === 100) ? ' - Completed' : '');
      } else if (event.type === HttpEventType.Response) {
        console.log(event);
        this.success = (event.status === 200);
      }
    });
  }

  // onSubmit() {
  //   const fd = new FormData();
  //   fd.append('metadata', JSON.stringify(this.metadata.value));
  //   fd.append('file', this.selectedFile, this.metadata.value.docName);

  //   this.http.post('/api/document/upload', fd, { reportProgress: true, observe: 'events' }).subscribe(event => {
  //     if (event.type === HttpEventType.UploadProgress) {
  //       const p = Math.round(event.loaded / event.total * 100);
  //       this.progress = p + '%' + ((p === 100) ? ' - COMPLETED' : '');
  //     } else if (event.type === HttpEventType.Response) {
  //       console.log(event);
  //       this.success = (event.status === 200);
  //     }
  //   });
  // }

}
