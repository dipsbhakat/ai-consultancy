export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  role: 'ADMIN' | 'USER';
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'DELETED';
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface Note {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  projectId: string;
}

export interface Attachment {
  id: string;
  filename: string;
  key: string;
  size: number;
  mimeType: string;
  createdAt: string;
  projectId: string;
}

export interface CreateProjectDTO {
  name: string;
  description?: string;
}

export interface CreateNoteDTO {
  content: string;
  projectId: string;
}
