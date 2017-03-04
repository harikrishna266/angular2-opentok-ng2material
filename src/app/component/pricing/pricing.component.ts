import { Component, OnInit } from '@angular/core';
import {MdDialog, MdDialogRef} from '@angular/material';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent implements OnInit {

  constructor(public dialogRef: MdDialogRef<PricingComponent>) { }

  ngOnInit() {}
  close() {
      this.dialogRef.close('1');
  }
}
