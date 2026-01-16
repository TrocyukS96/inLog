export interface IUser {
    id: number | string
    username?: string
    email: string
    // first_name?: string
    // last_name?: string
    // avatar?: string
    // ... все остальные поля из твоего UserDTO / IUser
  }
  
  export type UserDTO = Partial<IUser> & {
    // если есть специфичные поля для обновления
  }