import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
declare const OT;

@Injectable()
export class OpentokService {

    public openTokSessionId:string   = '1_MX40NTc4Mjg2Mn5-MTQ4ODI2NDI0MzM1Mn5iWFJrUjFPVFlpbzVjSm9scnRVbE4yWFN-fg';
    public tokenId:string            = 'T1==cGFydG5lcl9pZD00NTc4Mjg2MiZzaWc9OTEyNDAwNDkyMzIxODZmNjJjNjZlMmJjNmQ0NGZjNDYxYWY2ZjJmOTpzZXNzaW9uX2lkPTFfTVg0ME5UYzRNamcyTW41LU1UUTRPREkyTkRJME16TTFNbjVpV0ZKclVqRlBWRmxwYnpWalNtOXNjblJWYkU0eVdGTi1mZyZjcmVhdGVfdGltZT0xNDg4MjY0MjcyJm5vbmNlPTAuNjI2ODM2NDgwOTQzMzcyNCZyb2xlPW1vZGVyYXRvciZleHBpcmVfdGltZT0xNDkwODU2Mjcx';
    public apiKey: string            = '45782862';
    public videoSubscriber:any;
    public session:any;
    
    constructor() {}
    
    initSession() {
        this.session = OT.initSession(this.apiKey, this.openTokSessionId);
        this.session.connect(this.tokenId, (e) => this.tryingToConnect(e));
        this.session.on('sessionConnected',(e) => this.onSessionConnect(e));
    }
    
    onSessionConnect(e) {
        console.log('session connected')
    }
    tryingToConnect(e) {
        this.session.on('streamCreated',(e) => this.streamCreated(e));
        this.session.on('streamDestroyed',(e) => this.streamDestroyed(e));
    }
    streamCreated(stream) {
        let subscriberProperties = {insertMode: 'append'};
        if(document.getElementById('layout') == null) 
            document.getElementById('allStreams').innerHTML = '<div id="layout"></div>';
        this.videoSubscriber = this.session.subscribe(stream.stream, 'layout', subscriberProperties);
    }
    streamDestroyed(stream) {

    }
    destroy() {
        this.session.unsubscribe(this.videoSubscriber);
        this.session.off('streamCreated');
        this.session.off('sessionConnected'); 
    }

}
