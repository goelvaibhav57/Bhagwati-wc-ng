import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Vendor } from '../vendors/vendors.component';
import { API_URL } from "../config/api";

@Injectable({
  providedIn: 'root'
})
export class VendorServiceService {

  constructor(private http: HttpClient) { }

  getAllVendors(){
    return this.http.get<Vendor []>(`${API_URL}/vendors/all`);
  }

  getVendorsById(id:string){
    return this.http.get<Vendor>(`${API_URL}/vendor/${id}`);
  }


  deleteVendor(id:string){
    return this.http.delete(`${API_URL}/delete/vendor/id/${id}`);
  }
  addVendor(vendor:Vendor){
    return this.http.post(`${API_URL}/create/vendor`,vendor);
  }
  updateVendor(id:string, vendor: Vendor){
    return this.http.put(`${API_URL}/update/vendor/${id}`,vendor);
  }
}
