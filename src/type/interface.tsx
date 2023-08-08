export interface IUser {
  email: string,
  password: string,
  permissions: string[],
  rol?: string | undefined
}