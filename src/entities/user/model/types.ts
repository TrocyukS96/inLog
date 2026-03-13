  export type UserDTO = Partial<User> & {
    // если есть специфичные поля для обновления
  }

  /**
 * Аватар пользователя (разные размеры)
 */
export interface Avatar {
    small?: string
    medium?: string
    large?: string
    original?: string
  }
  
  /**
   * Настройки пользователя (язык, уведомления, время и т.д.)
   */
  export interface UserSettings {
    language: 'ru' | 'en' // LanguageTypes → лучше union вместо enum, проще в RTK
    timezone: string
    soundNotification: boolean // было any → предполагаю boolean
    disabledEmailNotifications: string[]
    disabledInlogNotifications: string[]
    notifiableDaysOfWeek: number[] // 0 = воскресенье, 1 = понедельник и т.д.
    notifyFromTime: string // формат "HH:mm"
    notifyToTime: string   // формат "HH:mm"
  }
  
  /**
   * Основная модель пользователя
   */
  export interface User {
    id: number
    email: string
    firstName: string          // name → firstName (более понятно)
    middleName: string         // patronymic
    lastName: string           // surname
    fullName?: string 
    full_name?: string         // вычисляемое поле, если нужно
  
    companyName?: string
    position?: string
    about?: string             // about_myself
  
    role?: 'admin' | 'user' | 'manager' | string // RoleTypes → union или string
    avatar?: Avatar
  
    phone?: string | null
    mobilePhone?: string | null
    workPhone?: string | null

    work_phone?: string | null
    mobile_phone?: string | null
  
    settings: UserSettings
  
    // поля из профиля сотрудника
    dateOfBirth?: string       // ISO или 'YYYY-MM-DD'
    department?: string
    experienceYears?: number | string
    joinedAt?: string          // in_organization_since
    personnelNumber?: string   // табельный номер
    room?: string
    workplace?: string
  
    // файлы пользователя (документы, сканы и т.д.)
    files?: UserFile[]
  }
  
  /**
   * Участник проекта (Member)
   */
  export interface ProjectMember {
    id: number
    user: User
    role: 'admin' | 'member' | 'supervisor' | string
    createdAt?: string
    projectId: number | string // или ссылка на проект
  
    // дополнительные поля для UI
    color?: string
    name?: string // для отображения без полного user
  }
  
  /**
   * Расширенный участник (с дополнительными полями для таблицы/списка)
   */
  export interface ExtendedMember extends ProjectMember {
    color: string
  }
  
  /**
   * Надзиратель / Supervisor
   */
  export interface Supervisor {
    id: number
    user?: User
    taskId?: number
    projectId?: number
    file?: string
    filename?: string
    size?: number
    createdAt?: string
  }
  
  /**
   * Исполнитель задачи (Doer)
   */
  export interface TaskDoer {
    id: number
    user?: User
  }
  
  /**
   * Минимальная информация о пользователе (для списков, карточек)
   */
  export interface SmallUser {
    id: number
    email: string
    fullName?: string
    companyName?: string
    position?: string
    avatar?: Avatar
  }
  

  export interface UserFile {
    id: number
    name: string
    url: string
    size?: number
    mimeType?: string
    createdAt?: string
    task?:number
    filename?:string
    file?:string
  }
