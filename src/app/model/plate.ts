import { Subject } from './subject';
import { Tag } from './tag';
import { Reference } from './reference';

// This is globally accessible with "reviewStatus.EDIT" after this.reviewStatus = ReviewStatus
export enum PLATE_STATUS {
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
const PlateStatusNames = new Map<string, string>([
  // These are the display Names
  [PLATE_STATUS.PREP, 'Catalog in Progress'],
  [PLATE_STATUS.REPAIR, 'In Repair'],
  [PLATE_STATUS.LIST, 'In Store'],
//  [PLATE_STATUS.SALE, 'On Sale'],
  [PLATE_STATUS.HOLD, 'Being Held'],
  [PLATE_STATUS.KEEP, 'Not For Sale'],
  [PLATE_STATUS.SOLD, 'Sold']
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


export class Plate {

    public id: number;
    public subjectId: number;
    public sourceId: number;
    public sizeId: number;
    public name: string;
    public condition = 'Good';

    public details: string;
    public priceList: number;
    public onSale: boolean;

    public dateSold: string;

    public urlRelative: string;
    public status = PLATE_STATUS.PREP;

     public subject = new Subject(16, 'Science', 'General');

    public static getStatusNames() { return PlateStatusNames; }
    // public static getConditionNames() { return SaleStatusNames; }
}
