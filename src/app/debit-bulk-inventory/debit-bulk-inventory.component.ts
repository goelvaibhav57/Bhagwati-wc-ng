import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Item } from '../items/items.component';
import { Vendor } from '../vendors/vendors.component';
import { InventoryServiceService, BulkInventoryDebitRequest } from '../service/inventory-service.service';
import { VendorServiceService } from '../service/vendor-service.service';
import { ViewServiceService } from '../service/view-service.service';

export class BulkInventoryDebitRow {
  constructor(
    public item: Item,
    public selectedVendorId: string,
    public vendor: Vendor,
    public inventoryDebited: number | null,
    public comments: string
  ) { }
}

@Component({
  selector: 'app-debit-bulk-inventory',
  templateUrl: './debit-bulk-inventory.component.html',
  styleUrls: ['./debit-bulk-inventory.component.css']
})
export class DebitBulkInventoryComponent implements OnInit {

  rows: BulkInventoryDebitRow[] = [];
  filteredRows: BulkInventoryDebitRow[] = [];
  vendors: Vendor[] = [];
  message: string = '';
  apiError: string = '';
  submitted: boolean = false;
  searchText: string = '';
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private viewService: ViewServiceService,
    private vendorService: VendorServiceService,
    private inventoryService: InventoryServiceService,
    private router: Router) { }

  ngOnInit(): void {
    this.viewService.retrieveAllItems().pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      response => {
        this.rows = response.map(item => new BulkInventoryDebitRow(item, '', null, null, ''));
        this.filteredRows = [...this.rows];
      }
    );

    this.vendorService.getAllVendors().pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      response => {
        this.vendors = response;
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

  bulkDebitInventory() {
    this.submitted = true;
    const rowsToUpdate = this.rows.filter(row => this.hasInventoryValue(row));
    if (rowsToUpdate.length === 0) {
      this.apiError = 'Enter a count for at least one item to debit inventory.';
      return;
    }

    const invalidRows = rowsToUpdate.filter(row =>
      !row.selectedVendorId || !isFinite(row.inventoryDebited) || row.inventoryDebited <= 0
    );
    if (invalidRows.length > 0) {
      this.apiError = 'Select a vendor and enter a count greater than zero for each item with a count.';
      return;
    }

    this.apiError = '';
    const bulkRequest: BulkInventoryDebitRequest[] = rowsToUpdate.map(row => ({
      itemId: row.item.itemId,
      vendorId: row.selectedVendorId,
      inventoryDebited: row.inventoryDebited,
      comments: row.comments
    }));

    this.inventoryService.bulkDebitInventory(bulkRequest).pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      () => {
        this.message = 'Inventory debited successfully';
        this.router.navigate(['items'], { state: { statusMessage: 'Inventory debited successfully' } });
      },
      () => {
        this.apiError = 'Bulk inventory debit failed. Please try again.';
      }
    );
  }

  hasInventoryValue(row: BulkInventoryDebitRow) {
    return row.inventoryDebited !== null && row.inventoryDebited !== undefined;
  }

  isVendorInvalid(row: BulkInventoryDebitRow) {
    return this.submitted && this.hasInventoryValue(row) && !row.selectedVendorId;
  }

  isCountInvalid(row: BulkInventoryDebitRow) {
    return this.submitted && this.hasInventoryValue(row) &&
      (!isFinite(row.inventoryDebited) || row.inventoryDebited <= 0);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
