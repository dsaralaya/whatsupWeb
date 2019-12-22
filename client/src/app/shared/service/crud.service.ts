import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { configuation } from '../config';
import { AuthenticationService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CrudeService {
    endpoint = `${configuation.serverURL}`;
    constructor(private http: HttpClient, private authService: AuthenticationService) { }

    create<T>(model: T | any, objToCreate: T | any): Observable<T | T[]> {
        return this.http.post<any>(`${this.endpoint}/${model}`, objToCreate, { headers: this.getHeaders()});
    }

    createByAction<T>(model: T | any, action: any, objToCreate: T | any): Observable<T | T[]> {
        return this.http.post<any>(`${this.endpoint}/${model}/${action}`, JSON.stringify(objToCreate), { headers: this.getHeaders()});
    }

    get(model: any): Observable<any> {
        return this.http.get<any>(`${this.endpoint}/${model}`, { headers: this.getHeaders()});
    }

    getBy(model: any, params: any): Observable<any> {
        return this.http.get<any>(`${this.endpoint}/${model}/${params}`, { headers: this.getHeaders()});
    }

    search(model: any, params: any): Observable<any> {
        return this.http.get<any>(`${this.endpoint}/${model}?${params}`, { headers: this.getHeaders()});
    }

    update(model: any, id: any, objToUpdate: any): Observable<any> {
        return this.http.put<any>(`${this.endpoint}/${model}/${id}`, JSON.stringify(objToUpdate));
    }

    updateByAction(model: any, id: any, action: any, objToUpdate: any): Observable<any> {
        return this.http.put<any>(`${this.endpoint}/${model}/${id}/${action}`, JSON.stringify(objToUpdate), { headers: this.getHeaders()});
    }

    delete(model: any, id): Observable<any> {
        return this.http.delete<any>(`${this.endpoint}/${model}/${id}`, { headers: this.getHeaders()});
    }

    getHeaders() {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'x-access-token': this.authService.token });
        return headers;
    }
}