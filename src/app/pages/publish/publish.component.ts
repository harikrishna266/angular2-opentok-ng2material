import { Component, OnInit ,ViewChild,ViewContainerRef} from '@angular/core';
import {PublisherService} from '../../providers/providers';
import { Http, Response }          from '@angular/http';
import { PricingComponent } from '../../component/pricing/pricing.component';
import {MdDialog,MdDialogRef} from '@angular/material';
import {Router} from '@angular/router';
declare const OT;

@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.css']
})
export class PublishComponent {

    public description;
    public title;
    public openTokSessionId:string   = '1_MX40NTc4Mjg2Mn5-MTQ4ODI2NDI0MzM1Mn5iWFJrUjFPVFlpbzVjSm9scnRVbE4yWFN-fg';
    public tokenId:string            = 'T1==cGFydG5lcl9pZD00NTc4Mjg2MiZzaWc9OTEyNDAwNDkyMzIxODZmNjJjNjZlMmJjNmQ0NGZjNDYxYWY2ZjJmOTpzZXNzaW9uX2lkPTFfTVg0ME5UYzRNamcyTW41LU1UUTRPREkyTkRJME16TTFNbjVpV0ZKclVqRlBWRmxwYnpWalNtOXNjblJWYkU0eVdGTi1mZyZjcmVhdGVfdGltZT0xNDg4MjY0MjcyJm5vbmNlPTAuNjI2ODM2NDgwOTQzMzcyNCZyb2xlPW1vZGVyYXRvciZleHBpcmVfdGltZT0xNDkwODU2Mjcx';
    public apiKey: string            = '45782862';
    public publisher:any;
    public publisherProperties = {width: 800, height:500, name: ''};
    public session:any;
    public publishStatus:number =    1; //0=not ready, 1=ready,2=publsihed,3=not published;
    public count:number = 0;
    constructor(public http:Http, public router: Router,public dialog: MdDialog){}

    ngAfterViewInit() {
        this.bootstrapPublisher();
        //this.CanActivate();
    }
    CanActivate() {
        this.http.get('https://www.fitnesspax.com/api/v1/getwebtoken',{ withCredentials: true })
            .map(res => res.json())
            .subscribe((res:any) => {
                if(res.status == 'No session existed') {
                    window.location.href="https://www.fitnesspax.com/login";
                }else {
                    this.getUserData(res.token);
                }
            })
    }
    getUserData(token) {
        this.http.get('https://www.fitnesspax.com/api/v1/logged/userweb?token='+token,{ withCredentials: true })
            .map(res => res.json())
            .subscribe((res:any) => {
                if(res.user.role == "User") {
                    this.router.navigate(['/home']);
                }else {
                    this.router.navigate(['/publish']);
                }
            })
    }
    

    bootstrapPublisher(){
        this.session = OT.initSession(this.apiKey, this.openTokSessionId);
        this.session.connect(this.tokenId, (e) => {console.log('connection established'); });
        //this.session.on('sessionConnected',(e) => this.onSessionConnect());
    }

    publisherInit() {
        if (typeof this.title !== 'undefined' && typeof this.description !== 'undefined') {
            this.publisherProperties.name = this.title +', ' + this.description;
        } else if (typeof this.description === 'undefined') {
            this.publisherProperties.name = this.title;
        }
        if(typeof this.publisherProperties.name =='undefined') {
            alert('Please enter a name and description!') ;
            return false;
        }
        if(document.getElementById('myPublisherDivd') == null) {
            document.getElementById('publisherHolder').innerHTML = '<div id="myPublisherDiv"></div>';    
        }
         let dialogRef = this.dialog.open(PricingComponent, {
                                              height: '200px',
                                              width: '300px',
                                        });
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if(result == 1)
            this.publisher = OT.initPublisher('myPublisherDiv', this.publisherProperties, (e) => this.publish());  
        });
        
        //
    }
    publish() {
        this.session.publish(this.publisher, (e) => this.sessionTryingToPublish(e));
         this.session.on("signal", (event)=> { 
             if(event.data == 'joined') this.count++; else this.count--;
         })
        this.publishStatus = 1   
    }
    
    sessionTryingToPublish(e) {
        this.publishStatus = 2;
    }
    stopPublishing(paused=true) {
        this.publishStatus = 3;
        this.session.unpublish(this.publisher);
        if(paused)this.recreateElements();
    }
    recreateElements() {
        if(document.getElementById('myPublisherDivd') == null) {
            document.getElementById('publisherHolder').innerHTML = '<div id="myPublisherDiv"></div>';    
        }
    }
    ngOnDestroy() {
        if (this.publisher) this.stopPublishing(false);
        this.session.off('sessionConnected'); 
        this.session.destroy();
    }

}
