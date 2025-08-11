import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Item } from '../items/items.component';
import { API_BASE_URL } from '../shared/constants'; 

@Injectable({
  providedIn: 'root'
})
export class ViewServiceService {

  constructor(private http: HttpClient) { }

  async fetchAllItems(): Promise<Item[]> {
    const response = await fetch(`${API_BASE_URL}/item/all`);
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    return response.json();
  }

  async retrieveItemsById(id: string): Promise<Item> {
    const response = await fetch(`${API_BASE_URL}/item/${id}`);
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    return response.json();
  }

  async updateItem(id: string, item: Item): Promise<Item> {
    const response = await fetch(`${API_BASE_URL}/update/item/${id}`, {
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

  async addItem(item: Item): Promise<Item> {
    const response = await fetch(`${API_BASE_URL}/create/item`, {
      method: 'POST',
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

  async deleteItem(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/delete/item/${id}`, {
      method: 'DELETE'
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }
}
