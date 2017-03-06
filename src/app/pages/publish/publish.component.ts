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
    public openTokSessionId:string   = '2_MX40NTc4Nzc0Mn5-MTQ4ODcyNDY2NjkzNn5UbFlGUFZpR0hQaEhOeTREbXl1cXBZUGx-fg';
    public tokenId:string            = 'T1==cGFydG5lcl9pZD00NTc4Nzc0MiZzaWc9M2ZlYmE0ZDZiMjE4NTM1MzkzMmEzM2I3YzhiZWQ0YTk4NGJjYzE0NjpzZXNzaW9uX2lkPTJfTVg0ME5UYzROemMwTW41LU1UUTRPRGN5TkRZMk5qa3pObjVVYkZsR1VGWnBSMGhRYUVoT2VUUkViWGwxY1hCWlVHeC1mZyZjcmVhdGVfdGltZT0xNDg4NzI0NzQxJm5vbmNlPTAuMDQzOTgzNDc4Nzk3MzcxNDEmcm9sZT1tb2RlcmF0b3ImZXhwaXJlX3RpbWU9MTQ5MTMxNjczOQ==';
    public apiKey: string            = '45787742';
    public publisher:any;
    public publisherProperties = {width: 800, height:500, name: ''};
    public session:any;
    public publishStatus:number =    1; //0=not ready, 1=ready,2=publsihed,3=not published;
    public count:number = 0;
    constructor(public http:Http, public router: Router,public dialog: MdDialog){}

    ngAfterViewInit() {
        this.bootstrapPublisher();
        this.CanActivate();
    }
    CanActivate() {
        this.http.get('https://www.fitnesspax.com/api/v1/getwebtoken',{ withCredentials: true })
            .map(res => res.json())
            .subscribe((res:any) => {
                if(res.status == 'No session existed') {
                    window.location.href="https://www.fitnesspax.com/login";
                }
            })
    }
    getUserData(token) {
        this.http.get('https://www.fitnesspax.com/api/v1/logged/userweb?token='+token,{ withCredentials: true })
            .map(res => res.json())
            .subscribe((res:any) => {
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
            if(result == 1)
            this.publisher = OT.initPublisher('myPublisherDiv', this.publisherProperties, (e) => this.publish(e));  
        });
        
        //
    }
    publish(e) {
        this.session.publish(this.publisher, (e) => this.sessionTryingToPublish(e));
         this.session.on("signal", (event)=> { 
             if(event.data == 'joined') {
                     this.count++;
                 } else{
                   this.count--;  
                   if(this.count<0) this.count =0;
                 } 
         })
        this.publishStatus = 1   
    }
    
    sessionTryingToPublish(e) {
        console.log(this.publisher.streamId)
        
        this.http.post('https://www.fitnesspax.com/api/v1/addstream',{streamid:this.publisher.streamId},{ withCredentials: true })
            .map(res => res.json())
            .subscribe((res:any) => {
                console.log(res);
            })
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
