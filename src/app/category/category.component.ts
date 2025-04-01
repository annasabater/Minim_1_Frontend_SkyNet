// src/app/category/category.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';    // Para *ngFor, *ngIf, etc.
import { FormsModule } from '@angular/forms';        // Para [(ngModel)]
import { CategoryService } from '../services/category.services';
import { Category } from '../models/category.model';

@Component({
  selector: 'app-category',
  standalone: true, // Marca el componente como standalone
  imports: [CommonModule, FormsModule], // Importa módulos necesarios para el template
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  categories: Category[] = [];
  total: number = 0;
  page: number = 1;
  limit: number = 10;
  search: string = '';
  newCategory: Category = { name: '', description: '', priority: 0 };

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.fetchCategories();
  }

  // Obtiene la lista de categorías desde el backend
  fetchCategories(): void {
    this.categoryService.getCategories(this.page, this.limit, this.search).subscribe(response => {
      this.categories = response.categories;
      this.total = response.total;
    });
  }

  // Reinicia la paginación al buscar
  searchCategories(): void {
    this.page = 1;
    this.fetchCategories();
  }

  // Crea una nueva categoría
  createCategory(): void {
    this.categoryService.createCategory(this.newCategory).subscribe(() => {
      this.newCategory = { name: '', description: '', priority: 0 };
      this.fetchCategories();
    });
  }

  // Actualiza una categoría existente
  updateCategory(category: Category): void {
    if (category._id) {
      this.categoryService.updateCategory(category._id, category).subscribe(() => {
        this.fetchCategories();
      });
    }
  }

  // Elimina una categoría por ID
  deleteCategory(id: string): void {
    this.categoryService.deleteCategory(id).subscribe(() => {
      this.fetchCategories();
    });
  }

  // Cambia de página en la paginación
  onPageChange(newPage: number): void {
    this.page = newPage;
    this.fetchCategories();
  }
}
