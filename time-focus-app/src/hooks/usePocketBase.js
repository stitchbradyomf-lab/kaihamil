import { useMemo } from 'react';
import PocketBase from 'pocketbase';
import { PB_URL, CATEGORY_KEYS } from '../utils/constants.js';

let _pb = null;

export function getPB() {
  if (!_pb) _pb = new PocketBase(PB_URL);
  return _pb;
}

/**
 * Convert a time_focus_entries PocketBase record into internal shape:
 * { id, date, ratings, total, domain_totals, notes, ratingNotes }
 */
export function recordToInternal(rec) {
  if (!rec) return null;
  const ratings      = rec.ratings      ?? {};
  const aggregate    = rec.aggregate    ?? {};
  const ratingNotes  = rec.metadata?.rating_notes ?? {};

  return {
    id:           rec.id,
    date:         rec.entry_date ? rec.entry_date.slice(0, 10) : '',
    ratings:      Object.fromEntries(CATEGORY_KEYS.map(k => [k, ratings[k] ?? 0])),
    total:        aggregate.total        ?? CATEGORY_KEYS.reduce((s, k) => s + (ratings[k] ?? 0), 0),
    domain_totals: aggregate.domain_totals ?? {},
    notes:        rec.reflection ?? '',
    ratingNotes,
  };
}

/**
 * Convert internal shape into time_focus_entries PB fields.
 */
export function internalToRecord(data, userId) {
  return {
    user_id:     userId,
    entry_date:  data.date,
    ratings:     data.ratings,
    aggregate:   { total: data.total, domain_totals: data.domain_totals },
    reflection:  data.notes ?? '',
    metadata:    { rating_notes: data.ratingNotes ?? {} },
  };
}

export function usePocketBase() {
  const pb = useMemo(() => getPB(), []);

  const userId = pb.authStore.model?.id ?? null;

  async function login(email, password) {
    return pb.collection('users').authWithPassword(email, password);
  }

  async function register(email, password, name = '') {
    await pb.collection('users').create({ email, password, passwordConfirm: password, name });
    return pb.collection('users').authWithPassword(email, password);
  }

  function logout() {
    pb.authStore.clear();
  }

  async function upsertDailyRating(data) {
    if (!userId) throw new Error('Not authenticated');
    const flat   = internalToRecord(data, userId);
    const filter = `user_id="${userId}" && entry_date>="${data.date} 00:00:00" && entry_date<="${data.date} 23:59:59"`;
    try {
      const existing = await pb.collection('time_focus_entries').getFirstListItem(filter);
      return recordToInternal(await pb.collection('time_focus_entries').update(existing.id, flat));
    } catch {
      return recordToInternal(await pb.collection('time_focus_entries').create(flat));
    }
  }

  async function getDailyRating(date) {
    if (!userId) return null;
    try {
      const filter = `user_id="${userId}" && entry_date>="${date} 00:00:00" && entry_date<="${date} 23:59:59"`;
      return recordToInternal(await pb.collection('time_focus_entries').getFirstListItem(filter));
    } catch {
      return null;
    }
  }

  async function getDateRange(startDate, endDate) {
    if (!userId) return [];
    try {
      const recs = await pb.collection('time_focus_entries').getFullList({
        filter: `user_id="${userId}" && entry_date>="${startDate} 00:00:00" && entry_date<="${endDate} 23:59:59"`,
        sort:   'entry_date',
      });
      return recs.map(recordToInternal);
    } catch {
      return [];
    }
  }

  async function getIntentions(period, periodStart) {
    if (!userId) return null;
    try {
      const filter = `user="${userId}" && period="${period}" && period_start>="${periodStart} 00:00:00" && period_start<="${periodStart} 23:59:59"`;
      const rec = await pb.collection('intentions').getFirstListItem(filter);
      return {
        id:           rec.id,
        period:       rec.period,
        period_start: rec.period_start?.slice(0, 10),
        period_end:   rec.period_end?.slice(0, 10),
        target_ratings: {
          kids:     rec.target_kids,
          partner:  rec.target_partner,
          work:     rec.target_work,
          business: rec.target_business,
          sleep:    rec.target_sleep,
        },
        focus_areas: rec.focus_areas ?? [],
      };
    } catch {
      return null;
    }
  }

  return {
    pb,
    userId,
    isLoggedIn: !!userId,
    login,
    register,
    logout,
    upsertDailyRating,
    getDailyRating,
    getDateRange,
    getIntentions,
  };
}
