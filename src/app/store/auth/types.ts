export interface IUser {
  id: number;
  login: string;
  token: string;
}

export interface IUserData {
  login: string;
  password: string;
}

export interface IUserMe {
  id: number;
  login: string;
}
