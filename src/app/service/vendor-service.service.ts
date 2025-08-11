import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Vendor } from '../vendors/vendors.component';
import { API_BASE_URL } from '../shared/constants'; 

@Injectable({
  providedIn: 'root'
})
export class VendorServiceService {

  constructor(private http: HttpClient) { }

  async getAllVendors(): Promise<Vendor[]> {
    const response = await fetch(`${API_BASE_URL}/vendors/all`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async getVendorsById(id: string): Promise<Vendor> {
    const response = await fetch(`${API_BASE_URL}/vendor/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async deleteVendor(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/delete/vendor/id/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  async addVendor(vendor: Vendor): Promise<Vendor> {
    const response = await fetch(`${API_BASE_URL}/create/vendor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vendor)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async updateVendor(id: string, vendor: Vendor): Promise<Vendor> {
    const response = await fetch(`${API_BASE_URL}/update/vendor/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vendor)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
}
