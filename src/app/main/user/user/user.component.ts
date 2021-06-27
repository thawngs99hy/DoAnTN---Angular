import { User } from '@app/models';
import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild, Input, ElementRef  } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
// import { FormControl, FormGroup} from '@angular/forms'
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { dsbacluong, dscanbo, dsphongkhoa, dsbomon, khenthuong} from '../../../model/danhsach';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { jsPDF} from 'jspdf';
import { autoTable} from 'jspdf-autotable';
import { AuthenticationService } from 'src/app/lib/authentication.service';
import { FormControl, FormGroup} from '@angular/forms'
import { Observable } from 'rxjs/Observable'
import { DatePipe } from '@angular/common';
import { CoreService } from './../../../lib/core.service';
import { ApiService } from 'src/app/lib/api.service';

declare var $: any;
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent extends BaseComponent implements OnInit {
  public Users: any;
  public totalRecords:any;
  public pageSize = 3;
  public page = 1;
  public uploadedFiles: any[] = [];
  public formsearch: any;
  public formdata: any;
  public doneSetupForm: any;
  public showUpdateModal:any;
  public isCreate:any;
  public hiddenID: number;
  submitted = false;
  selectedProducts: User[];
  statuses: any[];
  loading: boolean = true;
  activityValues: number[] = [0, 100];

  @ViewChild(FileUpload, { static: false }) file_image: FileUpload;
  @ViewChild('htmlData') htmlData:ElementRef;

 constructor(private fb: FormBuilder, injector: Injector, private messageService: MessageService, private confirmationService: ConfirmationService, private coreService: CoreService) {
    super(injector);
  }
  User: User[];
  cols: any[];
  exportColumns: any[];


  getdsU() {
    this.coreService.getdsU().subscribe((update) => {
    this.User = update;
    console.log(this.User);
    });
  }
// showAdd() {
//   this.isCreate= true;
//   this.hiddenID = 0;
//   this.doneSetupForm = {};
//   this.lgModal.show();
//   }
  ngOnInit(): void {
    this.formsearch = this.fb.group({
      'hoten': [''],
      'taikhoan': [''],
    });
    this.search();
  }

  loadPage(page) {
    this._core.post('/api/authenticate',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.Users = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  }

  search() {
    this.page = 1;
    this.pageSize = 5;
    this._core.post('/api/authenticate',{page: this.page, pageSize: this.pageSize, hoten: this.formsearch.get('hoten').value, taikhoan: this.formsearch.get('taikhoan').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.Users = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  }

  pwdCheckValidator(control){
    var filteredStrings = {search:control.value, select:'@#!$%&*'}
    var result = (filteredStrings.select.match(new RegExp('[' + filteredStrings.search + ']', 'g')) || []).join('');
    if(control.value.length < 6 || !result){
        return {matkhau: true};
    }
  }

  get f() { return this.formdata.controls; }

  onSubmit(value) {
    this.submitted = true;
    if (this.formdata.invalid) {
      return;
    }


    // if(this.isCreate) {
    //   this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
    //     let data_image = data == '' ? null : data;
    //     let tmp = {
    //        image_url:data_image,
    //        hoten:value.hoten,
    //        diachi:value.diachi,
    //        gioitinh:value.gioitinh,
    //        email:value.email,
    //        taikhoan:value.taikhoan,
    //        matkhau:value.matkhau,
    //        role:value.role,
    //        ngaysinh:value.ngaysinh
    //       };
    //     this._api.post('/api/users/create-user',tmp).takeUntil(this.unsubscribe).subscribe(res => {
    //       alert('Thêm thành công');
    //       this.search();
    //       this.closeModal();
    //       });
    //   });
    // } else {
    //   this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
    //     let data_image = data == '' ? null : data;
    //     let tmp = {
    //        image_url:data_image,
    //        hoten:value.hoten,
    //        diachi:value.diachi,
    //        gioitinh:value.gioitinh,
    //        email:value.email,
    //        taikhoan:value.taikhoan,
    //        matkhau:value.matkhau,
    //        role:value.role,
    //        ngaysinh:value.ngaysinh ,
    //        user_id:this.user.user_id,
    //       };
    //     this._api.post('/api/users/update-user',tmp).takeUntil(this.unsubscribe).subscribe(res => {
    //       alert('Cập nhật thành công');
    //       this.search();
    //       this.closeModal();
    //       });
    //   });
    // }

    console.log('click ok!');
    console.log(this.isCreate);
    if(this.isCreate){
      let tmp = {
          HoTen:value.hoten,
          username:value.taikhoan,
          password:value.matkhau,
          level:value.role,
      };
      console.log('OKOK');
      this._core.post('/api/authenticate/register',tmp).takeUntil(this.unsubscribe).subscribe(res => {
        alert('Thêm thành công');
        this.search();
        this.closeModal();
        });
    }else{
      let tmp = {
          fullname:value.fullname,
          username:value.username,
          password:value.password,
          level:value.role,
          // id:this.User,
      };
      this._core.post('/api/authenticate',tmp).takeUntil(this.unsubscribe).subscribe(res => {
        alert('Cập nhật thành công');
        this.search();
        this.closeModal();
        });
    }
  }

  onDelete(row) {
    this._core.post('/api/authenticate/',{id:row.user_id}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search();
      });
  }

  Reset() {
    this.User = null;
    this.formdata = this.fb.group({
      'hoten': ['', Validators.required],
      // 'ngaysinh': [this.today, Validators.required],
      // 'diachi': [''],
      // 'gioitinh': [this.genders[0].value, Validators.required],
      // 'email': ['', [Validators.required,Validators.email]],
      'taikhoan': ['', Validators.required],
      'matkhau': ['', [this.pwdCheckValidator]],
      'nhaplaimatkhau': ['', Validators.required],
      'role': [this.roles[0].value, Validators.required],
    }, {
      validator: MustMatch('matkhau', 'nhaplaimatkhau')
    });
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.User = null;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this.formdata = this.fb.group({
        'hoten': ['', Validators.required],
        // 'ngaysinh': ['', Validators.required],
        // 'diachi': [''],
        // 'gioitinh': ['', Validators.required],
        // 'email': ['', [Validators.required,Validators.email]],
        'taikhoan': ['', Validators.required],
        'matkhau': ['', [this.pwdCheckValidator]],
        'nhaplaimatkhau': ['', Validators.required],
        'role': ['', Validators.required],
      }, {
        validator: MustMatch('matkhau', 'nhaplaimatkhau')
      });
      // this.formdata.get('ngaysinh').setValue(this.today);
      // this.formdata.get('gioitinh').setValue(this.genders[0].value);
      this.formdata.get('role').setValue(this.roles[0].value);
      this.doneSetupForm = true;
    });
  }

  public openUpdateModal(row) {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = false;
    setTimeout(() => {
      // $('#createUserModal').modal('toggle');
      // this._core.get('/api/users/get-by-id/'+ row.user_id).takeUntil(this.unsubscribe).subscribe((res:any) => {
      //   this.User = res;
      //   console.log(this.User);
      //   // let ngaysinh = new Date(this.user.ngaysinh);
      //     this.formdata = this.fb.group({
      //       'hoten': [this.User.fullname, Validators.required],
      //       // 'ngaysinh': [ngaysinh, Validators.required],
      //       // 'diachi': [this.user.diachi],
      //       // 'gioitinh': [this.user.gioitinh, Validators.required],
      //       // 'email': [this.user.email, [Validators.required,Validators.email]],
      //       'taikhoan': [this.User.taikhoan, Validators.required],
      //       'matkhau': [this.User.matkhau, [this.pwdCheckValidator]],
      //       'nhaplaimatkhau': [this.User.matkhau, Validators.required],
      //       'role': [this.User.role, Validators.required],
      //     }, {
      //       validator: MustMatch('matkhau', 'nhaplaimatkhau')
      //     });
      //     this.doneSetupForm = true;
      //   });
    }, 700);
  }

  closeModal() {
    $('#createUserModal').closest('.modal').modal('hide');
  }
}
