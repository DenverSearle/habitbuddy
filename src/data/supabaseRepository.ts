import type { EventType, NewEventType, LogEntry, LogEntryInput } from '../types';
import type { Repository } from './repository';
import { supabase } from './supabaseClient';

function unwrap<T>({ data, error }: { data: T | null; error: { message: string } | null }): T {
  if (error) throw new Error(error.message);
  return data as T;
}

export class SupabaseRepository implements Repository {
  private async getUserId(): Promise<string> {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw new Error('Not authenticated');
    return data.user.id;
  }

  async getEventTypes(): Promise<EventType[]> {
    const result = await supabase
      .from('event_types')
      .select('*')
      .order('created_at', { ascending: true });
    return unwrap(result);
  }

  async createEventType(input: NewEventType): Promise<EventType> {
    const user_id = await this.getUserId();
    const result = await supabase
      .from('event_types')
      .insert({ ...input, user_id })
      .select()
      .single();
    return unwrap(result);
  }

  async updateEventType(id: string, input: NewEventType): Promise<EventType> {
    const result = await supabase
      .from('event_types')
      .update(input)
      .eq('id', id)
      .select()
      .single();
    return unwrap(result);
  }

  async deleteEventType(id: string): Promise<void> {
    const { error } = await supabase.from('event_types').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }

  async getLogEntries(startDate: string, endDate: string): Promise<LogEntry[]> {
    const result = await supabase
      .from('log_entries')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate);
    return unwrap(result);
  }

  async upsertLogEntry(input: LogEntryInput): Promise<LogEntry> {
    const user_id = await this.getUserId();
    const result = await supabase
      .from('log_entries')
      .upsert({ ...input, user_id }, { onConflict: 'event_type_id,date' })
      .select()
      .single();
    return unwrap(result);
  }

  async deleteLogEntry(id: string): Promise<void> {
    const { error } = await supabase.from('log_entries').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
}
