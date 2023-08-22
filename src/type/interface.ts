export interface IUser {
  id: string,
  email: string,
  password: string,
  permissions: string[],
  role: string 
}

export interface IProduct {
  id: string,
  title: string,
  detail: string,
  price: number,
  quantity: number,
  img: string | ArrayBuffer | null,
}