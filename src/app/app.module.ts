import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';         
import { HttpClientModule } from '@angular/common/http';  

import { AppComponent } from './app.component';
import { AppRoutesModule } from './app.routes';           

import { HomeComponent } from './home/home.component';
import { DronesComponent } from './drones/drones.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CategoryComponent } from './category/category.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DronesComponent,
    LoginComponent,
    RegisterComponent,
    CategoryComponent   
  ],
  imports: [
    BrowserModule,      
    HttpClientModule,
    AppRoutesModule    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
