export interface Task {
  id?: number;
  title: string;
  completed: boolean;
  userId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}