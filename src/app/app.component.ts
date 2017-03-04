import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import {Router} from '@angular/router';
import { CanActivate }    from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(public http:Http, public router: Router) {
       this.CanActivate();
    }
    opensite() {
         window.location.href="https://www.fitnesspax.com/login";
    }
    CanActivate() {
        this.http.get('https://www.fitnesspax.com/api/v1/getwebtoken',{ withCredentials: true })
            .map(res => res.json())
            .subscribe((res:any) => {
                if(res.status == 'No session existed') {
                    window.location.href="https://www.fitnesspax.com";
                }else {
              //x      this.getUserData(res.token);
                }
            })
    }
    getUserData(token) {
        this.http.get('https://www.fitnesspax.com/api/v1/logged/userweb?token='+token,{ withCredentials: true })
            .map(res => res.json())
            .subscribe((res:any) => {
                if(res.user.role == "Trainer") {
                    this.router.navigate(['/publish']);
                }else {
                    this.router.navigate(['/home']);
                }
            })
    }
}
