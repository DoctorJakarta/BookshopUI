import { HttpClientModule } from '@angular/common/http';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { VdlModule } from './vdl-module';
import { ROUTES } from './app.routes';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import './styles/global.scss';
import { HomeComponent } from './components/home/home.component';

import { ApiService } from './services/api.service';
import { BookComponent } from './components/book/book.component';
import { PlateComponent } from './components/plate/plate.component';
import { ReferenceComponent } from './components/reference/reference.component';
import { AttributeComponent } from './components/attribute/attribute.component';
import { TagComponent } from './components/tag/tag.component';
import { SubjectComponent } from './components/subject/subject.component';
import { DetailComponent } from './components/detail/detail.component';
import { ExportComponent } from './components/export/export.component';
import { LoginComponent } from './components/login/login.component';
import { OnSaleFilterPipe } from './pipes/on-sale-filter.pipe';
import { BookStatusFilterPipe } from './pipes/book-status-filter.pipe';
import { ListingComponent } from './components/listing/listing.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BookComponent,
    PlateComponent,
    ReferenceComponent,
    AttributeComponent,
    TagComponent,
    SubjectComponent,
    DetailComponent,
    ExportComponent,
    LoginComponent,
    OnSaleFilterPipe,
    BookStatusFilterPipe,
    OnSaleFilterPipe,
    ListingComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    VdlModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(ROUTES, {
      useHash: true
    })
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [ReferenceComponent],
  providers: [ ApiService ],
  bootstrap: [AppComponent]
})
export class AppModule {}
