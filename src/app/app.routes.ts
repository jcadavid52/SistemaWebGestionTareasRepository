import { Routes } from '@angular/router';
import { MasterLayout } from './core/layouts/master-layout';
import { ScreenListTaskPage } from './feature/task/pages/screen-list-task-page/screen-list-task-page';
import { noAuthenticatedGuard } from './core/guards/no-authenticated-guard';
import { authenticatedGuard } from './core/guards/authenticated-guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./feature/auth/pages/login-page/login-page').then(c => c.LoginPage),
        canActivate: [noAuthenticatedGuard]
    },
    {
        path: 'auth',
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'login'
            },
            {
                path: 'login',
                loadComponent: () => import('./feature/auth/pages/login-page/login-page').then(c => c.LoginPage),
                canActivate: [noAuthenticatedGuard]
            },
            {
                path: 'register',
                loadComponent: () => import('./feature/auth/pages/register-page/register-page').then(c => c.RegisterPage),
                canActivate: [noAuthenticatedGuard]
            },
        ]
    },

    {
        path: 'task',
        component: MasterLayout,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'dashboard'
            },
            {
                path: 'dashboard',
                loadComponent: () => import('./feature/task/pages/dashboard-task-page/dashboard-task-page').then(c => c.DashboardTaskPage),
                canActivate: [authenticatedGuard]
            },
            {
                path: 'task-list',
                loadComponent: () => import('./feature/task/pages/screen-list-task-page/screen-list-task-page').then(c => c.ScreenListTaskPage),
                canActivate: [authenticatedGuard]
            },
            {
                path: 'gestion/:slug',
                loadComponent: () => import('./feature/task/pages/detail-task-page/detail-task-page').then(c => c.DetailTaskPage),
                canActivate: [authenticatedGuard]
            }
        ],
    }
];
