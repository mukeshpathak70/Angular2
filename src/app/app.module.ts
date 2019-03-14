import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule  } from '@angular/common/http';
import {RouterModule, Routes} from '@angular/router'
import {ConfigService} from './config/config.service'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Costom routes 
import {Home} from './home/home.component';
import {About} from './about/about.component'

const appRoutes: Routes = [
  {path:"home", component:Home},
  {path:"about", component:About}

]
@NgModule({
  declarations: [
    AppComponent,
    Home,
    About
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [ConfigService],
  bootstrap: [AppComponent]
})
export class AppModule { }
