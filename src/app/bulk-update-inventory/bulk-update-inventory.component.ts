import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
    public inventoryCredited: number | null,
    public comments: string
  ) { }
}

export interface BulkInventoryRequest {
  itemId: number;
  supplierId: string;
  inventoryCredited: number;
  comments: string;
}

export interface BulkInventoryDebitRequest {
  itemId: number;
  vendorId: string;
  inventoryDebited: number;
  comments: string;
}

@Component({
  selector: 'app-add-bulk-inventory',
  templateUrl: './bulk-update-inventory.component.html',
  styleUrls: ['./bulk-update-inventory.component.css']
})
export class AddBulkInventoryComponent implements OnInit {

  rows: BulkInventoryRow[] = [];
  filteredRows: BulkInventoryRow[] = [];
  suppliers: Supplier[] = [];
  message: string = '';
  apiError: string = '';
  submitted: boolean = false;
  searchText: string = '';
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private viewService: ViewServiceService,
    private supplierService: SupplierServiceService,
    private inventoryService: InventoryServiceService,
    private router: Router) { }

  ngOnInit(): void {
    this.viewService.retrieveAllItems().pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      response => {
        this.rows = response.map(item => new BulkInventoryRow(item, '', null, null, ''));
        this.filteredRows = [...this.rows];
      }
    );

    this.supplierService.getAllSuppliers().pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      response => {
        this.suppliers = response;
      }
    );
  }

  filterItems() {
    const value = (this.searchText || '').trim().toLowerCase();
    if (!value) {
      this.filteredRows = [...this.rows];
      return;
    }

    this.filteredRows = this.rows.filter(row =>
      row.item.itemCode.toLowerCase().includes(value) ||
      row.item.itemDescription.toLowerCase().includes(value)
    );
  }

  bulkUpdateInventory() {
    this.submitted = true;
    const rowsToUpdate = this.rows.filter(row => this.hasInventoryValue(row));
    if (rowsToUpdate.length === 0) {
      this.apiError = 'Enter a count for at least one item to update inventory.';
      return;
    }

    const invalidRows = rowsToUpdate.filter(row =>
      !row.selectedSupplierId || !isFinite(row.inventoryCredited) || row.inventoryCredited <= 0
    );
    if (invalidRows.length > 0) {
      this.apiError = 'Select a supplier and enter a count greater than zero for each item with a count.';
      return;
    }

    this.apiError = '';
    const bulkRequest: BulkInventoryRequest[] = rowsToUpdate.map(row => ({
      itemId: row.item.itemId,
      supplierId: row.selectedSupplierId,
      inventoryCredited: row.inventoryCredited,
      comments: row.comments
    }));

    this.inventoryService.bulkAddInventory(bulkRequest).pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      () => {
        this.message = 'Inventory updated successfully';
        this.router.navigate(['items'], { state: { statusMessage: 'Inventory updated successfully' } });
      },
      () => {
        this.apiError = 'Bulk inventory update failed. Please try again.';
      }
    );
  }

  hasInventoryValue(row: BulkInventoryRow) {
    return row.inventoryCredited !== null && row.inventoryCredited !== undefined;
  }

  isSupplierInvalid(row: BulkInventoryRow) {
    return this.submitted && this.hasInventoryValue(row) && !row.selectedSupplierId;
  }

  isCountInvalid(row: BulkInventoryRow) {
    return this.submitted && this.hasInventoryValue(row) &&
      (!isFinite(row.inventoryCredited) || row.inventoryCredited <= 0);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
