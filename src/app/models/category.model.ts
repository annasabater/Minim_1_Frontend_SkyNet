export interface Category {
    _id?: string;      // ID generado por MongoDB 
    name: string;
    description?: string;
    priority?: number;
    createdAt?: Date;
    updatedAt?: Date;
  }
  