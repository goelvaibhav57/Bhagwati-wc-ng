import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ErrorComponent } from './error/error.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { LogoutComponent } from './logout/logout.component';
import { ItemsComponent } from './items/items.component';
import { ItemComponent } from './item/item.component';
import { VendorsComponent } from './vendors/vendors.component';
import { VendorComponent } from './vendor/vendor.component';
import { MenuComponent } from './menu/menu.component';
import { FooterComponent } from './footer/footer.component';
import { InventoryComponent } from './inventory/inventory.component';
import { AddInventoryComponent } from './add-inventory/add-inventory.component';
import { DebitInventoryComponent } from './debit-inventory/debit-inventory.component';
import { SupplierComponent } from './supplier/supplier.component';
import { SuppliersComponent } from './suppliers/suppliers.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ErrorComponent,
    WelcomeComponent,
    LogoutComponent,
    ItemsComponent,
    ItemComponent,
    VendorsComponent,
    VendorComponent,
    MenuComponent,
    FooterComponent,
    InventoryComponent,
    AddInventoryComponent,
    DebitInventoryComponent,
    SupplierComponent,
    SuppliersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
