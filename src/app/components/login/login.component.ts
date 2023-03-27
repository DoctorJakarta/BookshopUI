import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CacheService } from '../../services/cache.service';
import { User } from '../../model/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  user: any;

  constructor(private apiService: ApiService, private cacheService: CacheService) {
    this.user = new User();


  }

  isLoggedIn() {
    return ( this.apiService.getJwtAccess() != null );
  }

  login() {

    this.apiService.loginUser(this.user).subscribe(
      success => {
        this.user = success;
        this.apiService.setJwtAccess(this.user.jwtAccess);

        this.getTags();
        this.getAttributes();
        this.getSubjects();
        this.getPlateSources();
        this.getPlateSizes();
        this.getListings();
        
      },
      error => this.apiService.handleError(error)
    );
  }
    getTags() {
        this.apiService.readTags().subscribe(
            success => { this.cacheService.setTags(success); },
            error => this.apiService.handleError(error)
        );
    }
    getAttributes() {
        this.apiService.readAttributes().subscribe(
            success => {
                 // Cache is refreshed whenever List is called, which happens after New/Update
                this.cacheService.setAttributes(success);
            },
            error => this.apiService.handleError(error)
        );
    }
    getListings() {
        this.apiService.readListings().subscribe(
            success => { this.cacheService.setListings(success); },
            error => this.apiService.handleError(error)
        );
    }
/*     getAttributes() {
        this.apiService.readAttributes().subscribe(
            success => {
                const attributeNames = success;
                for ( const name of attributeNames ) {
                    console.log("Got attribute Name: " + name);
                    this.getAttribute(999);
                }
            },
            error => this.apiService.handleError(error)
        );
    } */

    // getAttribute(id: number) {
    //     this.apiService.readAttribute(id).subscribe(
    //         success => {  this.cacheService.addAttribute(success); },
    //         error => this.apiService.handleError(error)
    //     );    
    // }

    getSubjects() {
        this.apiService.readSubjects().subscribe(
            success => {
               this.cacheService.setSubjects(success);            // Cache is refreshed whenever List is called, which happens after New/Update
            },
            error => this.apiService.handleError(error)
        );
    }
    getPlateSources() {
        this.apiService.readPlateSources().subscribe(
            success => {
               this.cacheService.setSources(success);            // Cache is refreshed whenever List is called, which happens after New/Update
            },
            error => this.apiService.handleError(error)
        );
    }
    getPlateSizes() {
        this.apiService.readPlateSizes().subscribe(
            success => {
               this.cacheService.setSizes(success);            // Cache is refreshed whenever List is called, which happens after New/Update
            },
            error => this.apiService.handleError(error)
        );
    }
}
