import { Routes } from '@angular/router';
import DashboardComponent from './features/dashboard/dashboard.component';
import UsersComponent from './features/dashboard/users/users.component';

export const routes: Routes = [
    {
        path: '',
        title: 'Home',
        loadComponent: () => import('./features/home/home.component')
    },
    {
        path: 'enterprise',
        title: 'Enterprise',
        loadComponent: () => import('./features/enterprise/enterprise.component')
    },
    {
        path: 'products',
        title: 'Products',
        loadComponent: () => import('./features/products/products.component')
    },
    {
        path: 'contact',
        title: 'Contact',
        loadComponent: () => import('./features/contact/contact.component')
    },
    {
        path: 'login',
        title: 'Login',
        loadComponent: () => import('./features/authentication/authentication.component')
    },
    {
        path: 'dashboard',
        title: 'Dashboard',
        component: DashboardComponent,
        children: [
            {
                path: 'users',
                title: 'Users',
                component: UsersComponent
            },
        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
];
