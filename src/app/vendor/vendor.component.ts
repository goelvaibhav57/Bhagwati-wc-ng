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
      (async () => {
      try {
        const data: any = await this.vendorService.getVendorsById(this.id);
        console.log(data);
        this.vendor = data?.[0];
      } catch (error) {
        console.error('Error fetching vendor:', error);
      }
    })();
    }
  }

  async saveVendor() {
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
      try {
        await this.vendorService.addVendor(this.vendor);
        this.message = 'successfully added';
        this.router.navigate(['vendors'], navOptions);
      } catch (error) {
        this.apiError = 'Duplicate Vendor id is not allowed';
      }
    }
    else {
      let navOptions: NavigationExtras = {
        state: {
          statusMessage: 'Vendor updated successfully'
        }
      };
      try {
        // Step 1: Update vendor
        await this.vendorService.updateVendor(this.id, this.vendor);
    
        // Step 2: Update vendor inventory
        await this.inventoryService.updateVendorInventory(this.id, this.vendor);
    
        // Step 3: Set success message and navigate
        this.message = 'Updated Successfully';
        this.router.navigate(['vendors'], navOptions);
    
      } catch (error) {
        if (error.message?.includes('Duplicate Vendor id')) {
          this.apiError = 'Duplicate Vendor id is not allowed';
        } else {
          console.error('Error updating vendor:', error);
          this.apiError = 'Unable to update vendor.';
        }
      }
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
