import { Component, OnInit } from '@angular/core';
import { Http, Response }          from '@angular/http';
import { ActivatedRoute } from '@angular/router';
declare const window;
declare const OT;


@Component({
  selector: 'app-trainervideo',
  templateUrl: './trainervideo.component.html',
  styleUrls: ['./trainervideo.component.css']
})
export class TrainervideoComponent implements OnInit {

    public streamid:string;
    public session:any;
    public openTokSessionId:string   = '2_MX40NTc4Nzc0Mn5-MTQ4ODcyNDY2NjkzNn5UbFlGUFZpR0hQaEhOeTREbXl1cXBZUGx-fg';
    public tokenId:string            = 'T1==cGFydG5lcl9pZD00NTc4Nzc0MiZzaWc9M2ZlYmE0ZDZiMjE4NTM1MzkzMmEzM2I3YzhiZWQ0YTk4NGJjYzE0NjpzZXNzaW9uX2lkPTJfTVg0ME5UYzROemMwTW41LU1UUTRPRGN5TkRZMk5qa3pObjVVYkZsR1VGWnBSMGhRYUVoT2VUUkViWGwxY1hCWlVHeC1mZyZjcmVhdGVfdGltZT0xNDg4NzI0NzQxJm5vbmNlPTAuMDQzOTgzNDc4Nzk3MzcxNDEmcm9sZT1tb2RlcmF0b3ImZXhwaXJlX3RpbWU9MTQ5MTMxNjczOQ==';
    public apiKey: string            = '45787742';
    public liveStream:any;
    public laregerVideo:any;
    constructor(private route: ActivatedRoute,public http:Http) { }

    ngOnInit() {
        this.route.params.subscribe((params:any) => {
            this.streamid = params.id;
              //this.CanActivate();      
        })
    }
    ngAfterViewInit() {
          this.initSession();  
    }
    initSession() {
        if (this.session) {
            this.session.disconnect();
        }
        this.session = OT.initSession(this.apiKey, this.openTokSessionId);
        this.session.connect(this.tokenId, (e) => this.tryingToConnect(e));
    }
    tryingToConnect(e) {
        this.session.on('streamCreated',(e) => this.streamCreated(e));
         this.session.on('streamDestroyed',(e) => this.streamDestroyed(e.stream));
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
    streamCreated(stream) {
        console.log(stream.stream.id ,this.streamid) ;
        if(stream.stream.id == this.streamid) {
            console.log('in');
            this.liveStream = stream;
            this.session.signal({
            data:"joined",
            to: stream.connection,
          },(error) => {
              console.log(error);
          })
            let subscriberProperties = {insertMode: 'append',width: '900px', height: '730px'};
                document.getElementById('smallvideoHolder').innerHTML = '<div id="smallvideo"></div>';
                this.session.subscribe(stream.stream, 'smallvideo', subscriberProperties);
       }
    }
    bigScreen() {
        let subscriberProperties = {insertMode: 'append',width: window.innerWidth, height: window.innerHeight};
        document.getElementById('bigvideoholderBig').innerHTML = '<div id="bigvideo"></div><div class="closeBigVideo" ></div>';
        this.laregerVideo = this.session.subscribe(this.liveStream.stream, 'bigvideo', subscriberProperties);
        let closebutton = document.getElementsByClassName('closeBigVideo')[0].addEventListener('click',(e)=>this.addCloseButton() );
    }
    addCloseButton(){
        this.session.signal({
            data:"removed",
            to: this.liveStream.connection,
          },(error) => {
              console.log(error);
          })
        this.laregerVideo.destroy();
        let elem = document.getElementById('bigvideo');
        let elem2 = document.getElementsByClassName('closeBigVideo')[0];
        elem.remove();
        elem2.remove();
    }
    streamDestroyed(stream) {
        this.session.signal({
            data:"removed",
            to: stream.connection,
          },(error) => {
              console.log(error);
          })
    }
    ngOnDestroy() {
        this.session.off('streamCreated');
        this.session.off('sessionConnected'); 
        this.session.destroy();

    }
    


}
