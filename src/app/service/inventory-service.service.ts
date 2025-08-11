import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Inventory } from '../inventory/inventory.component';
import { Item } from '../items/items.component';
import { Vendor } from '../vendors/vendors.component';
import { Supplier } from '../suppliers/suppliers.component';
import { API_BASE_URL } from '../shared/constants'; 

@Injectable({
  providedIn: 'root'
})
export class InventoryServiceService {

  constructor(private http: HttpClient) { }

  async retrieveInventoryById(id: string): Promise<Inventory[]> {
    const response = await fetch(`${API_BASE_URL}/inventory/itemCode/${id}`);
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    return response.json();
  }

  async addInventory(id: string, inventory: Inventory): Promise<Inventory> {
    const response = await fetch(`${API_BASE_URL}/inventory/add/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(inventory)
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    return response.json();
  }

  async debitInventory(id: string, inventory: Inventory): Promise<Inventory> {
    const response = await fetch(`${API_BASE_URL}/inventory/debit/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(inventory)
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    return response.json();
  }

  async updateItemInventory(id: string, item: Item): Promise<Item> {
    const response = await fetch(`${API_BASE_URL}/inventory/update/item/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    return response.json();
  }

  async updateVendorInventory(id: string, vendor: Vendor): Promise<Inventory> {
    const response = await fetch(`${API_BASE_URL}/inventory/update/vendor/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(vendor)
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    return response.json();
  }

  async updateSupplierInventory(id: string, supplier: Supplier): Promise<Inventory> {
    const response = await fetch(`${API_BASE_URL}/inventory/update/supplier/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(supplier)
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    return response.json();
  }

  async deleteInventory(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/inventory/delete/${id}`, {
      method: 'DELETE'
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }
}
