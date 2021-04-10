import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { BookComponent } from './components/book/book.component';
import { ExportComponent } from './components/export/export.component';
import { AttributeComponent } from './components/attribute/attribute.component';
import { SubjectComponent } from './components/subject/subject.component';
import { TagComponent } from './components/tag/tag.component';


export const ROUTES: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'book/:pageType', component: BookComponent },
  { path: 'export', component: ExportComponent },
  { path: 'attribute/:pageType', component: AttributeComponent },
  { path: 'subject/:pageType', component: SubjectComponent },
  { path: 'tag/:pageType', component: TagComponent },
  { path: '**', component: LoginComponent }
];
