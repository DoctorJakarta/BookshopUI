import { Subject } from './subject';
import { Tag } from './tag';
import { Reference } from './reference';

// This is globally accessible with "reviewStatus.EDIT" after this.reviewStatus = ReviewStatus
export enum BOOK_STATUS {
  // The values enum NAME is passed into the JSON request, and the java enum name is returned as a string.  T
  PREP = 'PREP',
  REPAIR = 'REPAIR',
  LIST = 'LIST',
//  SALE = 'SALE',
  HOLD = 'HOLD',
  KEEP = 'KEEP',
  SOLD = 'SOLD'
}
// This is accessible with "fruitNames.get(fruit.APPLE)" after this.fruitNames = Fruit.getFruitNames()
const BookStatusNames = new Map<string, string>([
  // These are the display Names
  [BOOK_STATUS.PREP, 'Catalog in Progress'],
  [BOOK_STATUS.REPAIR, 'In Repair'],
  [BOOK_STATUS.LIST, 'In Store'],
//  [BOOK_STATUS.SALE, 'On Sale'],
  [BOOK_STATUS.HOLD, 'Being Held'],
  [BOOK_STATUS.KEEP, 'Not For Sale'],
  [BOOK_STATUS.SOLD, 'Sold']
]);



// // This is globally accessible with "reviewStatus.EDIT" after this.reviewStatus = ReviewStatus
// export enum CONDITION {
//   // The values enum NAME is passed into the JSON request, and the java enum name is returned as a string.  T
//   NEW = "New",
//   AS_NEW = "As New",
//   FINE = "Fine",
//   NEAR_FINE = "Near Fine",
//   VERY_GOOD = "Very Good",
//   GOOD = "Good",
//   FAIR = "Fair",
//   POOR = "Poor"
// }


export class Book {

    public id: number;
    public subjectId: number;
    public title: string;
    public author: string;

    public publisher: string;
    public publisherPlace: string;
    public year: number;
    public edition: string;
    public printing: string;
    public volume: string;
    public size: 'quarto';
    public pages: string;
    public binding = 'Cloth';
    public condition = 'Good';

    public details: string;
    public contents: string;
    public notes: string;
    public rarity: string;
    public reprints: string;

    public priceBought: number;
    public priceMin: number;
    public priceMax: number;
    public priceList: number;
    public onSale: boolean;

    public dateBought: string;
    public dateSold: string;

    public urlRelative: string;
    public status = BOOK_STATUS.PREP;

    public references: Reference[];
    public tags: Tag[];

    public subject = new Subject(16, 'Science', 'General');

    public static getStatusNames() { return BookStatusNames; }
    // public static getConditionNames() { return SaleStatusNames; }
}
