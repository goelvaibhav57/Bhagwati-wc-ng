import { Component, OnInit } from '@angular/core';
import { Supplier } from '../suppliers/suppliers.component';
import { SupplierServiceService } from '../service/supplier-service.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { InventoryServiceService } from '../service/inventory-service.service';
import { Subject } from 'rxjs';
import { filter, startWith, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class SupplierComponent implements OnInit {
  id: string
  supplier: Supplier
  message: string
  errorMessage: string = 'Supplier Id and Supplier Description can not be empty'
  submitted: boolean
  apiError: string
  private ngUnsubscribe = new Subject<void>();
  constructor(private supplierService: SupplierServiceService, private inventoryService: InventoryServiceService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    if (this.id == null) {
      this.supplier = new Supplier('', '', new Date(), new Date())
    }
    else {
      (async () => {
      try {
        const data = await this.supplierService.getSuppliersById(this.id);
        console.log(data);
        this.supplier = Array.isArray(data) ? data[0] : data;
      } catch (err) {
        console.error('Error fetching supplier:', err);
      }
    })();
    }
  }

  async saveSupplier() {
    this.submitted = true
    if (this.checkValidity()) {
      return;
    }
    if (this.id == null) {
      let navOptions: NavigationExtras = {
        state: {
          statusMessage: 'Supplier added successfully'
        }
      };
      try {
        await this.supplierService.addSupplier(this.supplier);
    
        this.message = 'Successfully added';
        this.router.navigate(['suppliers'], navOptions);
    
      } catch (err) {
        console.error(err);
        this.apiError = 'Duplicate Supplier id is not allowed';
      }
    }
    else {
      let navOptions: NavigationExtras = {
        state: {
          statusMessage: 'Supplier updated successfully'
        }
      };
      try {
        await this.supplierService.updateSupplier(this.id, this.supplier);
    
        this.message = 'Updated Successfully';
    
        // Update supplier in inventory
        await this.inventoryService.updateSupplierInventory(this.id, this.supplier);
    
        // Navigate after both updates are done
        this.router.navigate(['suppliers'], navOptions);
    
      } catch (err) {
        console.error(err);
        this.apiError = 'Duplicate Supplier id is not allowed';
      }
    }
  }

  checkValidity() {
    if (this.submitted && (this.supplier.supplierDescription == '' || this.supplier.supplierId == '')) {
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
