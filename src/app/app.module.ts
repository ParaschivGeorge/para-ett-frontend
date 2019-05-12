import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from './material/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { TokenInterceptorService } from './auth/token-interceptor.service';
import { AuthGuard } from './auth/auth.guard';
import { RegisterCompanyComponent } from './register-company/register-company.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    RegisterCompanyComponent
  ],
  entryComponents: [
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    MaterialModule,
    ReactiveFormsModule,
    DragDropModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
