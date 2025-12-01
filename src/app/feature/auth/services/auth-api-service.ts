import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { LoginModel } from '../models/login-model';
import { environment } from '../../../../environments/environment.development';
import { UserModel } from '../models/user-model';
import { AuthorizedResponseModel } from '../models/authorized-response-model';
import { AuthTokenService } from './auth-token-service';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { RefreshTokenModel } from '../models/refresh-token-model';
import { RegisterModel } from '../models/register-model';


type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root',
})
export class AuthApiService {

  private httpClient = inject(HttpClient);
  private authTokenService = inject(AuthTokenService);

  private _user = signal<UserModel | null>(
    JSON.parse(sessionStorage.getItem('user') || 'null')
  );
  private _authStatus = signal<AuthStatus>('checking');
  private _accessToken = signal<string | null>(this.authTokenService.getAccessToken());
  private _refreshToken = signal<string | null>(this.authTokenService.getRefreshToken());

  refreshTokenModel: RefreshTokenModel = {
    refreshToken: ''
  };

  authStatus = computed<AuthStatus>(() => {
    return this._authStatus();
  });

  user = computed(() => this._user());

  private initAuth() {
    const hasUser = this._user();
    const hasToken = this._accessToken();

    if (hasUser && hasToken) {
      this._authStatus.set('authenticated');
    } else {
      this._authStatus.set('not-authenticated');
    }
  }

  constructor() {
    this.initAuth();
  }

  login(loginModel: LoginModel): Observable<boolean> {
    return this.httpClient
      .post<AuthorizedResponseModel>(`${baseUrl}/auth/login`, loginModel)
      .pipe(
        map(resp => {
          return this.handleAuthSuccess(resp);
        }),
        catchError(err => this.handleAuthError(err))
      );
  }

  register(registerModel:RegisterModel): Observable<boolean> {
    return this.httpClient
      .post<AuthorizedResponseModel>(`${baseUrl}/auth/register`, registerModel)
      .pipe(
        map(resp => {
          return this.handleAuthSuccess(resp);
        }),
        catchError(err => this.handleAuthError(err))
      );
  }

  refreshToken(): Observable<boolean> {
    const token = this._refreshToken();
    if (this.authStatus() === 'authenticated' && token) {
      this.refreshTokenModel.refreshToken = token;
      return this.httpClient.post<AuthorizedResponseModel>(`${baseUrl}/auth/refresh-token`, this.refreshTokenModel)
        .pipe(
          map(resp => {
            return this.handleAuthSuccess(resp);
          }),
          catchError(err => this.handleAuthError(err))
        );
    }
    return of(false);
  }

  private handleAuthSuccess({ accessToken, refreshToken, user }: AuthorizedResponseModel) {

    this._user.set(user);
    this._authStatus.set('authenticated');
    this._accessToken.set(accessToken);
    this._refreshToken.set(refreshToken);

    this.authTokenService.setAccessToken(accessToken);
    this.authTokenService.setRefreshToken(refreshToken);
    sessionStorage.setItem('user', JSON.stringify(user));

    return true;
  }

  logout() {
    this._user.set(null);
    this._accessToken.set(null);
    this._refreshToken.set(null);
    this._authStatus.set('not-authenticated');
    this.authTokenService.clearAuthToken();
  }

  private handleAuthError(error: any) {
    this.logout();
    return throwError(() => error);
  }

}
