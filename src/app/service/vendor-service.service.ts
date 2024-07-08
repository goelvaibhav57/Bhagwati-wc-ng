import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Vendor } from '../vendors/vendors.component';

@Injectable({
  providedIn: 'root'
})
export class VendorServiceService {

  constructor(private http: HttpClient) { }

  getAllVendors(){
    return this.http.get<Vendor []>('http://localhost:8080/vendors/all');
  }

  getVendorsById(id:string){
    return this.http.get<Vendor>(`http://localhost:8080/vendor/${id}`);
  }


  deleteVendor(id:string){
    return this.http.delete(`http://localhost:8080/delete/vendor/id/${id}`);
  }
  addVendor(vendor:Vendor){
    return this.http.post(`http://localhost:8080/create/vendor`,vendor);
  }
  updateVendor(id:string, vendor: Vendor){
    return this.http.put(`http://localhost:8080/update/vendor/${id}`,vendor);
  }
}
