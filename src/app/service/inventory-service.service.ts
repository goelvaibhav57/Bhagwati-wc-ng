import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Inventory } from '../inventory/inventory.component';
import { Item } from '../items/items.component';
import { Vendor } from '../vendors/vendors.component';
import { Supplier } from '../suppliers/suppliers.component';
import { API_URL } from "../config/api";

@Injectable({
  providedIn: 'root'
})
export class InventoryServiceService {

  constructor(private http: HttpClient) { }

  retrieveInventoryById(id:string){
    return this.http.get<Inventory[]>(`${API_URL}/inventory/itemCode/${id}`);
  }

  addInventory(id:string, inventory: Inventory){
    return this.http.put<Inventory>(`${API_URL}/inventory/add/${id}`, inventory);
  }

  debitInventory(id:string, inventory: Inventory){
    return this.http.put<Inventory>(`${API_URL}/inventory/debit/${id}`, inventory);
  }

  updateItemInventory(id:string, item: Item){
    return this.http.put<Inventory>(`${API_URL}/inventory/update/item/${id}`, item);
  }

  updateVendorInventory(id:string, vendor: Vendor){
    return this.http.put<Inventory>(`${API_URL}/inventory/update/vendor/${id}`, vendor);
  }

  updateSupplierInventory(id:string, supplier: Supplier){
    return this.http.put<Inventory>(`${API_URL}/inventory/update/supplier/${id}`, supplier);
  }

  deleteInventory(id:string){
    return this.http.delete<Inventory>(`${API_URL}/inventory/delete/${id}`);
  }
}
