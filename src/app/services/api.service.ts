import { Book } from '../model/book';
import { Reference } from '../model/reference';
import { Attribute } from '../model/attribute';
import { Detail } from '../model/detail';
import { Subject } from '../model/subject';
import { Tag } from '../model/tag';
import { User } from '../model/user';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const _service = 'http://localhost:8080/BookshopAPI/api/v1.0/';
///const _service = 'http://3.133.35.100/BookshopAPI/api/v1.0/';

//const pubHeader = new HttpHeaders().set('Content-Type', 'application/json' );


@Injectable()
export class ApiService {

  JWT_ACCESS_HEADER = 'Jwt-Access';
  jwtAccess;

  constructor(private http: HttpClient) { }

  public getApiServiceUrl() {
    return _service;
  }

  getJwtAccess() {
    return this.jwtAccess;
  }

  setJwtAccess(jwt: string) {
    this.jwtAccess = jwt;
    console.log('Set jwtAccess: ' + jwt);
  }

  getAuthzHeaders() {

    return new HttpHeaders()
      // .set('Content-Type', 'POST')  // This was necessary for OPTIONS request with HttpClient for CORS to avoid 403
      .set('Authorization', 'Bearer ' + this.getJwtAccess())
      .set('Content-Type', 'application/json');

  }

  handleError(error: any) {
    console.log('Got API error status: ' + error.status);
    // Do something like this.router.navigate(['/error']);
  }

  //
  // Login Services
  //
  loginUser(user: User) {
    return this.http.post<Array<string>>(_service + 'auth/login', JSON.stringify(user), {headers: this.getAuthzHeaders()} );
  }


  //
  // Book Services
  //

  readBooks() {
    return this.http.get<Array<string>>(_service + 'book', {headers: this.getAuthzHeaders()} );
  }

  readBook(id: number) {
    return this.http.get<Array<string>>(_service + 'book/' + id, {headers: this.getAuthzHeaders()} );
  }

  createBook(book: Book) {
    return this.http.post<Array<string>>(_service + 'book', JSON.stringify(book), {headers: this.getAuthzHeaders()} );
  }

  updateBook(book: Book) {
    return this.http.put<Array<string>>(_service + 'book', JSON.stringify(book), {headers: this.getAuthzHeaders()} );
  }

  bulkUpdateBooks(updateField: string, updateValue: string, bookIds: []) {
    return this.http.put<Array<string>>(_service + 'book/' + updateField + '/' + updateValue, bookIds, {headers: this.getAuthzHeaders()} );
  }

  deleteBook(id: number) {
    return this.http.delete<Array<string>>(_service + 'book/' + id, {headers: this.getAuthzHeaders()} );
  }

  searchBooksBy(type: string, value: string) {
    return this.http.get<Array<string>>(_service + 'book/' + type + '/' + value, {headers: this.getAuthzHeaders()} );
  }

  // searchBooksByYear(year: number) {
  //   return this.http.get<Array<string>>(_service + 'book/year/' + year, {headers: this.getAuthzHeaders()} );
  // }

  // searchBooksByStatus(status: string) {
  //   return this.http.get<Array<string>>(_service + 'book/status/' + status, {headers: this.getAuthzHeaders()} );
  // }

  //
  // Referemce Services
  //

  readReferences() {
    return this.http.get<Array<string>>(_service + 'reference', {headers: this.getAuthzHeaders()} );
  }

  readReference(id: number) {
    return this.http.get<Array<string>>(_service + 'reference/' + id, {headers: this.getAuthzHeaders()} );
  }

  createReference(reference: Reference) {
    return this.http.post<Array<string>>(_service + 'reference', JSON.stringify(reference), {headers: this.getAuthzHeaders()} );
  }

  updateReference(reference: Reference) {
    return this.http.put<Array<string>>(_service + 'reference', JSON.stringify(reference), {headers: this.getAuthzHeaders()} );
  }

  deleteReference(reference: Reference) {
    return this.http.delete<Array<string>>(_service + 'reference/' + reference.id, {headers: this.getAuthzHeaders()} );
  }

  //
  // Tag Services
  //

  readTags() {
    return this.http.get<Array<string>>(_service + 'tag', {headers: this.getAuthzHeaders()} );
  }

  readTag(key: string) {
    return this.http.get<Array<string>>(_service + 'tag/' + key, {headers: this.getAuthzHeaders()} );
  }

  createTag(tag: Tag) {
    return this.http.post<Array<string>>(_service + 'tag', JSON.stringify(tag), {headers: this.getAuthzHeaders()} );
  }

  updateTag(tag: Tag) {
    return this.http.put<Array<string>>(_service + 'tag', JSON.stringify(tag), {headers: this.getAuthzHeaders()} );
  }

  deleteTag(key: string) {
    return this.http.delete<Array<string>>(_service + 'tag/' + key, {headers: this.getAuthzHeaders()} );
  }

  //
  // Subject Services
  //

  readSubjects() {
    return this.http.get<Array<string>>(_service + 'subject', {headers: this.getAuthzHeaders()} );
  }

  readSubject(id: number) {
    return this.http.get<Array<string>>(_service + 'subject/' + id, {headers: this.getAuthzHeaders()} );
  }

  createSubject(subject: Subject) {
    return this.http.post<Array<string>>(_service + 'subject', JSON.stringify(subject), {headers: this.getAuthzHeaders()} );
  }

  updateSubject(subject: Subject) {
    return this.http.put<Array<string>>(_service + 'subject', JSON.stringify(subject), {headers: this.getAuthzHeaders()} );
  }

  deleteSubject(id: number) {
    return this.http.delete<Array<string>>(_service + 'subject/' + id, {headers: this.getAuthzHeaders()} );
  }

  //
  // Attribute Services
  //

  readAttributes() {
    return this.http.get<Array<string>>(_service + 'attribute', {headers: this.getAuthzHeaders()} );
  }


  readAttribute(id: number) {
    return this.http.get<Array<string>>(_service + 'attribute/' + id, {headers: this.getAuthzHeaders()} );
  }

  //
  // Detail Services
  //

  readDetails() {
    return this.http.get<Array<string>>(_service + 'detail', {headers: this.getAuthzHeaders()} );
  }

  readDetail(id: number) {
    return this.http.get<Array<string>>(_service + 'detail/' + id, {headers: this.getAuthzHeaders()} );
  }

  createDetail(detail: Detail) {
    return this.http.post<Array<string>>(_service + 'detail', JSON.stringify(detail), {headers: this.getAuthzHeaders()} );
  }

  updateDetail(detail: Detail) {
    return this.http.put<Array<string>>(_service + 'detail', JSON.stringify(detail), {headers: this.getAuthzHeaders()} );
  }

  deleteDetail(id: number) {
    return this.http.delete<Array<string>>(_service + 'detail/' + id, {headers: this.getAuthzHeaders()} );
  }
}
