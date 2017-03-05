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
    public openTokSessionId:string   = '1_MX40NTc4Mjg2Mn5-MTQ4ODI2NDI0MzM1Mn5iWFJrUjFPVFlpbzVjSm9scnRVbE4yWFN-fg';
    public tokenId:string            = 'T1==cGFydG5lcl9pZD00NTc4Mjg2MiZzaWc9OTEyNDAwNDkyMzIxODZmNjJjNjZlMmJjNmQ0NGZjNDYxYWY2ZjJmOTpzZXNzaW9uX2lkPTFfTVg0ME5UYzRNamcyTW41LU1UUTRPREkyTkRJME16TTFNbjVpV0ZKclVqRlBWRmxwYnpWalNtOXNjblJWYkU0eVdGTi1mZyZjcmVhdGVfdGltZT0xNDg4MjY0MjcyJm5vbmNlPTAuNjI2ODM2NDgwOTQzMzcyNCZyb2xlPW1vZGVyYXRvciZleHBpcmVfdGltZT0xNDkwODU2Mjcx';
    public apiKey: string            = '45782862';
    public liveStream:any;
    public laregerVideo:any;
    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.params.subscribe((params:any) => {
            this.streamid = params.id;
            if(this.streamid )
            this.initSession();        
        })
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
    streamCreated(stream) {
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
