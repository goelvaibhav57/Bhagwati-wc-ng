import { Component, OnInit } from '@angular/core';
import { ViewServiceService } from '../service/view-service.service';
import { Router } from '@angular/router';
import { InventoryServiceService } from '../service/inventory-service.service';
import { Subject } from 'rxjs';
import { filter, startWith, takeUntil } from 'rxjs/operators';

export class Item {
  constructor(
    public itemCode: string,
    public itemDescription: string,
    public warehouseNumber: number,
    public createdDate: Date,
    public lastUpdated: Date
  ) {

  }
}
@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {

  constructor(private viewService: ViewServiceService, private inventoryService: InventoryServiceService, private router: Router) {
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
  message: string
  items: Item[]
  filteredItems: Item[]
  filterValue: string
  apiError: any
  category = {
    id: 1,
    description: 'Abstract'
  }
  private ngUnsubscribe = new Subject<void>();
  ngOnInit(): void {
    this.refreshItems();
  }

    async refreshItems() {
      try {
        const data = await this.viewService.fetchAllItems();
        this.items = data;
        this.filteredItems = [...this.items];
      } catch (error) {
        console.error('Error retrieving items:', error);
      }
    }

  filterItems() {
    this.filteredItems = this.items.filter(data =>
      data?.itemCode.toLowerCase().indexOf(this.filterValue.toLowerCase()) != -1 ||
      data?.itemDescription.toLowerCase().indexOf(this.filterValue.toLowerCase()) != -1
    )
  }

  // deleteItem(id: string) {
  //   this.viewService.deleteItem(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(
  //     response => {
  //       this.message = 'Deleted Successfully';
  //       this.inventoryService.deleteInventory(id).subscribe()
  //       this.refreshItems();
  //     }
  //   )
  // }

  async deleteItem(id: string) {
    try {
      // Step 1: Delete the item
      await this.viewService.deleteItem(id);
  
      // Step 2: Delete inventory (not blocking the next step if you want)
      await this.inventoryService.deleteInventory(id);
  
      // Step 3: Update UI
      this.message = 'Deleted Successfully';
      this.refreshItems();
  
    } catch (error) {
      console.error('Error deleting item:', error);
      this.apiError = 'Unable to delete item.';
    }
  }

  updateItem(id: string) {
    this.router.navigate(['item/update/', id]);
  }

  getInventory(id: string) {
    this.router.navigate(['inventory/', id]);
  }
  addItem() {
    this.router.navigate(['item/add']);
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
