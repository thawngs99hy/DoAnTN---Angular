import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { ThongKeTrangChu } from "@app/model/thongke";
import { of, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";

@Injectable()
export class ThongKeService {

    private api = "https://localhost:44351/api/thongke";

    constructor(private _http: HttpClient, public router: Router) { }

    getThongKe() {

        let cloneHeader: any = {};
        cloneHeader['Content-Type'] = 'application/json';
        const headerOptions = new HttpHeaders(cloneHeader);

        return this._http.get<ThongKeTrangChu>(this.api, { headers: headerOptions })
            .pipe(catchError(this.errorHandler));
    }

    errorHandler(error: HttpErrorResponse) {
        return throwError(error.message || "server error.");
      }
}