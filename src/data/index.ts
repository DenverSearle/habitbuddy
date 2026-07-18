import { SupabaseRepository } from './supabaseRepository';
import type { Repository } from './repository';

export const repository: Repository = new SupabaseRepository();

export type { Repository } from './repository';
