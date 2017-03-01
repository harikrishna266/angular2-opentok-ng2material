// i don't really think this needed a service, but somehow i ended up writing a service. 

import { Injectable } from '@angular/core';
declare const OT;
declare const document;

@Injectable()

export class PublisherService {

    public openTokSessionId:string   = '1_MX40NTc4Mjg2Mn5-MTQ4ODI2NDI0MzM1Mn5iWFJrUjFPVFlpbzVjSm9scnRVbE4yWFN-fg';
    public tokenId:string            = 'T1==cGFydG5lcl9pZD00NTc4Mjg2MiZzaWc9OTEyNDAwNDkyMzIxODZmNjJjNjZlMmJjNmQ0NGZjNDYxYWY2ZjJmOTpzZXNzaW9uX2lkPTFfTVg0ME5UYzRNamcyTW41LU1UUTRPREkyTkRJME16TTFNbjVpV0ZKclVqRlBWRmxwYnpWalNtOXNjblJWYkU0eVdGTi1mZyZjcmVhdGVfdGltZT0xNDg4MjY0MjcyJm5vbmNlPTAuNjI2ODM2NDgwOTQzMzcyNCZyb2xlPW1vZGVyYXRvciZleHBpcmVfdGltZT0xNDkwODU2Mjcx';
    public apiKey: string            = '45782862';
    public publisher:any;
    public publisherProperties = {width: 800, height:500, name: ''};
    public session:any;
    public publishStatus:number =    0; //0=not ready, 1=ready,2=publsihed,3=not published

    bootstrapPublisher(){
        this.session = OT.initSession(this.apiKey, this.openTokSessionId);
        this.session.connect(this.tokenId, (e) => {console.log('connection established'); });
        this.session.on('sessionConnected',(e) => this.onSessionConnect());
    }

    onSessionConnect() {
        //next two lines are very bad, need some improvement here. 
         if(document.getElementById('myPublisherDivd') == null) 
            document.getElementById('publisherHolder').innerHTML = '<div id="myPublisherDiv"></div>';
        this.publisher = OT.initPublisher('myPublisherDiv', this.publisherProperties, (e) => {this.publishStatus = 1});
    }
    publisherInit() {
        this.session.publish(this.publisher, (e) => this.sessionTryingToPublish(e));
    }
    sessionTryingToPublish(e) {
        this.publishStatus = 2;
    }
    stopPublishing() {
        this.publishStatus = 3;
        this.session.unpublish(this.publisher);
        this.onSessionConnect();
    }
    destroy() {
        if (this.publisher) this.stopPublishing();
        this.session.off('sessionConnected'); 
    }

}
