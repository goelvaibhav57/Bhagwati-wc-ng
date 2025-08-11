import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Supplier } from '../suppliers/suppliers.component';
import { API_BASE_URL } from '../shared/constants'; 

@Injectable({
  providedIn: 'root'
})
export class SupplierServiceService {

  constructor(private http: HttpClient) { }

  async getAllSuppliers(): Promise<Supplier[]> {
    const res = await fetch(`${API_BASE_URL}/suppliers/all`);
    if (!res.ok) throw new Error(`Error fetching suppliers: ${res.statusText}`);
    return res.json();
  }

  async getSuppliersById(id: string): Promise<Supplier> {
    const res = await fetch(`${API_BASE_URL}/supplier/${id}`);
    if (!res.ok) throw new Error(`Error fetching supplier: ${res.statusText}`);
    return res.json();
  }

  async deleteSupplier(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/delete/supplier/id/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error(`Error deleting supplier: ${res.statusText}`);
  }

  async addSupplier(supplier: Supplier): Promise<Supplier> {
    const res = await fetch(`${API_BASE_URL}/create/supplier`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(supplier)
    });
    if (!res.ok) throw new Error(`Error adding supplier: ${res.statusText}`);
    return res.json();
  }

  async updateSupplier(id: string, supplier: Supplier): Promise<Supplier> {
    const res = await fetch(`${API_BASE_URL}/update/supplier/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(supplier)
    });
    if (!res.ok) throw new Error(`Error updating supplier: ${res.statusText}`);
    return res.json();
  }
}
