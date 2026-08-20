
import { type Role } from '@/core/entities/index.js'

interface BaseUser {
  name: string
  email: string
  active: boolean
  role: Role
}

export interface UserCreation extends BaseUser {
  password: string
}

export interface UserRetrieval extends BaseUser {
  id: number | string
}

export type User = UserCreation | UserRetrieval
