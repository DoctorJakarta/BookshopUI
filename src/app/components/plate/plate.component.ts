import { Component, OnInit } from '@angular/core';
import { ApiService, ITEM_TYPE } from '../../services/api.service';
import { CacheService, SESSION, LOCAL } from '../../services/cache.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Plate, PLATE_STATUS } from '../../model/plate';
import { Attribute, ATTR } from '../../model/attribute';
import { Subject } from '../../model/subject';
import { Source } from '../../model/source';
import { Size } from '../../model/size';
import { Tag } from '../../model/tag';
import { TagCheckbox } from '../../model/tag';
import { Reference } from '../../model/reference';
import { ReferenceComponent } from '../reference/reference.component';

// import { VdlDialogRef, VdlDialog, VdlDialogConfig } from 'vdl-angular';
import { VdlDialog } from '@vdlx/vdl-angular/dialog';
import { VdlDialogConfig } from '@vdlx/vdl-angular/dialog';
import { VdlDialogRef } from '@vdlx/vdl-angular/dialog';
import { BreakpointObserver } from '@angular/cdk/layout';

export enum PAGE_TYPE {
    LIST_PLATES = 'List',
    NEW_PLATE = 'New',
    EDIT_PLATE = 'Edit',
    EXPORT_PLATES = 'Export',
    SELECTED_PLATES = 'Selected',
    SALE_PLATES = 'Sale'
}
export enum SEARCH_TYPE {
    YEAR    = 'year',
    AUTHOR  = 'author',
    TAG     = 'tag'
}

@Component({
  selector: 'app-plate',
  templateUrl: './plate.component.html',
  styleUrls: ['./plate.component.css']
})

export class PlateComponent implements OnInit {

    BASE_URL = 'http://localhost/plates/';

    public dialogRef: VdlDialogRef<ReferenceComponent>;

    SEARCH_TYPE: typeof SEARCH_TYPE = SEARCH_TYPE;        // This exposed the enum to the HTML

    PAGE_TYPE: typeof PAGE_TYPE = PAGE_TYPE;        // This exposed the enum to the HTML
    pageType = PAGE_TYPE.LIST_PLATES;

    PLATE_STATUS: typeof PLATE_STATUS = PLATE_STATUS;    // This exposes the enum to the HTML
    plateStatusNames = Plate.getStatusNames();
    selectedPlateStatus = '0';
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
    sources: Source[] = [];
    sizes: Size[] = [];

    plates: any;
    plate: any;
    tagCheckboxMap: Map<number, TagCheckbox>;

    reference: any;

    searchType: string;
    searchValue: string;
    searchTag: string;

    statusUpdateValue: any;
    saleUpdateValue: any;
    priceUpdateValue: any;

    constructor(private apiService: ApiService, private cacheService: CacheService,
                private dialog: VdlDialog,
                private route: ActivatedRoute, private router: Router) {

        this.getCacheLists();

        this.route.params.subscribe(params => {
            if (params['pageType']) this.pageType = params['pageType'];
            if ( params['plateStatus']) this.selectedPlateStatus = params['plateStatus'];
            if ( params['onSale']){
               if (params['onSale'].toLowerCase() === 'true') this.selectedOnSale = true;
               else if (params['onSale'].toLowerCase() === 'false') this.selectedOnSale = false;
            } 

            switch (this.pageType) {
                case PAGE_TYPE.NEW_PLATE:
                    this.tagCheckboxMap = this.cacheService.getTagCheckboxMap(null);
                    this.plate = new Plate();
                    break;
                case PAGE_TYPE.EDIT_PLATE:
                    this.plate = this.getItem(params['plateId'] );
                    break;
                case PAGE_TYPE.LIST_PLATES:
                case PAGE_TYPE.EXPORT_PLATES:
                     if (params['searchType']) {
                        this.searchType = params['searchType'];
                        this.searchValue = params['searchValue'];
                        this.plates = this.searchBy(this.searchType, this.searchValue);
                    }
                    else if (params['searchTag']) {
                        this.searchTag = params['searchTag'];
                        this.plates = this.searchBy(this.searchType, this.searchValue);
                    }
                    else this.plates = this.getAllPlates(false);
                    break;

                case PAGE_TYPE.SALE_PLATES:
                    this.getSalePlates();
                    break;

               case PAGE_TYPE.SELECTED_PLATES:
                     this.plates =  this.cacheService.get(LOCAL.selectedPlates);
                    break;
           }
        });
    }

    listPlates() { this.router.navigate(['plate', PAGE_TYPE.LIST_PLATES]); }
    selectedPlates() { this.router.navigate(['plate', PAGE_TYPE.SELECTED_PLATES]); }
    newPlate() { this.router.navigate(['plate', PAGE_TYPE.NEW_PLATE]); }
    editPlate(id: number) { this.router.navigate(['plate', PAGE_TYPE.EDIT_PLATE, { plateId: id} ] ); }
    exportPlates() { this.router.navigate(['plate', PAGE_TYPE.EXPORT_PLATES]); }

    resetSelectedPlates(){                   // Updates change the plate parameters, so they need to be updated from what is in the database
        const selectedIds = this.cacheService.get(LOCAL.selectedPlateIds);
        const selectedPlates = [];
        for (const b of this.plates){
            if ( selectedIds.includes(b.id)) selectedPlates.push(b);
        }
        this.cacheService.set(LOCAL.selectedPlates, selectedPlates);
        this.plates =  this.cacheService.get(LOCAL.selectedPlates);
    }

    getCacheLists() {
        this.subjects = this.cacheService.getSubjects();
        this.sources = this.cacheService.getSources();
        this.sizes = this.cacheService.getSizes();
        
    }

    searchPlates(searchType: string) {
        // alert('Searching for: ' + this.searchValue);
        this.router.navigate(['plate', PAGE_TYPE.LIST_PLATES, { searchType: searchType, searchValue: this.searchValue} ] );
    }
    returnToSearch() {
        console.log('Returning to search with type: ' + this.searchType  );
        console.log('Returning to search with value: ' + this.searchValue  );
        if ( this.searchType ) {
            this.searchPlates(this.searchType);
        } else {
            this.listPlates();
        }
    }
    searchBy(field: string, value: string) {
        this.apiService.searchItemsBy(ITEM_TYPE.PLATE, field, value).subscribe(
            success => {
                this.plates = success;
            },
            error => this.apiService.handleError(error)
        );
    }

    getAllPlates(resetSelectedPlates: boolean) {
        this.apiService.readItems(ITEM_TYPE.PLATE).subscribe(
            success => {
                this.plates = success;
                if (resetSelectedPlates) this.resetSelectedPlates();
            },
            error => this.apiService.handleError(error)
        );
    }

    getSalePlates() {
        this.apiService.readSaleItems(ITEM_TYPE.PLATE).subscribe(
            success => {
                this.plates = success;
            },
            error => this.apiService.handleError(error)
        );
    }

    getItem(id: number) {
        this.apiService.readItem(ITEM_TYPE.PLATE, id).subscribe(
            success => {
                this.plate = success;
             },
            error => this.apiService.handleError(error)
        );
    }

    upsertPlate(plate: Plate) {
        let apiServiceRequest;
        if ( this.plate.id ) apiServiceRequest = this.apiService.updateItem(ITEM_TYPE.PLATE, this.plate);
        else                 apiServiceRequest = this.apiService.createItem(ITEM_TYPE.PLATE, this.plate);


        apiServiceRequest.subscribe(
            success => {
                // this.listPlates();
                this.returnToSearch();
            },
            error => this.apiService.handleError(error)
        );
    }

    deletePlate(id: number) {
        if ( confirm('Are you sure you want to delete the plate?')) {
            this.apiService.deleteItem(ITEM_TYPE.PLATE, id).subscribe(
                success => {
                    this.listPlates();
                },
                error => this.apiService.handleError(error)
            );
        }
    }

    public deleteReference(ref: Reference) {
        if (confirm('Are you sure you want to delete the reference: ' + ref.desc)) {
            this.apiService.deleteReference(ref).subscribe(
                success => {
                    this.listPlates();
                }
            );
        }
    }
    public openReferenceDialog(ref?: Reference) {
        console.log('Opening Reference Dialog: ' + ref);
       if ( ref == null ) this.reference = new Reference(this.plate.id);
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
                        // this.listPlates();
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

    getSaleStatusKeys() {
        return Array.from(this.plateStatusNames.keys());
    }

    // getConditionKeys() {
    //     return Object.keys(this.CONDITION);
    // }

    launchImageUrl(url: string) {
        window.open(this.BASE_URL + url, '_blank');
    }

    filterPlates() {
        this.router.navigate(['plate', PAGE_TYPE.LIST_PLATES, { plateStatus: this.selectedPlateStatus, onSale: this.selectedOnSale }]);
    }


    getPlateStatusKeys() {
        return Array.from(this.plateStatusNames.keys());
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

    isSelected(plate: Plate) {
        const id = plate.id;
        return this.cacheService.get(LOCAL.selectedPlateIds).includes(id);
        // return this.cacheService.get(LOCAL.selectedPlates).includes(plate);        // I don't know how to filter based on the equivalence of an Object
    }

    toggleSelect(plate: Plate) {
        const id = plate.id;
        let plateIds = this.cacheService.get(LOCAL.selectedPlateIds);
        let plates = this.cacheService.get(LOCAL.selectedPlates);
        if (plateIds.includes(id)) {                                                 // I don't know how to filter based on the equivalence of an Object
            // alert('Already got plateId: ' + id);
            plateIds = plateIds.filter(aPlateId => aPlateId !== id);
            this.cacheService.set(LOCAL.selectedPlateIds, plateIds);

            plates = plates.filter(aPlate => aPlate.id !== id);
            this.cacheService.set(LOCAL.selectedPlates, plates);
        }
        else {
            // alert('Selecting plateId: ' + id);
            plateIds.push(id);
            this.cacheService.set(LOCAL.selectedPlateIds, plateIds);

            plates.push(plate);
            this.cacheService.set(LOCAL.selectedPlates, plates);
        }
    }

    bulkFieldUpdate(updateField: string) {
        const plateIds = this.cacheService.get(LOCAL.selectedPlateIds);
        let updateFieldValue;
        switch (updateField) {
            case 'status':
                updateFieldValue = this.statusUpdateValue;
                break;
             case 'salePercent':
                updateFieldValue = this.saleUpdateValue;
                break;
            case 'priceList':
                updateFieldValue = this.priceUpdateValue;
                break;
            default:
                alert('Invalid selection');
                return;
        }

        if (confirm('Are you sure you want to update selected plates with: ' + updateFieldValue)) {
            this.apiService.bulkUpdateItems(ITEM_TYPE.PLATE, updateField, updateFieldValue, plateIds).subscribe(
                success => {
                     this.getAllPlates(true);
                }
            );
        }
     }

    clearSelected() {
        if ( confirm('Clear ALL Checkboxes:') ){
            this.cacheService.set(LOCAL.selectedPlateIds, []);
            this.cacheService.set(LOCAL.selectedPlates, []);
        }
    }

    ngOnInit() {

    }

}
