import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ItemsComponent } from './items/items.component';
import { LogoutComponent } from './logout/logout.component';
import { ErrorComponent } from './error/error.component';
import { RouteGuardService } from './service/route-guard.service';
import { VendorComponent } from './vendor/vendor.component';
import { VendorsComponent } from './vendors/vendors.component';
import { ItemComponent } from './item/item.component';
import { InventoryComponent } from './inventory/inventory.component';
import { AddInventoryComponent } from './add-inventory/add-inventory.component';
import { DebitInventoryComponent } from './debit-inventory/debit-inventory.component';
import { SupplierComponent } from './supplier/supplier.component';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { AddBulkInventoryComponent } from './bulk-update-inventory/bulk-update-inventory.component';
import { DebitBulkInventoryComponent } from './debit-bulk-inventory/debit-bulk-inventory.component';


const routes: Routes = [
  { path:'' ,component: LoginComponent },
  { path:'login' ,component: LoginComponent },
  {path:'welcome/:name',component: WelcomeComponent, canActivate:[RouteGuardService]},
  {path:'items',component: ItemsComponent, canActivate:[RouteGuardService]},
  {path:'add-bulk-inventory',component: AddBulkInventoryComponent, canActivate:[RouteGuardService]},
  {path:'debit-bulk-inventory',component: DebitBulkInventoryComponent, canActivate:[RouteGuardService]},
  {path:'item/update/:id',component: ItemComponent, canActivate:[RouteGuardService]},
  {path:'item/add',component: ItemComponent, canActivate:[RouteGuardService]},
  {path:'inventory/:id',component: InventoryComponent, canActivate:[RouteGuardService]},
  {path:'add/inventory/:id',component: AddInventoryComponent, canActivate:[RouteGuardService]},
  {path:'debit/inventory/:id',component: DebitInventoryComponent, canActivate:[RouteGuardService]},
  {path:'vendors',component: VendorsComponent, canActivate:[RouteGuardService]},
  {path:'vendor/add',component: VendorComponent, canActivate:[RouteGuardService]},
  {path:'vendors/:id',component: VendorComponent, canActivate:[RouteGuardService]},
  {path:'suppliers',component: SuppliersComponent, canActivate:[RouteGuardService]},
  {path:'supplier/add',component: SupplierComponent, canActivate:[RouteGuardService]},
  {path:'suppliers/:id',component: SupplierComponent, canActivate:[RouteGuardService]},
  {path:'logout',component: LogoutComponent, canActivate:[RouteGuardService]},
  {path:'**',component: ErrorComponent, canActivate:[RouteGuardService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
