import { Component, OnInit,trigger, transition, style, animate, state } from '@angular/core';
import {OpentokService} from '../../providers/providers';
import { Router } from '@angular/router';
import { Http, Response }          from '@angular/http';

declare const window;
declare const OT;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('fadeIn', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0}),
        animate('1500ms ease-out')
      ])
    ])
  ]
})
export class HomeComponent {

    public openTokSessionId:string   = '2_MX40NTc4Nzc0Mn5-MTQ4ODcyNDY2NjkzNn5UbFlGUFZpR0hQaEhOeTREbXl1cXBZUGx-fg';
    public tokenId:string            = 'T1==cGFydG5lcl9pZD00NTc4Nzc0MiZzaWc9M2ZlYmE0ZDZiMjE4NTM1MzkzMmEzM2I3YzhiZWQ0YTk4NGJjYzE0NjpzZXNzaW9uX2lkPTJfTVg0ME5UYzROemMwTW41LU1UUTRPRGN5TkRZMk5qa3pObjVVYkZsR1VGWnBSMGhRYUVoT2VUUkViWGwxY1hCWlVHeC1mZyZjcmVhdGVfdGltZT0xNDg4NzI0NzQxJm5vbmNlPTAuMDQzOTgzNDc4Nzk3MzcxNDEmcm9sZT1tb2RlcmF0b3ImZXhwaXJlX3RpbWU9MTQ5MTMxNjczOQ==';
    public apiKey: string            = '45787742';
    public videoSubscriber:any;
    public session:any;
    public laregerVideo:any;
    public streamArray:any = [];
    constructor(public opentok:OpentokService, public router: Router,public http:Http) { }

    ngAfterViewInit() {
        
       this.initSession();
       //this.ngOnDestroy();
       this.CanActivate();
    }
    CanActivate() {
        this.http.get('https://www.fitnesspax.com/api/v1/getwebtoken',{ withCredentials: true })
            .map(res => res.json())
            .subscribe((res:any) => {
                if(res.status == 'No session existed') {
                    window.location.href="https://www.fitnesspax.com/login";
                }else {
                   // this.getUserData(res.token);
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

    initSession() {
        if (this.session) {
            this.session.disconnect();
        }
        this.session = OT.initSession(this.apiKey, this.openTokSessionId);
        this.session.connect(this.tokenId, (e) => this.tryingToConnect(e));
    }
    disconnectConnect(e) {
        console.log(e);
    }
    
    tryingToConnect(e) {
        this.session.on('streamCreated',(e) => this.streamCreated(e));
        this.session.on('streamDestroyed',(e) => this.streamDestroyed(e));
    }
    streamDestroyed(e){
        let number;
        for(let i=0;i<this.streamArray.length;i++) {
            if(this.streamArray[i].stream.id == e.stream.id) {
                number = i;
            }
        }
        this.streamArray.splice(number,1);
    }
    streamCreated(stream) {
        this.streamArray.push(stream);
        let subscriberProperties = {insertMode: 'append',width: (document.documentElement.clientWidth/3), height: 240};
        setTimeout(() => {
            this.videoSubscriber = this.session.subscribe(stream.stream, stream.stream.id, subscriberProperties);
            this.videoSubscriber.setAudioVolume(0);
        },400)
        
    }


    bigScreen(stream) {
        this.session.signal({
            data:"joined",
            to: stream.connection,
          },(error) => {
              console.log(error);
          })
        let subscriberProperties = {insertMode: 'append',width: window.innerWidth, height: window.innerHeight};
            if(document.getElementById('bigvideo') == null) 
                 document.getElementById('bigvideoholder').innerHTML = '<div id="bigvideo"></div><div class="closeBigVideo" ></div>';
            this.laregerVideo = this.session.subscribe(stream, 'bigvideo', subscriberProperties);
            let closebutton = document.getElementsByClassName('closeBigVideo')[0].addEventListener('click',(e)=>this.addCloseButton(stream) );
    }
    addCloseButton(stream){
        this.session.signal({
            data:"removed",
            to: stream.connection,
          },(error) => {
              console.log(error);
          })
        this.laregerVideo.destroy();
        let elem = document.getElementById('bigvideo');
        let elem2 = document.getElementsByClassName('closeBigVideo')[0];
        elem.remove();
        elem2.remove();
    }
    minimizeVideo(stream) {
        let subscriberProperties = {insertMode: 'append',width: (document.documentElement.clientWidth/3)-110, height: 240};
            if(document.getElementById('layout') == null) 
                document.getElementById('allStreams').innerHTML = '<div id="layout"></div>';
            this.videoSubscriber = this.session.subscribe(stream.stream, 'layout', subscriberProperties);
    }
    ngOnDestroy() {
        this.session.off('streamCreated');
        this.session.off('sessionConnected'); 
        this.session.destroy();

    }
}
