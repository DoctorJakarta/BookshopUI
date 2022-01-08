import { Component, ElementRef,  NgZone, OnInit, Renderer2,  ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
// import { VdlAutocompleteTrigger, VdlIconRegistry, VdlOption, GlobalNotification, GlobalHelp,  Category } from 'vdl-angular';
import { VdlIconRegistry } from '@vdlx/vdl-angular/icon';
import { Category } from '@vdlx/vdl-angular/sidenav';
import { NgModel } from '@angular/forms';
import { ApiService } from './services/api.service';
import { CacheService } from './services/cache.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'vdl-angular-cli-starter';
  public selectedCategory: Category | null;

  public inputTypeahead: string;
  public inputValue: any;


  public categories: Category[] = [
    { displayName: 'Home', route: 'home', icon: 'fa-home' },
    { displayName: 'Books', icon: 'fa-book', expanded: true,
        subCategories: [
            { displayName: 'Inventory', route: 'book/List', icon: 'fa-columns' },
            { displayName: 'Selected', route: 'book/Selected', icon: 'fa-check-square' },
            { displayName: 'On Sale', route: 'book/Sale', icon: 'fa-dollar' }
        ]
    },
    { displayName: 'Export', route: 'export', icon: 'fa-download' },
    { displayName: 'Configuration', icon: 'fa-cog', expanded: true,
        subCategories: [
            { displayName: 'Attributes', route: 'attribute/List', icon: 'fa-list-alt' },
            { displayName: 'Subjects', route: 'subject/List', icon: 'fa-sitemap' },
            { displayName: 'Tags', route: 'tag/List', icon: 'fa-tags' }
        ]
    }
   ];

  constructor(private _apiService: ApiService, private _cacheService: CacheService,
                vdlIconRegistry: VdlIconRegistry,
                private _sanitizer: DomSanitizer,
                private _renderer: Renderer2,
                private _router: Router,
                private _ngZone: NgZone,
                private _elementRef: ElementRef
    ) {
        vdlIconRegistry.registerFontClassAlias('fontawesome', 'fa');
        vdlIconRegistry.addSvgIcon(
        'ux-veritas',
        _sanitizer.bypassSecurityTrustResourceUrl('/assets/ux-veritas.svg')
        );
  }


  public onCategorySelect(category: Category) {
    this._router.navigate([category.route]);
    const routedContent = this._elementRef.nativeElement.querySelector(
      '.routed-content'
    );

    if (routedContent) {
      routedContent.scrollTop = 0;
    }
  }

  private findCategoryByRoute(
    categories: Category[],
    route: string
  ): Category | null {
    const trimmedRoute: string = route.startsWith('/') ? route.substr(1) : route;
    let trimmedCvRoute = '';

    function reducer(pv: Category, cv: Category): Category {
      if (cv.subCategories && cv.subCategories.length > 0) {
        return cv.subCategories.reduce(reducer, pv);
      }

      trimmedCvRoute = cv.route.startsWith('/') ? cv.route.substr(1) : cv.route;

      return trimmedCvRoute === trimmedRoute ? cv : pv;
    }

    return categories.reduce(reducer);
  }



    public ngOnInit() {

        // this.getTags();
        // this.getAttributes();
        // this.getSubjects();


        this.selectedCategory = this.categories[0];
        this._router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
            this.selectedCategory = this.findCategoryByRoute(
            this.categories,
            event.urlAfterRedirects
            );
        }
        });
  }
}
