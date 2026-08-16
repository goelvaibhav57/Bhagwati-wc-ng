import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Inventory } from '../inventory/inventory.component';
import { Item } from '../items/items.component';
import { InventoryServiceService } from '../service/inventory-service.service';
import { SupplierServiceService } from '../service/supplier-service.service';
import { ViewServiceService } from '../service/view-service.service';
import { Supplier } from '../suppliers/suppliers.component';

export class BulkInventoryRow {
  constructor(
    public item: Item,
    public selectedSupplierId: string,
    public supplier: Supplier,
    public inventoryCredited: number,
    public comments: string
  ) { }
}

@Component({
  selector: 'app-bulk-update-inventory',
  templateUrl: './bulk-update-inventory.component.html',
  styleUrls: ['./bulk-update-inventory.component.css']
})
export class BulkUpdateInventoryComponent implements OnInit {

  rows: BulkInventoryRow[] = [];
  suppliers: Supplier[] = [];
  message: string = '';
  apiError: string = '';
  submitted: boolean = false;
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private viewService: ViewServiceService,
    private supplierService: SupplierServiceService,
    private inventoryService: InventoryServiceService,
    private router: Router) { }

  ngOnInit(): void {
    this.viewService.retrieveAllItems().pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      response => {
        this.rows = response.map(item => new BulkInventoryRow(item, '', null, 0, ''));
      }
    );

    this.supplierService.getAllSuppliers().pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      response => {
        this.suppliers = response;
      }
    );
  }

  bulkUpdateInventory() {
    this.submitted = true;
    const invalidRows = this.rows.filter(row => !row.selectedSupplierId || row.inventoryCredited <= 0);
    if (invalidRows.length > 0) {
      this.apiError = 'Please select a supplier and enter a count greater than zero for every item.';
      return;
    }

    this.apiError = '';
    const requests = this.rows.map(row => {
      const supplier = this.suppliers.find(currentSupplier => currentSupplier.supplierId === row.selectedSupplierId);
      const inventory = new Inventory(0, row.item, null, supplier, 0, row.inventoryCredited, 0, new Date(), row.comments);
      row.supplier = supplier;
      return this.inventoryService.addInventory(row.item.itemId, inventory);
    });

    forkJoin(requests).pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      () => {
        this.message = 'Inventory updated successfully';
        this.router.navigate(['items'], { state: { statusMessage: 'Inventory updated successfully' } });
      },
      () => {
        this.apiError = 'Bulk inventory update failed. Please try again.';
      }
    );
  }

  isInvalid(row: BulkInventoryRow) {
    return this.submitted && (!row.selectedSupplierId || row.inventoryCredited <= 0);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
