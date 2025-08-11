import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { InventoryServiceService } from '../service/inventory-service.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Inventory } from '../inventory/inventory.component';
import { Item } from '../items/items.component';
import { Supplier } from '../suppliers/suppliers.component';
import { SupplierServiceService } from '../service/supplier-service.service';
import { Subject } from 'rxjs';
import { filter, startWith, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-add-inventory',
  templateUrl: './add-inventory.component.html',
  styleUrls: ['./add-inventory.component.css']
})
export class AddInventoryComponent implements OnInit {
  id: string
  inventory: Inventory
  message: string
  item: Item
  suppliers: Supplier[]
  selectedSupplier: Supplier
  submitted: boolean
  errorMessage: string = 'Supplier and Items to be added can not be blank'
  templist = [];
  list = [];
  onChange: any = () => { };
  onTouch: any = () => { };
  val = "";
  shown = false;
  apiError: any
  selected: any
  @ViewChild('searchfield', { static: false }) searchfield: ElementRef;
  size = 'small';
  private ngUnsubscribe = new Subject<void>();
  constructor(private inventoryService: InventoryServiceService, private supplierService: SupplierServiceService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    (async () => {
    try {
      console.log('getting suppliers');
      const supplierData = await this.supplierService.getAllSuppliers();
      this.suppliers = supplierData;
      this.list = supplierData;
      this.templist = supplierData;
    } catch (err) {
      console.error('Error fetching suppliers:', err);
    }
  })();
    this.item = new Item(this.id, '', 0, new Date(), new Date());
    this.inventory = new Inventory(0, this.item, null, null, 0, 0, 0, new Date(), '')
  }

  async addInventory() {
    this.submitted = true
    if (this.checkValidity()) {
      return;
    }
    let navOptions: NavigationExtras = {
      state: {
        statusMessage: 'Inventory added successfully'
      }
    };
    this.inventory.supplier = this.selectedSupplier;
    try {
      await this.inventoryService.addInventory(this.id, this.inventory);
      this.message = 'Added Successfully';
      this.router.navigate(['inventory', this.id], navOptions);
    } catch (error) {
      console.error('Error adding inventory:', error);
      this.apiError = 'Unable to add inventory.';
    }
  }

  checkValidity() {
    if (this.submitted && (this.inventory.inventoryCredited <= 0 || this.selectedSupplier?.supplierId == '')) {
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
    // console.log(this.searchfield.nativeElement);
    setTimeout(() => {
      this.searchfield.nativeElement.focus();
    }, 200)

  }
  select(e, supplier) {
    console.log('In select')
    this.selectedSupplier = supplier;
    this.selected = supplier['supplierDescription'];
    this.shown = false;
    this.onChange(supplier['supplierDescription']);
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
    console.log(this.templist)
    console.log(e)
    const val = e.toLowerCase();
    const temp = this.templist.filter(x => {
      if (x['supplierDescription'].toLowerCase().indexOf(val) !== -1 || !val) {
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
