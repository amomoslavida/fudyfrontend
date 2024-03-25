import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/'; 

  constructor(private http: HttpClient) {}

  signup(email: string, password: string): Observable<{access_token: string}> {
    
    return this.http.post<any>(`${this.apiUrl}user`, { email, password }).pipe(
      catchError(error => this.handleError(error, 'signup')),
      // Use switchMap to chain the login request right after a successful signup
      switchMap(() => this.login(email, password)),
      tap(response => this.setSession(response.access_token)),
      catchError(error => this.handleError(error, 'login')) // Handle login errors after signup
    );
  }

  login(email: string, password: string): Observable<{access_token: string}> {
    return this.http.post<{access_token: string}>(`${this.apiUrl}auth/login`, { email, password }).pipe(
      tap(response => this.setSession(response.access_token)),
      catchError(error => this.handleError(error, 'login'))
    );
  }

  private setSession(authResult: string): void {
    localStorage.setItem('id_token', authResult); 
  }

  private getToken(): string | null {
    return localStorage.getItem('id_token');
  }

  getCurrentUserData(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token found'));
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.get<any>(`${this.apiUrl}auth/me`, httpOptions);
  }

  private handleError(error: HttpErrorResponse, operation: string): Observable<never> {
    let errorMessage = `${operation} operation failed.`; 
    if (error.error instanceof ErrorEvent) {
    
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {

      errorMessage = `Server returned code ${error.status} with message: ${error.error.message}`;
    }
    console.error(errorMessage);
   
    return throwError(() => new Error(errorMessage));
  }
}
