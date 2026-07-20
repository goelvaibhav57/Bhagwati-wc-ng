import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Item } from '../items/items.component';
import { API_URL } from "../config/api";

@Injectable({
  providedIn: 'root'
})
export class ViewServiceService {

  constructor(private http: HttpClient) { }

  retrieveAllItems(){
    return this.http.get<Item[]>(`${API_URL}/item/all`);
  }
  retrieveItemsById(id: number){
    return this.http.get<Item>(`${API_URL}/item/${id}`);
  }

  updateItem(id: number, item: Item){
    return this.http.put<Item>(`${API_URL}/update/item/${id}`,item);
  }

  addItem(item: Item){
    return this.http.post<Item>(`${API_URL}/create/item`,item);
  }
  deleteItem(id: number){
    return this.http.delete(`${API_URL}/delete/item/${id}`);
  }
}
