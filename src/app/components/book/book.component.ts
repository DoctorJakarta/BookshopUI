import { Component, OnInit } from '@angular/core';
import { ApiService, ITEM_TYPE } from '../../services/api.service';
import { CacheService, SESSION, LOCAL } from '../../services/cache.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Book, BOOK_STATUS } from '../../model/book';
import { Attribute, ATTR } from '../../model/attribute';
import { Subject } from '../../model/subject';
import { Tag } from '../../model/tag';
import { Listing } from '../../model/listing';
import { TagCheckbox } from '../../model/tag';
import { Reference } from '../../model/reference';
import { ReferenceComponent } from '../reference/reference.component';

// import { VdlDialogRef, VdlDialog, VdlDialogConfig } from 'vdl-angular';
import { VdlDialog } from '@vdlx/vdl-angular/dialog';
import { VdlDialogConfig } from '@vdlx/vdl-angular/dialog';
import { VdlDialogRef } from '@vdlx/vdl-angular/dialog';
import { BreakpointObserver } from '@angular/cdk/layout';

export enum PAGE_TYPE {
    LIST_BOOKS = 'List',
    NEW_BOOK = 'New',
    EDIT_BOOK = 'Edit',
    EXPORT_BOOKS = 'Export',
    SELECTED_BOOKS = 'Selected',
    SALE_BOOKS = 'Sale',
    LISTED_BOOKS = 'Listed'
}
export enum SEARCH_TYPE {
    YEAR    = 'year',
    AUTHOR  = 'author',
    TAG     = 'tag',
    LISTING = 'listing'
}

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})

export class BookComponent implements OnInit {

    BASE_URL = 'http://localhost/books/';

    public dialogRef: VdlDialogRef<ReferenceComponent>;

    SEARCH_TYPE: typeof SEARCH_TYPE = SEARCH_TYPE;        // This exposed the enum to the HTML

    PAGE_TYPE: typeof PAGE_TYPE = PAGE_TYPE;        // This exposed the enum to the HTML
    pageType = PAGE_TYPE.LIST_BOOKS;

    BOOK_STATUS: typeof BOOK_STATUS = BOOK_STATUS;    // This exposes the enum to the HTML
    bookStatusNames = Book.getStatusNames();
    // selectedStatus = BOOK_STATUS.PREP;
    selectedBookStatus = '0';
    selectedOnSale: boolean;

    // CONDITION: typeof CONDITION = CONDITION;    // This exposes the enum to the HTML
    // conditionList: string[] = new Array("New", "As New", "Fine", "Near Fine", "Very Good", "Good", "Fair", "Poor");
    // selectedCondition = "Very Good";

    attrBinding: Attribute;
    attrCondition: Attribute;
    attrSize: Attribute;
    attrRarity: Attribute;
    attrReprints: Attribute;

    subjects: Subject[] = [];

    books: any;
    book: any;
    tags: Tag[];
    tagCheckboxMap: Map<number, TagCheckbox>;

    listings: Listing[];
    listingCheckboxMap: Map<number, TagCheckbox>;

    reference: any;

    searchType: string;
    searchValue: string;
    searchTag: string;

    // selectedBookIds: number[] = [];
    // selectedBookIds: any;              // I don't know how to filter based on the equivalence of an Object
    // selectedBooks: any;
    statusUpdateValue: any;
    saleUpdateValue: any;

    selectedListing: any;

    constructor(private apiService: ApiService, private cacheService: CacheService,
                private dialog: VdlDialog,
                private route: ActivatedRoute, private router: Router) {

        this.getCacheLists();

        this.route.params.subscribe(params => {
            if (params['pageType']) this.pageType = params['pageType'];
            if ( params['bookStatus']) this.selectedBookStatus = params['bookStatus'];
            if ( params['onSale']){
               if (params['onSale'].toLowerCase() === 'true') this.selectedOnSale = true;
               else if (params['onSale'].toLowerCase() === 'false') this.selectedOnSale = false;
            } 

            switch (this.pageType) {
                case PAGE_TYPE.NEW_BOOK:
                    this.tagCheckboxMap = this.cacheService.getTagCheckboxMap(null);
                    this.listingCheckboxMap = this.cacheService.getListingCheckboxMap(null);
                    this.book = new Book();
                    break;
                case PAGE_TYPE.EDIT_BOOK:
                    this.book = this.getBook( params['bookId'] );
                    break;
                case PAGE_TYPE.LIST_BOOKS:
                case PAGE_TYPE.EXPORT_BOOKS:
                    if (params['searchType']) {
                        this.searchType = params['searchType'];
                        this.searchValue = params['searchValue'];
                        this.books = this.searchBy(this.searchType, this.searchValue);
                    }
                    else if (params['searchTag']) {
                        this.searchTag = params['searchTag'];
                        this.books = this.searchBy(this.searchType, this.searchValue);
                    }
                    else this.books = this.getAllBooks(false);
                    break;

                case PAGE_TYPE.SALE_BOOKS:
                    this.getSaleBooks();
                    break;
  
                case PAGE_TYPE.LISTED_BOOKS:
                    if (params['listing']) {
                        this.selectedListing = params['listing'];
                        this.getListedBooksBySite(this.selectedListing);
                    }
                    else this.getAllListedBooks();
                    break;

               case PAGE_TYPE.SELECTED_BOOKS:
                    // this.getAllBooks(true);
                    this.books =  this.cacheService.get(LOCAL.selectedBooks);
                    break;
           }
        });
    }

    listBooks() { this.router.navigate(['book', PAGE_TYPE.LIST_BOOKS]); }
    selectedBooks() { this.router.navigate(['book', PAGE_TYPE.SELECTED_BOOKS]); }
    newBook() { this.router.navigate(['book', PAGE_TYPE.NEW_BOOK]); }
    editBook(id: number) { this.router.navigate(['book', PAGE_TYPE.EDIT_BOOK, { bookId: id} ] ); }
    exportBooks() { this.router.navigate(['book', PAGE_TYPE.EXPORT_BOOKS]); }

    resetSelectedBooks(){                   // Updates change the book parameters, so they need to be updated from what is in the database
        const selectedIds = this.cacheService.get(LOCAL.selectedBookIds);
        const selectedBooks = [];
        for (const b of this.books){
            if ( selectedIds.includes(b.id)) selectedBooks.push(b);
        }
        this.cacheService.set(LOCAL.selectedBooks, selectedBooks);
        this.books =  this.cacheService.get(LOCAL.selectedBooks);
    }

    getCacheLists() {
        this.subjects = this.cacheService.getSubjects();
        this.tags = this.cacheService.getTags();
        this.listings = this.cacheService.getListings();
        this.attrBinding = this.cacheService.getAttribute(ATTR.BINDING);
        this.attrCondition = this.cacheService.getAttribute(ATTR.CONDITION);
        this.attrSize = this.cacheService.getAttribute(ATTR.SIZE);
        this.attrRarity = this.cacheService.getAttribute(ATTR.RARITY);
        this.attrReprints = this.cacheService.getAttribute(ATTR.REPRINTS);
    }

    searchBooks(searchType: string) {
        // alert('Searching for: ' + this.searchValue);
        //this.router.navigate(['book', PAGE_TYPE.LIST_BOOKS, { searchType: searchType, searchValue: this.searchValue} ] );
        this.router.navigate(['book', this.pageType, { searchType: searchType, searchValue: this.searchValue} ] );
    }
    returnToSearch() {
        console.log('Returning to search with type: ' + this.searchType  );
        console.log('Returning to search with value: ' + this.searchValue  );
        if ( this.searchType ) {
            this.searchBooks(this.searchType);
        } else {
            this.listBooks();
        }
    }
    searchBy(type: string, value: string) {
        this.apiService.searchItemsBy(ITEM_TYPE.BOOK, type, value).subscribe(
            success => {
                this.books = success;
            },
            error => this.apiService.handleError(error)
        );
    }

    getAllBooks(resetSelectedBooks: boolean) {
        this.apiService.readItems(ITEM_TYPE.BOOK).subscribe(
            success => {
                this.books = success;
                if (resetSelectedBooks) this.resetSelectedBooks();
            },
            error => this.apiService.handleError(error)
        );
    }

    getSaleBooks() {
        this.apiService.readSaleItems(ITEM_TYPE.BOOK).subscribe(
            success => {
                this.books = success;
            },
            error => this.apiService.handleError(error)
        );
    }
    
    getAllListedBooks() {
        this.apiService.readAllListedItems(ITEM_TYPE.BOOK).subscribe(
            success => {
                this.books = success;
            },
            error => this.apiService.handleError(error)
        );
    }
    
    getListedBooksBySite(id: number) {
        this.apiService.readListedItemsBySiteId(ITEM_TYPE.BOOK, id).subscribe(
            success => {
                this.books = success;
            },
            error => this.apiService.handleError(error)
        );
    }
    getBook(id: number) {
        this.apiService.readItem(ITEM_TYPE.BOOK, id).subscribe(
            success => {
                this.book = success;
                this.tagCheckboxMap = this.cacheService.getTagCheckboxMap(this.book.tags);
                this.listingCheckboxMap = this.cacheService.getListingCheckboxMap(this.book.listings);
             },
            error => this.apiService.handleError(error)
        );
    }

    upsertBook() {
        console.log('Upserting book with tagCheckboxMap: ' + this.tagCheckboxMap.size);

        this.book.tags = this.getSelectedTags();
        this.book.listings = this.getSelectedListings();

        console.log('Upserting book with tags: ' + this.book.tags.length);
        let apiServiceRequest;
        if ( this.book.id ) apiServiceRequest = this.apiService.updateItem(ITEM_TYPE.BOOK, this.book);
        else                apiServiceRequest = this.apiService.createItem(ITEM_TYPE.BOOK, this.book);


        apiServiceRequest.subscribe(
            success => {
                // this.listBooks();
                this.returnToSearch();
            },
            error => this.apiService.handleError(error)
        );
    }

    deleteBook(id: number) {
        if ( confirm('Are you sure you want to delete the book?')) {
            this.apiService.deleteItem(ITEM_TYPE.BOOK, id).subscribe(
                success => {
                    this.listBooks();
                },
                error => this.apiService.handleError(error)
            );
        }
    }

    public deleteReference(ref: Reference) {
        if (confirm('Are you sure you want to delete the reference: ' + ref.desc)) {
            this.apiService.deleteReference(ref).subscribe(
                success => {
                    this.listBooks();
                }
            );
        }
    }
    public openReferenceDialog(ref?: Reference) {
        console.log('Opening Reference Dialog: ' + ref);
       if ( ref == null ) this.reference = new Reference(this.book.id);
       else { this.reference = ref; }

        const dialogConfig = new VdlDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
           reference: this.reference
       };

        this.dialogRef = this.dialog.open(ReferenceComponent, dialogConfig);

        this.dialogRef.afterClosed().subscribe(
            (newReference: Reference) => {
                let service = this.apiService.createReference(newReference);
                if ( newReference.id ) service = this.apiService.updateReference(newReference);
                service.subscribe(
                    success => {
                        // this.listBooks();
                        this.returnToSearch();
                  },
                    error =>  this.apiService.handleError(error)
                );
                this.dialogRef = null;
            },
            (err) => {},
            () => {
            console.log('Done adding reference');
            }
        );
    }

    getSelectedTags() {
        const selectedTags: Tag[] = [];
        for ( const t of this.cacheService.getTags() ) {
            if (this.tagCheckboxMap.get(t.id).checked) { selectedTags.push(t); }
        }
        return selectedTags;
    }

    getSelectedListings() {
        const selectedListings: Listing[] = [];
        for ( const l of this.cacheService.getListings() ) {
            if (this.listingCheckboxMap.get(l.id).checked) { selectedListings.push(l); }
        }
        return selectedListings;
    }
    getSaleStatusKeys() {
        return Array.from(this.bookStatusNames.keys());
    }

    // getConditionKeys() {
    //     return Object.keys(this.CONDITION);
    // }

    launchImageUrl(url: string) {
        window.open(this.BASE_URL + url, '_blank');
    }

    filterBooks() {
        this.router.navigate(['book', PAGE_TYPE.LIST_BOOKS, { bookStatus: this.selectedBookStatus, onSale: this.selectedOnSale }]);
    }

    showListedBooks() {
        this.router.navigate(['book', PAGE_TYPE.LISTED_BOOKS, { listing: this.selectedListing}]);
    }

    getBookStatusKeys() {
        return Array.from(this.bookStatusNames.keys());
    }

    print(): void {
      let printContents;
      let popupWin;
      printContents = document.getElementById('print-section').innerHTML;
      popupWin = window.open('', '_blank');
      popupWin.document.open();
      popupWin.document.write(`
        <html>
          <head>
            <title>Print tab</title>
            <style>
            //........Customized style.......
            </style>
          </head>
          <!-- <body onload="window.print();window.close()"> -->
          <body>
             ${printContents}
          </body>
        </html>`
      );
      popupWin.document.close();
  }

    isSelected(book: Book) {
        const id = book.id;
        return this.cacheService.get(LOCAL.selectedBookIds).includes(id);
        // return this.cacheService.get(LOCAL.selectedBooks).includes(book);        // I don't know how to filter based on the equivalence of an Object
    }

    toggleSelect(book: Book) {
        const id = book.id;
        let bookIds = this.cacheService.get(LOCAL.selectedBookIds);
        let books = this.cacheService.get(LOCAL.selectedBooks);
        if (bookIds.includes(id)) {                                                 // I don't know how to filter based on the equivalence of an Object
            // alert('Already got bookId: ' + id);
            bookIds = bookIds.filter(aBookId => aBookId !== id);
            this.cacheService.set(LOCAL.selectedBookIds, bookIds);

            books = books.filter(aBook => aBook.id !== id);
            this.cacheService.set(LOCAL.selectedBooks, books);
        }
        else {
            // alert('Selecting bookId: ' + id);
            bookIds.push(id);
            this.cacheService.set(LOCAL.selectedBookIds, bookIds);

            books.push(book);
            this.cacheService.set(LOCAL.selectedBooks, books);
        }
    }

    bulkFieldUpdate(updateField: string) {
        const bookIds = this.cacheService.get(LOCAL.selectedBookIds);
        let updateFieldValue;
        switch (updateField) {
            case 'status':
                updateFieldValue = this.statusUpdateValue;
                break;
             case 'salePercent':
                updateFieldValue = this.saleUpdateValue;
                break;
            default:
                alert('Invalid selection');
                return;
        }

        if (confirm('Are you sure you want to update selected books with: ' + updateFieldValue)) {
            this.apiService.bulkUpdateItems(ITEM_TYPE.BOOK, updateField, updateFieldValue, bookIds).subscribe(
                success => {
                     this.getAllBooks(true);
                }
            );
        }
     }

    clearSelected() {
        if ( confirm('Clear ALL Checkboxes:') ){
            this.cacheService.set(LOCAL.selectedBookIds, []);
            this.cacheService.set(LOCAL.selectedBooks, []);
        }
    }

    ngOnInit() {

    }

}
