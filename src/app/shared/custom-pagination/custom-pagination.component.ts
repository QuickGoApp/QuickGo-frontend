import {Component, EventEmitter, Input, Output} from '@angular/core';
import {
  pageSelection,
  pageSize,
  pageSizeCal,
  PaginationService,
} from './pagination.service';

@Component({
  selector: 'app-custom-pagination',
  templateUrl: './custom-pagination.component.html',
  styleUrls: ['./custom-pagination.component.scss'],
})
export class CustomPaginationComponent {
  public pageSize = 100;
  public tableData: Array<string> = [];
  public totalData = 100;
  public skip = 0;
  public limit: number = this.pageSize;
  public serialNumberArray: Array<number> = [];
  public pageSelection: Array<pageSelection> = [];

  @Input() currentPage: number;
  @Input() totalPages: number;
  @Output() pageChange = new EventEmitter<number>();

  constructor(private pagination: PaginationService) {

  }

  get pages(): number[] {
    const maxPages = 5;
    const totalPages = this.totalPages;

    if (totalPages <= maxPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      const currentPage = this.currentPage;
      const halfMaxPages = Math.floor(maxPages / 2);
      const firstPage = Math.max(1, currentPage - halfMaxPages);
      const lastPage = Math.min(totalPages, currentPage + halfMaxPages);
      return Array.from({ length: lastPage - firstPage + 1 }, (_, i) => firstPage + i);
    }
  }


  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }


}
