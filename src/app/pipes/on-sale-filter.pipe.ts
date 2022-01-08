import { Pipe, PipeTransform } from '@angular/core';
import { Book } from '../model/book';

@Pipe({
  name: 'onSaleFilter',
  pure: false
})
export class OnSaleFilterPipe implements PipeTransform {

  transform(books: Array<Book>, isOnSale: Boolean): Array<any> {
    if (!books) return [];
    if (typeof isOnSale === 'undefined') return books;          // Return ALL if isOnSale is null
    return books.filter(b => b.onSale === isOnSale);
  }

}
