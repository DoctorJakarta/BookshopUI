import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { A11yModule } from '@angular/cdk/a11y';

import { VdlAutocompleteModule } from '@vdlx/vdl-angular/autocomplete';
import { VdlAvatarModule } from '@vdlx/vdl-angular/avatar';
import { VdlBadgeModule } from '@vdlx/vdl-angular/badge';
import { VdlBreadcrumbsModule } from '@vdlx/vdl-angular/breadcrumbs';
import { VdlButtonModule } from '@vdlx/vdl-angular/button';
import { VdlButtonToggleModule } from '@vdlx/vdl-angular/button-toggle';
import { VdlCardModule } from '@vdlx/vdl-angular/card';
import { VdlCheckboxModule } from '@vdlx/vdl-angular/checkbox';
import { VdlChipsModule } from '@vdlx/vdl-angular/chips';
import {
  VdlMomentDateModule,
  VdlNativeDateModule
} from '@vdlx/vdl-angular/core';
import { VdlDatepickerModule } from '@vdlx/vdl-angular/datepicker';
import { VdlDetailsPanelModule } from '@vdlx/vdl-angular/details-panel';
import { VdlDialogModule } from '@vdlx/vdl-angular/dialog';
import { VdlDividerModule } from '@vdlx/vdl-angular/divider';
import { VdlDrawerModule } from '@vdlx/vdl-angular/drawer';
import { VdlExpansionModule } from '@vdlx/vdl-angular/expansion';
import { VdlFormFieldModule } from '@vdlx/vdl-angular/form-field';
import { VdlGlobalHelpModule } from '@vdlx/vdl-angular/global-help';
import { VdlGlobalNotificationModule } from '@vdlx/vdl-angular/global-notification';
import { VdlGridListModule } from '@vdlx/vdl-angular/grid-list';
import { VdlIconModule } from '@vdlx/vdl-angular/icon';
import { VdlInputModule } from '@vdlx/vdl-angular/input';
import { VdlListModule } from '@vdlx/vdl-angular/list';
import { VdlLoginModule } from '@vdlx/vdl-angular/login';
import { VdlMenuModule } from '@vdlx/vdl-angular/menu';
import { VdlNotificationModule } from '@vdlx/vdl-angular/notification';
import { VdlPaginatorModule } from '@vdlx/vdl-angular/paginator';
import { VdlPanelModule } from '@vdlx/vdl-angular/panel';
import { VdlPopoverModule } from '@vdlx/vdl-angular/popover';
import { VdlProgressBarModule } from '@vdlx/vdl-angular/progress-bar';
import { VdlProgressSpinnerModule } from '@vdlx/vdl-angular/progress-spinner';
import { VdlRadioModule } from '@vdlx/vdl-angular/radio';
import { VdlScrollableContainerModule } from '@vdlx/vdl-angular/scrollable-container';
import { VdlSelectModule } from '@vdlx/vdl-angular/select';
import { VdlSidenavModule } from '@vdlx/vdl-angular/sidenav';
import { VdlSlideToggleModule } from '@vdlx/vdl-angular/slide-toggle';
import { VdlSliderModule } from '@vdlx/vdl-angular/slider';
import { VdlSortModule } from '@vdlx/vdl-angular/sort';
import { VdlStepperModule } from '@vdlx/vdl-angular/stepper';
import { VdlTableModule } from '@vdlx/vdl-angular/table';
import { VdlTabsModule } from '@vdlx/vdl-angular/tabs';
import { VdlTitleBarModule } from '@vdlx/vdl-angular/title-bar';
import { VdlToolbarModule } from '@vdlx/vdl-angular/toolbar';
import { VdlTooltipModule } from '@vdlx/vdl-angular/tooltip';
import { VdlTopBarModule } from '@vdlx/vdl-angular/top-bar';
import { VdlTreeModule } from '@vdlx/vdl-angular/tree';
import { VdlUtilityPanelModule } from '@vdlx/vdl-angular/utility-panel';

/**
 * NgModule that includes all VDL modules that are required to serve the demo-app.
 */
@NgModule({
  imports: [A11yModule],
  exports: [
    FormsModule,
    VdlAutocompleteModule,
    VdlAvatarModule,
    VdlBadgeModule,
    VdlBreadcrumbsModule,
    VdlButtonModule,
    VdlButtonToggleModule,
    VdlCardModule,
    VdlCheckboxModule,
    VdlChipsModule,
    VdlDatepickerModule,
    VdlDetailsPanelModule,
    VdlDialogModule,
    VdlDividerModule,
    VdlDrawerModule,
    VdlExpansionModule,
    VdlFormFieldModule,
    VdlGlobalHelpModule,
    VdlGlobalNotificationModule,
    VdlGridListModule,
    VdlIconModule,
    VdlInputModule,
    VdlListModule,
    VdlLoginModule,
    VdlMenuModule,
    VdlMomentDateModule,
    VdlNativeDateModule,
    VdlNotificationModule,
    VdlPaginatorModule,
    VdlPanelModule,
    VdlPopoverModule,
    VdlProgressBarModule,
    VdlProgressSpinnerModule,
    VdlRadioModule,
    VdlScrollableContainerModule,
    VdlSelectModule,
    VdlSidenavModule,
    VdlSliderModule,
    VdlSlideToggleModule,
    VdlSortModule,
    VdlStepperModule,
    VdlTableModule,
    VdlTabsModule,
    VdlTitleBarModule,
    VdlToolbarModule,
    VdlTooltipModule,
    VdlTopBarModule,
    VdlTreeModule,
    VdlUtilityPanelModule
  ]
})
export class VdlModule {}
