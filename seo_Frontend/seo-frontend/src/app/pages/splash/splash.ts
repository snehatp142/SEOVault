// import { Component } from '@angular/core';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-splash',
//   templateUrl: './splash.html',
//   styleUrls: ['./splash.css']
// })
// export class SplashComponent {

// constructor(private router: Router){}

// ngOnInit(){

// setTimeout(() => {
// this.router.navigate(['/home']);
// }, 2000);

// }

// }    
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  standalone: true,
  templateUrl: './splash.html',
  styleUrls: ['./splash.css']
})
export class SplashComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
    setTimeout(() => {
      this.router.navigate(['/landing']);
    }, 6000); // 2 seconds
  }
}