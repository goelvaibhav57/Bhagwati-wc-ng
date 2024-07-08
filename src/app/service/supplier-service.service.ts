import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Supplier } from '../suppliers/suppliers.component';

@Injectable({
  providedIn: 'root'
})
export class SupplierServiceService {

  constructor(private http: HttpClient) { }

  getAllSuppliers(){
    return this.http.get<Supplier []>('http://localhost:8080/suppliers/all');
  }

  getSuppliersById(id:string){
    return this.http.get<Supplier>(`http://localhost:8080/supplier/${id}`);
  }


  deleteSupplier(id:string){
    return this.http.delete(`http://localhost:8080/delete/supplier/id/${id}`);
  }
  addSupplier(supplier: Supplier){
    return this.http.post(`http://localhost:8080/create/supplier`,supplier);
  }
  updateSupplier(id:string, supplier: Supplier){
    return this.http.put(`http://localhost:8080/update/supplier/${id}`,supplier);
  }
}
