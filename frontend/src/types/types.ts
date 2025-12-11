export interface User {
  _id: string;
  email: string;
}

export interface Chat {
  _id: string;
  users: User[];
  createdAt: string;
  updatedAt: string;
}
