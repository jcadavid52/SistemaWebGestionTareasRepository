import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthTokenService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  setAccessToken(token: string) {
    this.accessToken = token;
    localStorage.setItem('access_token', token);
  }

  setRefreshToken(token: string) {
    this.refreshToken = token;
    sessionStorage.setItem('refresh_token', token);
  }

  getAccessToken(): string {
    return this.accessToken ?? localStorage.getItem('access_token') ?? '';
  }

  getRefreshToken(): string {
    return this.refreshToken ?? sessionStorage.getItem('refresh_token') ?? '';
  }

  clearAuthToken() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  setTotalTask(total:number){
    sessionStorage.setItem('total-task', total.toString())
  }

  getTotalTask(){
    return sessionStorage.getItem('total-task');
  }
}
