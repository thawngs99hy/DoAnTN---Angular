import { Component, OnInit } from '@angular/core';
import { ThongKeService } from '@app/lib/thongke.service';
import { ThongKeTrangChu } from '@app/model/thongke';
// import * as CanvasJS from 'canvasjs';

declare var $: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public thongKe:any;

  constructor(
    private thongKeService:ThongKeService
  ) {
    this.loadData();
   }
  ngOnInit(): void {
  }

  loadData(){
    return this.thongKeService.getThongKe().subscribe((res:ThongKeTrangChu)=>{
      this.thongKe=res;
      debugger
      return res;
    });
  }

}
