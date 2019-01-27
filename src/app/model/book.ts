import { Tag } from './tag';
import { Reference } from './reference';

// This is globally accessible with "reviewStatus.EDIT" after this.reviewStatus = ReviewStatus
export enum SALE_STATUS {
  // The values enum NAME is passed into the JSON request, and the java enum name is returned as a string.  T
  PREP = "PREP",
  LIST = "LIST",
  SALE = "SALE",
  HOLD = "HOLD",
  KEEP = "KEEP",
  SOLD = "SOLD"
}
// This is accessible with "fruitNames.get(fruit.APPLE)" after this.fruitNames = Fruit.getFruitNames()
const SaleStatusNames = new Map<string, string>([
  // These are the display Names
  [SALE_STATUS.PREP, 'Catalog in Progress'],
  [SALE_STATUS.LIST, 'In Store'],
  [SALE_STATUS.SALE, 'On Sale'],
  [SALE_STATUS.HOLD, 'Being Held'],
  [SALE_STATUS.KEEP, 'Not For Sale'],
  [SALE_STATUS.SOLD, 'Sold']
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

    public desc: string;
    public notes: string;

    public price: number;
    public priceBought: number;
    public priceMin: number;
    public priceMax: number;

    public dateBought: string;
    public dateSold: string;

    public status = SALE_STATUS.PREP;
    public condition = 'Very Good';

    public references: Reference[];
    public tags: Tag[];

    public static getSaleStatusNames() { return SaleStatusNames; }
    // public static getConditionNames() { return SaleStatusNames; }
}
