import { Component, OnInit } from '@angular/core';
import { ViewServiceService } from '../service/view-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InventoryServiceService } from '../service/inventory-service.service';
import { Item } from '../items/items.component';
import { Vendor } from '../vendors/vendors.component';
import { Supplier } from '../suppliers/suppliers.component';
import { Subject } from 'rxjs';
import { filter, startWith, takeUntil } from 'rxjs/operators';

export class Inventory {
  constructor(
    public inventoryId: number,
    public item: Item,
    public vendor: Vendor,
    public supplier: Supplier,
    public currentInventory: number,
    public inventoryCredited: number,
    public inventoryDebited: number,
    public lastUpdated: Date,
    public comments: string
  ) {

  }
}
@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  constructor(private inventoryService: InventoryServiceService, private route: ActivatedRoute, private router: Router) {
    router.events.pipe(takeUntil(this.ngUnsubscribe)).subscribe(event => {
      if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state) {
        this.routeState = this.router.getCurrentNavigation().extras.state;
        if (this.routeState) {
          this.message = this.routeState.statusMessage;
        }
      }
    })
  }
  id: string
  inventories: Inventory[]
  message: string = ''
  routeState: any
  private ngUnsubscribe = new Subject<void>();

  ngOnInit(): void {
    console.log("In Inventory call");
    this.id = this.route.snapshot.params['id'];
    console.log(this.id);
    (async () => {
      try {
        this.inventories = await this.inventoryService.retrieveInventoryById(this.id);
      } catch (error) {
        console.error('Error retrieving Inventory by ID:', error);
      }
    })();
  }

  debitInventory() {
    this.router.navigate(['debit/inventory/', this.id]);
  }

  addInventory() {
    console.log('adding inventory');
    this.router.navigate(['add/inventory/', this.id]);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
