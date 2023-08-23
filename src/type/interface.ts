export interface IUser {
  id: string,
  email: string,
  password: string,
  permissions: string[],
  role: string,
  img?: string | ArrayBuffer | null,
  firstName?: string,
  lastName?: string,
  dni?: string,
  phone?: string,
  streetAddress?: string,
  streetNumber?: string,
  aptUnit?: string,
  city?: string,
  province?: string,
  zip?: string,
}

export interface IProduct {
  id: string,
  title: string,
  detail: string,
  price: number,
  quantity: number,
  img: string | ArrayBuffer | null,
}