
import {Routes} from '@angular/router';
import {LandingComponent} from './pages/landing/landing';
import {DashboardComponent} from './pages/dashboard/dashboard';
import {LoginComponent} from './pages/login/login';
import {RegisterComponent} from './pages/register/register';
import {WebsitesComponent} from './website/website';
import {AboutComponent} from './pages/about/about';
import {ContactComponent} from './pages/contact/contact';
import {TermsComponent} from './pages/terms/terms';

export const routes:Routes=[
 {path:'',component:LandingComponent},
 {path:'landing',component:LandingComponent},
 {path:'login',component:LoginComponent},
 {path:'register',component:RegisterComponent},
 {path:'dashboard',component:DashboardComponent},
 {path:'website/:id',component:WebsitesComponent},
 {path:'websites',component:DashboardComponent},
 {path:'about',component:AboutComponent},
 {path:'contact',component:ContactComponent},
 {path:'terms',component:TermsComponent},
 {path:'**',redirectTo:''}
];
