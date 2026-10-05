
import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router,RouterLink} from '@angular/router';
import {ApiService} from '../../services/api';
@Component({selector:'app-login',standalone:true,imports:[CommonModule,FormsModule,RouterLink],templateUrl:'./login.html',styleUrls:['./login.css']})
export class LoginComponent{
 form={username:'',password:''};isLoading=false;error='';
 constructor(private api:ApiService,private router:Router){}
 login(){this.error='';if(!this.form.username||!this.form.password){this.error='Enter your username and password.';return}
 this.isLoading=true;this.api.login(this.form).subscribe({next:(r:any)=>{localStorage.setItem('token',r.access);localStorage.setItem('refresh',r.refresh);localStorage.setItem('username',r.username||this.form.username);localStorage.setItem('email',r.email||'');this.router.navigate(['/dashboard'])},error:(e)=>{this.error=e.error?.detail||e.error?.message||'Unable to sign in. Check your credentials.';this.isLoading=false},complete:()=>this.isLoading=false})}
}
