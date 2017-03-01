import { Component, OnInit } from '@angular/core';
import {OpentokService} from '../../providers/providers';
import { Router } from '@angular/router';
declare const OT;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

    public openTokSessionId:string   = '1_MX40NTc4Mjg2Mn5-MTQ4ODI2NDI0MzM1Mn5iWFJrUjFPVFlpbzVjSm9scnRVbE4yWFN-fg';
    public tokenId:string            = 'T1==cGFydG5lcl9pZD00NTc4Mjg2MiZzaWc9OTEyNDAwNDkyMzIxODZmNjJjNjZlMmJjNmQ0NGZjNDYxYWY2ZjJmOTpzZXNzaW9uX2lkPTFfTVg0ME5UYzRNamcyTW41LU1UUTRPREkyTkRJME16TTFNbjVpV0ZKclVqRlBWRmxwYnpWalNtOXNjblJWYkU0eVdGTi1mZyZjcmVhdGVfdGltZT0xNDg4MjY0MjcyJm5vbmNlPTAuNjI2ODM2NDgwOTQzMzcyNCZyb2xlPW1vZGVyYXRvciZleHBpcmVfdGltZT0xNDkwODU2Mjcx';
    public apiKey: string            = '45782862';
    public videoSubscriber:any;
    public session:any;
    public laregerVideo:any;
    constructor(public opentok:OpentokService, public router: Router) { }

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
    }
    streamCreated(stream) {
        let subscriberProperties = {insertMode: 'append',width: (document.documentElement.clientWidth/3)-110, height: 240};
        if(document.getElementById('layout') == null) 
            document.getElementById('allStreams').innerHTML = '<div id="layout"></div>';
        this.videoSubscriber = this.session.subscribe(stream.stream, 'layout', subscriberProperties);
        (document.documentElement.clientWidth/3)-30
        this.enlargeButton(stream,this.videoSubscriber);
        //this.AddViewMoreButton(stream);
        
    }
    enlargeButton(stream,videoId) {
        let elements = document.getElementsByClassName('OT_root');
        for (let el of <any>elements) {
            let iddd = document.getElementById(el.id);
                if (document.getElementsByClassName('button_'+ el.id).length == 0) {
                let elm = document.createElement('div');
                elm.className = 'enlage ';
                elm.addEventListener('click', (e) => this.enlarge(elm, stream.stream));
                iddd.appendChild(elm);
            }
        }
    }

    enlarge(e,stream) {
       if(e.className.indexOf('minimize') == -1){
            e.className += " minimize";
            this.enlargeVideo(stream);
       }else{
           this.laregerVideo.destroy()
           e.className = " enlage";
       }
    }
    enlargeVideo(stream) {
        let subscriberProperties = {insertMode: 'append',width: window.innerWidth-100, height: window.innerHeight-100};
            if(document.getElementById('bigvideo') == null) 
                document.getElementById('bigvideoholder').innerHTML = '<div id="bigvideo"></div>';
            this.laregerVideo = this.session.subscribe(stream, 'bigvideo', subscriberProperties);
    }
    minimizeVideo(stream) {
        let subscriberProperties = {insertMode: 'append',width: (document.documentElement.clientWidth/3)-110, height: 240};
            if(document.getElementById('layout') == null) 
                document.getElementById('allStreams').innerHTML = '<div id="layout"></div>';
            this.videoSubscriber = this.session.subscribe(stream.stream, 'layout', subscriberProperties);
            (document.documentElement.clientWidth/3)-30;
    }
    view(e, stream) {
        this.session.currentStream = stream;
        this.router.navigate(['/room', stream.streamId]);
    }
    
    ngOnDestroy() {
        this.session.off('streamCreated');
        this.session.off('sessionConnected'); 
        this.session.destroy();

    }
}
