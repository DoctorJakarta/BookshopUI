export class Listing {
  public id: number;
  public name: string;
  public url: string;
 }

export class ListingCheckbox {
  public id: number;
  public name: string;
  public checked = false;

  constructor ( l: Listing ) {
      this.id = l.id;
      this.name = l.name;
  }
}
