
export default abstract class UserTokenRepository {
  abstract get(email: string): Promise<string | null>
  abstract set(email: string, token: string, expiresIn?: number): Promise<void>
  abstract delete(email: string): Promise<void>
}
