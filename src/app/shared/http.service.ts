import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class HttpService {

    constructor(private http: HttpClient) { }

    postdata(url, hjson): Observable<any> {

        let data = '';
        console.log('HttpService');
        // tslint:disable-next-line:prefer-const
        for (let key in hjson) {
            if (hjson.hasOwnProperty(key)) {
                data += key + '=' + encodeURIComponent(hjson[key]) + '&';

            }
        }
        data = data.slice(0, -1);
        // headers: new HttpHeaders({
        //     'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',

        // }),
        const httpOptions = {

            headers: {
                'Content-Type': 'application/json;charset=utf-8',

            }


        };

        return this.http.post(url, data, httpOptions)
            .pipe(map(r => r));
    }


}