import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CacheService } from '../../services/cache.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Listing } from '../../model/listing';

export enum PAGE_TYPE {
    LIST = 'List',
    NEW = 'New',
    EDIT = 'Edit'
}

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})

export class ListingComponent implements OnInit {
    PAGE_TYPE: typeof PAGE_TYPE = PAGE_TYPE;        // This exposed the enum to the HTML
    pageType = PAGE_TYPE.LIST;

    listings: any;
    listing: any;

    constructor(private _apiService: ApiService, private _cacheService: CacheService,
                private route: ActivatedRoute, private router: Router) {

        this.route.params.subscribe(params => {
            if (params['pageType']) this.pageType = params['pageType'];

            switch (this.pageType) {
                case PAGE_TYPE.NEW: this.listing = new Listing(); break;
                case PAGE_TYPE.EDIT: this.listing = this.getListing( params['listingKey'] ); break;
                case PAGE_TYPE.LIST: this.listings = this.getListingList();
           }
        });


    }
    
    listListings() { this.router.navigate(['listing', PAGE_TYPE.LIST]); }
    newListing() { this.router.navigate(['listing', PAGE_TYPE.NEW]); }
    editListing(key: string) { this.router.navigate(['listing', PAGE_TYPE.EDIT, { listingKey: key} ] ); }

    getListingList() {
        this._apiService.readListings().subscribe(
            success => {
                this.listings = success;
                this._cacheService.setListings(success);            // Cache is refreshed whenever List is called, which happens after New/Update
            },
            error => this._apiService.handleError(error)
        );
    }

    getListing(key: string) {
        this._apiService.readListing(key).subscribe(
            success => {
                this.listing = success;
            },
            error => this._apiService.handleError(error)
        );    
    }

    upsertListing(isNew: boolean) {
        let apiServieRequest;
        if ( isNew ) apiServieRequest = this._apiService.createListing(this.listing);
        else         apiServieRequest = this._apiService.updateListing(this.listing);               

        apiServieRequest.subscribe(
            success => {
                this.listListings();
            },
            error => this._apiService.handleError(error)
        );
    }

    deleteListing(key: string) {
        if ( confirm('Are you sure you want to delete the listing, instead of inactivating it?')) {
            this._apiService.deleteListing(key).subscribe(
                success => {
                    this.listListings();
                },
                error => this._apiService.handleError(error)
            );
        }
    }

  ngOnInit() {
  }

}

