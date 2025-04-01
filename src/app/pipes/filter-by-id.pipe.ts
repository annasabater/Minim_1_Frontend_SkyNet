import { Pipe, PipeTransform } from '@angular/core';
import { Category } from '../models/category.model';

@Pipe({
  name: 'filterById',
  standalone: true
})
export class FilterByIdPipe implements PipeTransform {
  transform(categories: Category[], id: string): string {
    const category = categories.find(cat => cat._id === id);
    return category ? category.name : '';
  }
}
