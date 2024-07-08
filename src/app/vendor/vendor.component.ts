import { Component, OnInit } from '@angular/core';
import { VendorServiceService } from '../service/vendor-service.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Vendor } from '../vendors/vendors.component';
import { InventoryServiceService } from '../service/inventory-service.service';
import { Subject } from 'rxjs';
import { filter, startWith, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css']
})
export class VendorComponent implements OnInit {

  id: string
  vendor: Vendor
  message: string
  submitted: boolean
  errorMessage: string = 'Vendor Id and Vendor Description can not be empty'
  apiError: string
  private ngUnsubscribe = new Subject<void>();
  constructor(private vendorService: VendorServiceService, private inventoryService: InventoryServiceService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    if (this.id == null) {
      this.vendor = new Vendor('', '', new Date(), new Date())
    }
    else {
      this.vendorService.getVendorsById(this.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(

        data => {
          console.log(data);
          this.vendor = data?.[0];
        }
      )
    }
  }

  saveVendor() {
    this.submitted = true
    if(this.checkValidity()){
      return;
    }
    if (this.id == null) {
      let navOptions: NavigationExtras = {
        state: {
          statusMessage: 'Vendor added successfully'
        }
      };
      this.vendorService.addVendor(this.vendor).pipe(takeUntil(this.ngUnsubscribe)).subscribe(
        response => {
          this.message = 'successfully added';
          this.router.navigate(['vendors'], navOptions);
        },
        error => {
          this.apiError = 'Duplicate Vendor id is not allowed';
        } 
      )
    }
    else {
      let navOptions: NavigationExtras = {
        state: {
          statusMessage: 'Vendor updated successfully'
        }
      };
      this.vendorService.updateVendor(this.id, this.vendor).subscribe(
        response => {
          this.message = 'Updated Successfully';
          this.inventoryService.updateVendorInventory(this.id, this.vendor).pipe(takeUntil(this.ngUnsubscribe)).subscribe();
          this.router.navigate(['vendors'], navOptions);
        },
        error => {
          this.apiError = 'Duplicate Vendor id is not allowed';
        } 
      )
    }
  }

  checkValidity(){
    if(this.submitted && (this.vendor.vendorDescription == '' || this.vendor.vendorId == '')){
      return true;
    }
    else {
      return false;
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
