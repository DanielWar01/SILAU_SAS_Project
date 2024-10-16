import { Routes } from '@angular/router';

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
        path: '**',
        redirectTo: ''
    }
];
