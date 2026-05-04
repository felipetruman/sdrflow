import type { Database } from '@/types/database'

export type SupabaseTableName = keyof Database['public']['Tables']
export type SupabaseRow<T extends SupabaseTableName> = Database['public']['Tables'][T] extends { Row: infer R } ? R : never
export type SupabaseInsert<T extends SupabaseTableName> = Database['public']['Tables'][T] extends { Insert: infer I } ? I : never
export type SupabaseUpdate<T extends SupabaseTableName> = Database['public']['Tables'][T] extends { Update: infer U } ? U : never

export type CookieOptions = Parameters<
  Awaited<ReturnType<typeof import('next/headers').cookies>>['set']
>[2]

export type SupabaseError = { message: string }
export type SupabaseQueryResult<T> = Promise<{ data: T | null; error: SupabaseError | null }>

export interface SupabaseQueryBuilder<T> {
  then<TResult1 = { data: T[] | null; error: unknown; count?: number | null }, TResult2 = never>(
    onfulfilled?: ((value: { data: T[] | null; error: unknown; count?: number | null }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): PromiseLike<TResult1 | TResult2>
  select(columns?: string, options?: { count?: 'exact'; head?: boolean }): SupabaseQueryBuilder<T>
  eq(column: string, value: string): SupabaseQueryBuilder<T>
  in(column: string, values: string[]): SupabaseQueryBuilder<T>
  order(column: string, options?: { ascending?: boolean }): SupabaseQueryBuilder<T>
  maybeSingle(): SupabaseQueryResult<T>
  single(): SupabaseQueryResult<T>
  insert(values: unknown): SupabaseQueryBuilder<T>
  update(values: unknown): SupabaseQueryBuilder<T>
  delete(): SupabaseQueryBuilder<T>
  upsert(values: unknown, options?: { onConflict?: string }): SupabaseQueryBuilder<T>
}

export interface SupabaseClientLike {
  auth: {
    getUser(): Promise<{ data: { user: { id: string; email?: string | null } | null }; error: SupabaseError | null }>
    getSession(): Promise<{ data: { session: { user: { id: string; email?: string | null }; access_token: string } | null }; error: SupabaseError | null }>
    signInWithPassword(credentials: { email: string; password: string }): Promise<{ data: unknown; error: SupabaseError | null }>
    signUp(credentials: { email: string; password: string }): Promise<{ data: unknown; error: SupabaseError | null }>
    signOut(): Promise<{ error: SupabaseError | null }>
  }
  from<T extends SupabaseTableName>(table: T): SupabaseQueryBuilder<SupabaseRow<T>>
  functions: {
    invoke<TResponse = unknown>(
      functionName: string,
      options?: { body?: unknown },
    ): Promise<{ data: TResponse | null; error: SupabaseError | null }>
  }
  rpc<TResponse = unknown>(functionName: string, params?: Record<string, unknown>): Promise<{ data: TResponse | null; error: SupabaseError | null }>
}
