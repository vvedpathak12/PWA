import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-sample',
  standalone: false,
  templateUrl: './sample.component.html',
  styleUrl: './sample.component.css'
})
export class SampleComponent implements OnInit {
  postObj: any = {
    "userId": 0,
    "id": 0,
    "title": "",
    "body": ""
  }
  postList: any[] = [];
  filterPostList: any[] = [];
  isTableLoader: boolean = true;
  isApiCallInProgress: boolean = false;
  showAlert: boolean = false;
  alertMessage: string = '';
  alertResponseClass: string = '';
  resMessage: string = '';
  searchTxt: string = '';
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getAllPost();
    this.forkJoin()
  }

  getAllPost() {
    this.isTableLoader = true;
    this.http.get('https://jsonplaceholder.typicode.com/posts').subscribe((res: any) => {
      if (res) {
        setTimeout(() => {
          this.postList = res;
          this.filterPostList = res;
          this.isTableLoader = false;
        }, 500);
      }
    });
  }

  onSavePost() {
    if (!this.isApiCallInProgress) {
      this.isApiCallInProgress = true;
      this.http.post('https://jsonplaceholder.typicode.com/posts', this.postObj).subscribe((res: any) => {
        this.isApiCallInProgress = false;
        this.getAllPost();
        alert("Post Saved Successfully");
        this.onReset();
        this.alertMessage = "Post Saved Successfully";
        this.resMessage = "Success!"
        this.showAlert = true;
        this.alertResponseClass = "alert-success";
        setTimeout(() => {
          this.showAlert = false;
        }, 2000);
      })
    }

  }

  onReset() {
    this.postObj = {
      "userId": 0,
      "id": 0,
      "title": "",
      "body": ""
    }
  }

  onEdit(item: any) {
    this.postObj = item;
  }

  onUpdate() {
    if (!this.isApiCallInProgress) {
      this.isApiCallInProgress = true;
      this.http.put('https://jsonplaceholder.typicode.com/posts/' + this.postObj.id, this.postObj).subscribe((res: any) => {
        this.isApiCallInProgress = false;
        this.getAllPost();
        this.onReset();
        this.alertMessage = "Post Updated Successfully";
        alert("Post Updated Successfully");
        this.resMessage = "Success!"
        this.showAlert = true;
        this.alertResponseClass = "alert-warning";
        setTimeout(() => {
          this.showAlert = false;
        }, 2000);
      })
    }

  }

  onDelete(id: number) {
    this.http.delete('https://jsonplaceholder.typicode.com/posts/' + id).subscribe((res: any) => {
      this.getAllPost();
      alert("Post Deleted Successfully");
      this.alertMessage = "Post Deleted Successfully";
      this.resMessage = "Success!"
      this.showAlert = true;
      this.alertResponseClass = "alert-danger";
      setTimeout(() => {
        this.showAlert = false;
      }, 2000);
    })
  }

  onFilter() {
    this.filterPostList = this.postList.filter((item: any) => {
      return item.title.toLowerCase().includes(this.searchTxt.toLowerCase()) || item.body.toLowerCase().includes(this.searchTxt.toLowerCase());
    })
  }

  forkJoin() {
    forkJoin(
      [this.http
        .get('https://jsonplaceholder.typicode.com/posts'),
      this.http.get('https://jsonplaceholder.typicode.com/users')
      ])
      .subscribe(res => {
        // console.log(res);
      }, err => {
        // console.log('error', err)
      })
  }
}
