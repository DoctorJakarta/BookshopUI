import { Component, OnInit } from '@angular/core';
import { ApiService, ITEM_TYPE } from '../../services/api.service';
import { Book, BOOK_STATUS } from '../../model/book';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})

export class ExportComponent implements OnInit {

    books: any;

    constructor(private apiService: ApiService) {
        this.searchBooksByStatus(BOOK_STATUS.LIST);
    }

    searchBooksByStatus(status: string) {
        this.apiService.searchItemsBy(ITEM_TYPE.BOOK, 'status', status).subscribe(
            success => {
                this.books = success;
            },
            error => this.apiService.handleError(error)
        );
    }

  print(): void {
      let printContents, popupWin;
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

    ngOnInit() {
    }

}
