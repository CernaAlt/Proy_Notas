import { Injectable } from '@angular/core';

import { databases, ID } from '../../lib/appwrite';

const DATABASE_ID = '68ccab04003ca27b0689';   // 👈 cambia con tu Database ID
const COLLECTION_ID = 'tasks'; // 👈 cambia con tu Collection ID

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor() { }

  async createTask(title: string, description: string, status: boolean) {
    return await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),
      { title, description, status }
    );
  }

  async getTasks() {
    return await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
  }

  async updateTask(documentId: string, data: any) {
    return await databases.updateDocument(DATABASE_ID, COLLECTION_ID, documentId, data);
  }

  async deleteTask(documentId: string) {
    return await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, documentId);
  }
}
