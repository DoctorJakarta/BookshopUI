import { Injectable } from '@angular/core';
import { Attribute } from '../model/attribute';
import { Subject } from '../model/subject';
import { Tag, TagCheckbox } from '../model/tag';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

    attributes: Attribute[] = [];
    subjects: Subject[] = [];

    tagList: Tag[];
    tagMap: Map<number, TagCheckbox> = new Map<number, TagCheckbox>();


    addAttribute(attribute) {
        console.log("Added attrbute: " + attribute.name);
        this.attributes.push(attribute);
    }
    setAttributes(attributes) {
        this.attributes = attributes;
    }

    getAttribute(name: string) { 
       for ( const attribute of this.attributes ) {
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
