import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DronesService, Drone } from '../services/drones.services';
import { AuthService } from '../services/auth.service';
import { CategoryService } from '../services/category.services';
import { Category } from '../models/category.model';
import { FilterByIdPipe } from '../pipes/filter-by-id.pipe'; // Para mmostrar categoria

@Component({
  selector: 'app-drones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FilterByIdPipe],
  templateUrl: './drones.component.html',
  styleUrls: ['./drones.component.css']
})
export class DronesComponent implements OnInit {
  drones: Drone[] = [];
  filteredDrones: Drone[] = []; 
  droneForm!: FormGroup;
  editing: boolean = false;
  currentDroneId: string = '';
  showForm: boolean = false;
  currentUserId: string | null = null;

  // Lista de categorías disponibles 
  availableCategories: Category[] = [];

  constructor(
    private dronesService: DronesService,
    private fb: FormBuilder,
    private authService: AuthService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getUserId();
    this.loadDrones();
    this.loadCategories();  // Cargamos las categorías disponibles
    this.initForm();
  }

  // Cargar drones desde el backend
  loadDrones(): void {
    this.dronesService.getAll().subscribe({
      next: (data) => {
        this.drones = data;
        this.filteredDrones = data;
      },
      error: (err) => {
        console.error('Error al obtener drones', err);
      }
    });
  }

  loadCategories(): void {
    // Se utiliza paginación con valores altos para obtener todas
    this.categoryService.getCategories(1, 100, '').subscribe({
      next: (response) => {
        this.availableCategories = response.categories;
      },
      error: (err) => {
        console.error('Error al cargar categorías', err);
      }
    });
  }

  // Inicializar el formulario de creación/edición
  initForm(): void {
    this.droneForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      model: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      images: [''],
      type: ['venta', Validators.required],
      condition: ['nuevo', Validators.required],
      location: ['', Validators.required],
      contact: ['', Validators.required],
      // Se utiliza un array para permitir seleccionar una o varias categorías
      categories: [[], Validators.required],
      sellerId: ['', Validators.required]
    });
  }

  // Envía el formulario para crear o actualizar un dron
  onSubmit(): void {
    if (this.droneForm.invalid) {
      this.droneForm.markAllAsTouched();
      return;
    }

    const formValue = { ...this.droneForm.value };
    // Convertir imágenes de cadena a array (si es necesario)
    if (formValue.images && typeof formValue.images === 'string') {
      formValue.images = formValue.images.split(',').map((img: string) => img.trim());
    }

    if (this.editing) {
      this.dronesService.update(this.currentDroneId, formValue).subscribe({
        next: () => {
          alert('Dron actualizado exitosamente.');
          this.loadDrones();
          this.resetForm();
        },
        error: (err) => {
          console.error('Error al actualizar el dron', err);
          alert(err.error?.message || 'Error al actualizar el dron.');
        }
      });
    } else {
      this.dronesService.create(formValue).subscribe({
        next: () => {
          alert('Dron creado exitosamente.');
          this.loadDrones();
          this.resetForm();
        },
        error: (err) => {
          console.error('Error al crear el dron', err);
          alert(err.error?.message || 'Error al crear el dron.');
        }
      });
    }
  }

  // Rellenar el formulario con los datos del dron a editar
  onEdit(drone: Drone): void {
    this.editing = true;
    this.showForm = true;
    this.currentDroneId = drone._id || '';
    this.droneForm.patchValue({
      id: drone.id,
      name: drone.name,
      model: drone.model,
      price: drone.price,
      description: drone.description,
      images: drone.images ? drone.images.join(', ') : '',
      type: drone.type,
      condition: drone.condition,
      location: drone.location,
      contact: drone.contact,
      // Se asume que drone.categories es un array de IDs
      categories: drone.categories,
      sellerId: drone.sellerId
    });
  }

  // Eliminar un dron
  onDelete(drone: Drone): void {
    if (!this.authService.isLoggedIn()) {
      alert('Debes iniciar sesión para eliminar un dron.');
      return;
    }
    if (confirm('¿Estás seguro de eliminar este dron?')) {
      this.dronesService.delete(drone._id || '').subscribe({
        next: () => {
          alert('Dron eliminado exitosamente.');
          this.loadDrones();
        },
        error: (err) => {
          console.error('Error al eliminar el dron', err);
          alert(err.error?.message || 'Error al eliminar el dron.');
        }
      });
    }
  }

  // Reinicia el formulario y desactiva el modo edición
  resetForm(): void {
    this.editing = false;
    this.currentDroneId = '';
    this.showForm = false;
    this.droneForm.reset({
      id: '',
      name: '',
      model: '',
      price: 0,
      description: '',
      images: '',
      type: 'venta',
      condition: 'nuevo',
      location: '',
      contact: '',
      categories: [],
      sellerId: ''
    });
  }

  // Muestra u oculta el formulario de creación/edición
  toggleForm(): void {
    if (!this.authService.isLoggedIn()) {
      alert('Debes iniciar sesión para crear un dron.');
      return;
    }
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  // Filtrar drones por categoría (usando el ID de la categoría)
  filterByCategory(categoryId: string): void {
    this.filteredDrones = this.drones.filter((drone) => {
      return drone.categories && drone.categories.includes(categoryId);
    });
  }

  // Acción para comprar un dron
  onBuy(drone: Drone): void {
    if (!this.authService.isLoggedIn()) {
      alert('Debes iniciar sesión para comprar un dron.');
      return;
    }
    this.dronesService.purchase(drone._id!).subscribe({
      next: (res) => {
        alert(res.message || 'Compra realizada con éxito.');
        this.loadDrones();
      },
      error: (err) => {
        console.error('Error al comprar el dron', err);
        alert(err.error?.message || 'Error al comprar el dron.');
      }
    });
  }

  // Agregar una reseña a un dron
  onAddReview(drone: Drone): void {
    if (!this.authService.isLoggedIn()) {
      alert('Debes iniciar sesión para dejar una reseña.');
      return;
    }
    const ratingStr = prompt('Ingresa tu calificación (1 a 5):');
    if (!ratingStr) return;
    const rating = parseInt(ratingStr, 10);
    const comment = prompt('Ingresa tu comentario:') || '';
    if (!comment) return;

    this.dronesService.addReview(drone._id!, rating, comment).subscribe({
      next: (res) => {
        alert(res.message || 'Reseña agregada con éxito.');
      },
      error: (err) => {
        console.error('Error al agregar reseña', err);
        alert(err.error?.message || 'Error al agregar reseña.');
      }
    });
  }

  // Verifica si el dron es del usuario actual
  isOwner(drone: Drone): boolean {
    return drone.sellerId === this.currentUserId;
  }
}
