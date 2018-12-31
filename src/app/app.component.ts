import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  Renderer,
  ViewChild
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import {
  VdlAutocompleteTrigger,
  VdlIconRegistry,
  VdlOption,
  GlobalNotification,
  GlobalHelp,
  Category
} from 'vdl-angular';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'vdl-angular-cli-starter';
  public selectedCategory: Category | null;

  public inputTypeahead: string;
  public inputValue: any;

  public categories: Category[] = [
    { displayName: 'Home', route: 'home', icon: 'fa-home' },
    { displayName: 'Inventory', route: 'inventory', icon: 'fa-columns' }
  ];

  constructor(
    vdlIconRegistry: VdlIconRegistry,
    private _sanitizer: DomSanitizer,
    private _renderer: Renderer,
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
    let trimmedRoute: string = route.startsWith('/') ? route.substr(1) : route;
    let trimmedCvRoute: string = '';

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
