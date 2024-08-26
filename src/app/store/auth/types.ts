export interface IUser {
  id: number;
  login: string;
  access_token: string;
  refresh_token: string;
  name: string;
  role: string;
}

export interface IUserData {
  login: string;
  password: string;
}

export interface IUserMe {
  id: number;
  login: string;
  name: string;
  role: string;
}
