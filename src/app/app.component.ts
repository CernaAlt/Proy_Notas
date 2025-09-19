import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { account, ID } from '../lib/appwrite';
import { TaskService } from './servicios/task.service';
import { NgFor } from '@angular/common';
import { GestorApuestasComponent } from "./components/gestor-apuestas/gestor-apuestas.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, NgFor, GestorApuestasComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Gestor_Deportivas';

  loggedInUser: any = null;
  email: string = '';
  password: string = '';
  name: string = '';

  async login(email: string, password: string) {
    await account.createEmailPasswordSession(
      email, 
      password
    );
    this.loggedInUser = await account.get();
  }

  async register(email: string, password: string, name: string) {
    await account.create(
      ID.unique(),
      email,
      password,
      name
    );
    this.login(email, password);
  }

  async logout() {
    await account.deleteSession('current');
    this.loggedInUser = null;
  }

  tasks: any[] = [];
  newTask = { title: '', description: '' }; // 👈 objeto para el formulario

  constructor(private taskService: TaskService) {}

  async ngOnInit() {
    await this.loadTasks();
  }

  async loadTasks() {
    const response = await this.taskService.getTasks();
    this.tasks = response.documents;
  }

  async addTask() {
    if (!this.newTask.title || !this.newTask.description) return;

    await this.taskService.createTask(
      this.newTask.title,
      this.newTask.description,
      false
    );

    this.newTask = { title: '', description: '' }; // 👈 limpiar inputs
    await this.loadTasks();
  }

  async updateTask(task: any) {
    await this.taskService.updateTask(task.$id, { status: !task.status });
    await this.loadTasks();
  }

  async deleteTask(task: any) {
    await this.taskService.deleteTask(task.$id);
    await this.loadTasks();
  }
}
