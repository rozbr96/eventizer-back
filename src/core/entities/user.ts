
import { type Role } from '@/core/entities/index.js'

interface BaseUser {
  name: string
  email: string
  active: boolean
  role: Role
  password: string
}

export interface UserCreation extends BaseUser { }

export interface UserEdition {
  active?: boolean
}

export interface UserRetrieval extends BaseUser {
  id: number | string
}

export type User = UserCreation | UserRetrieval
