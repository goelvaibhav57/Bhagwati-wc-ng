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
    this.refreshVendors();
  }

  async refreshVendors() {
    try {
      const response = await this.vendorService.getAllVendors();
      this.vendors = response;
    } catch (err) {
      console.error('Error fetching vendors:', err);
    }
  }

  async deleteVendor(id: string) {
    try {
      await this.vendorService.deleteVendor(id);
      this.message = "Deleted Successfully";
      this.refreshVendors();
    } catch (err) {
      console.error('Error deleting vendor:', err);
    }
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
