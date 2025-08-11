import { Component, OnInit } from '@angular/core';
import { SupplierServiceService } from '../service/supplier-service.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, startWith, takeUntil } from 'rxjs/operators';

export class Supplier {
  constructor(
    public supplierId: string,
    public supplierDescription: string,
    public lastUpdated: Date,
    public createdDate: Date
  ) {

  }
}
@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.css']
})
export class SuppliersComponent implements OnInit {

  constructor(private supplierService: SupplierServiceService, private router: Router) {
    router.events.subscribe(event => {
      if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state) {
        this.routeState = this.router.getCurrentNavigation().extras.state;
        if (this.routeState) {
          this.message = this.routeState.statusMessage;
        }
      }
    })
  }
  routeState: any
  suppliers: Supplier[]
  message: string
  private ngUnsubscribe = new Subject<void>();
  ngOnInit(): void {
    this.refreshSuppliers();
  }

  async refreshSuppliers() {
    try {
      const response = await this.supplierService.getAllSuppliers();
      this.suppliers = response;
    } catch (err) {
      console.error('Error fetching suppliers:', err);
    }
  }

  async deleteSupplier(id: string) {
    try {
      await this.supplierService.deleteSupplier(id);
      this.message = "Deleted Successfully";
      this.refreshSuppliers();
    } catch (err) {
      console.error('Error deleting supplier:', err);
    }
  }

  updateSupplier(id: string) {
    this.router.navigate(['suppliers', id])
  }

  addSupplier() {
    this.router.navigate(['supplier/add']);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
