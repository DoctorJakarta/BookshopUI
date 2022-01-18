import { Injectable } from '@angular/core';
import { Attribute } from '../model/attribute';
import { Subject } from '../model/subject';
import { Tag, TagCheckbox } from '../model/tag';

export enum LOCAL {                         // Names of items saed in Local Storage persisted on next web session
    selectedBookIds = 'selectedBookIds',
    selectedBooks   = 'selectedBooks',
    selectedPlateIds = 'selectedPlateIds',
    selectedPlates   = 'selectedPlates'
}

export enum SESSION {                                 // Names of items saved in Session Storage persisted on next web session
    someSessionParam = 'someSessionParam'
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {

    attributes: Attribute[] = [];
    subjects: Subject[] = [];

    tagList: Tag[];
    tagMap: Map<number, TagCheckbox> = new Map<number, TagCheckbox>();

    constructor() {
        this.setDefaults();
    }

    setDefaults(){
        if ( !this.get(LOCAL.selectedBookIds) ) this.set(LOCAL.selectedBookIds, []);            // Create empty array so .includes doesn't throw error
        if ( !this.get(LOCAL.selectedBooks) ) this.set(LOCAL.selectedBooks, []);                // Create empty array so .includes doesn't throw error
        if ( !this.get(LOCAL.selectedPlateIds) ) this.set(LOCAL.selectedPlateIds, []);          // Create empty array so .includes doesn't throw error
        if ( !this.get(LOCAL.selectedPlates) ) this.set(LOCAL.selectedPlates, []);              // Create empty array so .includes doesn't throw error
    }

    get(key: SESSION | LOCAL ): any {
        let value = null;
                                        // TODO: This is a hack because I don't know how to check which typeof for an enum
                                        //       This hack wouldn't work if LOCAL and SESSION had enums with the same string value, but I don't intend to do that ever
                                        //       DASH_TABS and VULN_TABS do share common strings (product)
        if ( Object.values(SESSION).includes(key as SESSION) ) value = sessionStorage.getItem(key);
        else if ( Object.values(LOCAL).includes(key as LOCAL) ) value = localStorage.getItem(key);

        if (!value) { return; }

        // assume it is a JSON object that has been stringified if starts with [ (array) or { (object)
        if ( value[0] === '[' || value[0] === '{' ) {
        value = JSON.parse(value);
        }

        return value;
  }

  getInt(key: SESSION | LOCAL): number {              // This is necessary for selectedXXXids which need to be numbers for the selectBox choice to match the OPTION integers
    return parseInt(this.get(key));
  }

  set(key: SESSION | LOCAL, value: any) {
  //  if (!key || !value) { return; }         // This didn't work when value = 0.  Also may want to set value=null
    if (!key) { return; }

    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }

    if ( Object.values(SESSION).includes(key as SESSION) ) sessionStorage.setItem(key, value);
    else if ( Object.values(LOCAL).includes(key as LOCAL) ) localStorage.setItem(key, value);

  }

  //
  // Legacy methods
  //
    addAttribute(attribute) {
        console.log("Added attrbute: " + attribute.name);
        this.attributes.push(attribute);
    }
    setAttributes(attributes) {
        this.attributes = attributes;
    }

    getAttribute(name: string) { 
        console.log("Looknin fo attrbute ("+name+") in: " + this.attributes);
       
       for ( const attribute of this.attributes ) {
         //console.log("Checking ("+( name === attribute.name )+") attrbute list for: " + attribute.name);
          if ( name === attribute.name ) {
                return attribute;
            } 
        }
       
        console.log("Didn't find attrbute list for: " + name);

        return null; 
    }

    setSubjects(subjects) {
        this.subjects = subjects;
    }

    getSubjects() { return this.subjects; }

    private resetTagMap() {
        for ( const t of this.tagList) {
            this.tagMap.set(t.id, new TagCheckbox(t));
        }
         console.log('Added tagCheckbox: ' + this.tagMap.size);
    }
    
    setTags(tags) { 
        this.tagList = tags;
        this.resetTagMap();
    }

    getTags() { return this.tagList; }
    // getTagCheckboxMap() { return this.tagMap; }

    getTagCheckboxMap(selectedTags: Tag[]) {
        this.resetTagMap();
        console.log('Getting tagCheckbox: ' + this.tagMap.size);
        const cbMap = new Map(this.tagMap);                     // You would think this created a new object, but apparently it does not.  Thus resetTagMap() was called.
        if ( selectedTags != null ) {
                for ( const t of selectedTags ) {
                    cbMap.get(t.id).checked = true;
                }
            }
            return cbMap;
    }

}
