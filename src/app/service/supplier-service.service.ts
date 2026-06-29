import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Supplier } from '../suppliers/suppliers.component';
import { API_URL } from "../config/api";

@Injectable({
  providedIn: 'root'
})
export class SupplierServiceService {

  constructor(private http: HttpClient) { }

  getAllSuppliers(){
    return this.http.get<Supplier []>(`${API_URL}/suppliers/all`);
  }

  getSuppliersById(id:string){
    return this.http.get<Supplier>(`${API_URL}/supplier/${id}`);
  }


  deleteSupplier(id:string){
    return this.http.delete(`${API_URL}/delete/supplier/id/${id}`);
  }
  addSupplier(supplier: Supplier){
    return this.http.post(`${API_URL}/create/supplier`,supplier);
  }
  updateSupplier(id:string, supplier: Supplier){
    return this.http.put(`${API_URL}/update/supplier/${id}`,supplier);
  }
}
