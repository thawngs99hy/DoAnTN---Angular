;
import { BaseComponent } from './../../../lib/base-component';
import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild, Input,ElementRef  } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { FormControl, FormGroup} from '@angular/forms' ;
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/takeUntil';
import { AuthenticationService } from '../../../lib/authentication.service';
import { CoreService } from './../../../lib/core.service';
import { ApiService } from 'src/app/lib/api.service';
import 'rxjs/add/operator/takeUntil';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { dsbacluong, dscanbo, dsphongkhoa, dsbomon, khenthuong, trinhdo, dangkilich} from '../../../model/danhsach';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { jsPDF} from 'jspdf';
import { autoTable} from 'jspdf-autotable';
declare var $: any;

declare var $: any;

@Component({
  selector: 'app-tkgvkhoa',
  templateUrl: './tkgvkhoa.component.html',
  styleUrls: ['./tkgvkhoa.component.css']
})
export class TkgvkhoaComponent extends BaseComponent implements OnInit {
  public dscanbos: any;
  submitted = false;
  @ViewChild(FileUpload, { static: false }) file_image: FileUpload;
  @ViewChild('htmlData') htmlData:ElementRef;
  constructor(private fb: FormBuilder, injector: Injector,
   private authenticationService: AuthenticationService, private messageService: MessageService, private confirmationService: ConfirmationService, private coreService: CoreService) {
    super(injector);
  }
  ngOnInit(): void {
    this._core.get('/api/PhongKhoas/GetPhongKhoaDetails/CNTT').takeUntil(this.unsubscribe).subscribe(res => {
      this.dscanbos = res;
      console.log(this.dscanbos);
      });
  }
  changed(e){
    this._core.get('/api/PhongKhoas/GetPhongKhoaDetails/'+e).takeUntil(this.unsubscribe).subscribe(res => {
      this.dscanbos = res;
      });
  }
}
