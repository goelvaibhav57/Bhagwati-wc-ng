import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { InventoryServiceService } from '../service/inventory-service.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Inventory } from '../inventory/inventory.component';
import { Vendor } from '../vendors/vendors.component';
import { VendorServiceService } from '../service/vendor-service.service';
import { Item } from '../items/items.component';
import { Subject } from 'rxjs';
import { filter, startWith, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-debit-inventory',
  templateUrl: './debit-inventory.component.html',
  styleUrls: ['./debit-inventory.component.css']
})
export class DebitInventoryComponent implements OnInit {
  id: string
  inventory: Inventory
  item: Item
  vendors: Vendor[]
  message: string
  submitted: boolean
  selectedVendor: Vendor
  errorMessage: string = 'Vendor and Items to be debitted can not be blank'
  templist = [];
  list = [];
  apiError: any
  onChange: any = () => { };
  onTouch: any = () => { };
  val = "";
  shown = false;
  selected: any
  @ViewChild('searchfield', { static: false }) searchfield: ElementRef;
  size = 'small';
  private ngUnsubscribe = new Subject<void>();
  constructor(private inventoryService: InventoryServiceService, private vendorService: VendorServiceService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.item = new Item(this.id, '', 0, new Date(), new Date());
    this.inventory = new Inventory(0, this.item, null, null, 0, 0, 0, new Date(), '');
    (async () => {
    try {
      const vendorData = await this.vendorService.getAllVendors();
      this.vendors = vendorData;
      this.list = vendorData;
      this.templist = vendorData;
    } catch (err) {
      console.error('Error fetching vendors:', err);
    }
  })();
  }

  async debitInventory() {
    this.submitted = true;
    if (this.checkValidity()) {
      return;
    }
    let navOptions: NavigationExtras = {
      state: {
        statusMessage: 'Inventory debitted successfully'
      }
    };
    this.inventory.vendor = this.selectedVendor;
    try {
      await this.inventoryService.debitInventory(this.id, this.inventory);
      this.message = 'Debited Successfully';
      this.router.navigate(['inventory/', this.id], navOptions);
    } catch (error) {
      console.error('Error debiting inventory:', error);
      this.apiError = 'Unable to debit inventory.';
    }
  }

  checkValidity() {
    if (this.submitted && (this.inventory.inventoryDebited <= 0 || this.selectedVendor?.vendorId == '')) {
      return true;
    }
    else {
      return false;
    }
  }

  show(e) {

    this.shown = this.shown ? false : true;
    this.val = '';
    this.search('');
    setTimeout(() => {
      this.searchfield.nativeElement.focus();
    }, 200)

  }
  select(e, vendor) {
    this.selectedVendor = vendor;
    this.selected = vendor['vendorDescription'];
    this.shown = false;
    this.onChange(vendor['vendorDescription']);
  }

  set value(val) {
    if (val !== undefined && this.val !== val) {
      this.val = val
      this.onChange(val)
      this.onTouch(val)
    }
  }
  writeValue(value: any) {
    this.value = value
  }
  registerOnChange(fn: any) {
    this.onChange = fn
  }
  registerOnTouched(fn: any) {
    this.onTouch = fn
  }

  search(e) {
    const val = e.toLowerCase();
    const temp = this.templist.filter(x => {
      if (x['vendorDescription'].toLowerCase().indexOf(val) !== -1 || !val) {
        return x;
      }
    })
    this.list = temp;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
