import { Component, OnInit } from '@angular/core';
import { ViewServiceService } from '../service/view-service.service';
import { Item } from '../items/items.component';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { InventoryServiceService } from '../service/inventory-service.service';
import { Subject } from 'rxjs';
import { filter, startWith, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  id: string
  item: Item
  message: string
  submitted: boolean = false
  apiError: any
  errorMessage: string = 'Item Code and Item Description and Warehouse number can not be empty'
  private ngUnsubscribe = new Subject<void>();
  constructor(private viewService: ViewServiceService, private inventoryService: InventoryServiceService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    if (null == this.id) {
      this.item = new Item('', '', 0, new Date(), new Date())
    }
    else {
      (async () => {
        try {
          this.item = await this.viewService.retrieveItemsById(this.id);
        } catch (error) {
          console.error('Error retrieving item by ID:', error);
        }
      })();
    }
  }


  async saveItem() {
    this.submitted = true;
    if (this.checkValidity()) {
      return;
    }
    if (this.id == null) {
      let navOptions: NavigationExtras = {
        state: {
          statusMessage: 'Item added successfully'
        }
      };
      try{
        // Step 1: Add the item
        await this.viewService.addItem(this.item);

        // Step 2: Navigate
        this.router.navigate(['items'], navOptions);

      }
      catch(addItemError){
        this.apiError = 'Duplicate Item Code is not allowed';
      }
    }
    else {
      let navOptions: NavigationExtras = {
        state: {
          statusMessage: 'Item updated successfully'
        }
      };
      try {
        // Step 1: Update the item
        await this.viewService.updateItem(this.id, this.item);
    
        try {
          // Step 2: Update the inventory
          await this.inventoryService.updateItemInventory(this.id, this.item);
    
          // Step 3: Navigate
          this.router.navigate(['items'], navOptions);
    
        } catch (inventoryError) {
          // Step 4: Inventory update failed
          this.apiError = 'Duplicate Item Code is not allowed';
        }
    
      } catch (itemError) {
        console.error('Error updating item:', itemError);
        this.apiError = 'Duplicate Item Code is not allowed';
        // Optional: handle main item update failure here
      }
      
    }
  }

  checkValidity() {
    if (this.submitted && (this.item.itemDescription == '' || this.item.itemCode == '' || this.item.warehouseNumber == 0)) {
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


