import { Component, OnInit } from '@angular/core';
import { VendorServiceService } from '../service/vendor-service.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, startWith, takeUntil } from 'rxjs/operators';

export class Vendor{
  constructor(
    public vendorId: string,
    public vendorDescription:string,
    public lastUpdated : Date,
    public createdDate : Date
  ){

  }
}
@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.css']
})
export class VendorsComponent implements OnInit {

  constructor(private vendorService: VendorServiceService, private router: Router) { 
    router.events.subscribe(event => {
      if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state) {
        this.routeState = this.router.getCurrentNavigation().extras.state;
        if (this.routeState) {
          this.message = this.routeState.statusMessage;
        }
      }
    })
  }
  routeState : any
  vendors : Vendor[]
  message : string
  private ngUnsubscribe = new Subject<void>();
  ngOnInit(): void {
    this.refreshvendors();
  }

  refreshvendors(){
    this.vendorService.getAllVendors().pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      response => (
        this.vendors = response
      )
    )
  }

  deleteVendor(id:string){
    this.vendorService.deleteVendor(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      response => {
        this.message = "Deleted Successfully";
        this.refreshvendors();
      }
    )
  }

  updateVendor(id:string){
      this.router.navigate(['vendors',id])
  }

  addVendor(){
    this.router.navigate(['vendor/add']);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
