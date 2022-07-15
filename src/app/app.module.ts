import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScullyLibModule } from '@scullyio/ng-lib';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { SharedModule } from './shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainToolbarComponent } from './main-toolbar/main-toolbar.component';
import { CurrentYearPipe } from './pipes/current-year.pipe';
import { HomeComponent } from './home/home.component';
import { LabProfileComponent } from './lab-profile/lab-profile.component';
import { TestProfileComponent } from './test-profile/test-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainToolbarComponent,
    HomeComponent,
    LabProfileComponent,
    TestProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ScullyLibModule,
    BrowserAnimationsModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
