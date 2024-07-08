import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Item } from '../items/items.component';

@Injectable({
  providedIn: 'root'
})
export class ViewServiceService {

  constructor(private http: HttpClient) { }

  retrieveAllItems(){
    return this.http.get<Item[]>('http://localhost:8080/item/all');
  }
  retrieveItemsById(id){
    return this.http.get<Item>(`http://localhost:8080/item/${id}`);
  }

  updateItem(id: string, item: Item){
    return this.http.put<Item>(`http://localhost:8080/update/item/${id}`,item);
  }

  addItem(item: Item){
    return this.http.post<Item>(`http://localhost:8080/create/item`,item);
  }
  deleteItem(id){
    return this.http.delete(`http://localhost:8080/delete/item/${id}`);
  }
}
