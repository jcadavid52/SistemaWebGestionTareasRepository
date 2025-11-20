import { Component, computed, EventEmitter, Input, Output, signal, SimpleChanges } from '@angular/core';
import { maximunSizePage } from '../../../feature/task/services/task-api-service';

@Component({
  selector: 'app-paginator-component',
  imports: [],
  templateUrl: './paginator-component.html',
  styleUrl: './paginator-component.css',
})
export class PaginatorComponent {
  @Input({ required: true }) totalCountTask: number | null = null;
  @Input({ required: true }) pageSize: number | null = null;

  @Output() pageChange = new EventEmitter<number>();

  pageNumberSignal = signal(1);
  totalPages = signal(0);

 ngOnChanges(changes:SimpleChanges ){
    if (changes['totalCountTask'] && changes['totalCountTask'].currentValue !== undefined) {
      this.totalPages.set(Math.ceil(this.totalCountTask! / maximunSizePage));
    }
 }

  handleNext() {
    if (!this.totalCountTask) return;

    const totalPages = Math.ceil(this.totalCountTask / 5);

    this.pageNumberSignal.update(value =>
      value < totalPages ? value + 1 : totalPages
    );

    this.pageChange.emit(this.pageNumberSignal());
  }

  handlePrevious() {
    this.pageNumberSignal.update(value => {
      return value > 1 ? value - 1 : 1;
    });
    this.pageChange.emit(this.pageNumberSignal());
  }

}
