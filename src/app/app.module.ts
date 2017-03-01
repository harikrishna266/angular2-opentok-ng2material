import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

import {OpentokService,PublisherService} from './providers/providers';
import {PublishComponent,HomeComponent} from './pages/pages';
import { RoomComponent } from './pages/room/room.component';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'publish',      component: PublishComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: '**', component: HomeComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    PublishComponent,
    HomeComponent,
    RoomComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [OpentokService,PublisherService],
  bootstrap: [AppComponent]
})
export class AppModule { }
