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

  id: number
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
      this.item = new Item(0, '', '', 0, new Date(), new Date())
    }
    else {
      this.viewService.retrieveItemsById(this.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(

        data => {
          this.item = data?.[0];
        }
      )
    }
  }


  saveItem() {
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
      this.viewService.addItem(this.item).pipe(takeUntil(this.ngUnsubscribe)).subscribe(
        response => {
          this.router.navigate(['items'], navOptions);
        },
        error => {
          this.apiError = 'Duplicate Item Code is not allowed';
        }
      )
    }
    else {
      let navOptions: NavigationExtras = {
        state: {
          statusMessage: 'Item updated successfully'
        }
      };
      this.viewService.updateItem(this.id, this.item).pipe(takeUntil(this.ngUnsubscribe)).subscribe(
        response => {
          this.inventoryService.updateItemInventory(this.id, this.item).subscribe(
            responseNew => {
              this.router.navigate(['items'], navOptions);
            },
            error => {
              this.apiError = 'Duplicate Item Code is not allowed';
            }
          )
        }
      )
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


