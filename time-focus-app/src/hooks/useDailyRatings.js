import { useState, useEffect, useCallback } from 'react';
import { usePocketBase } from './usePocketBase.js';
import { computeTotals } from '../utils/calculations.js';
import { EMPTY_RATINGS } from '../utils/constants.js';
import { todayStr } from '../utils/formatters.js';

const LS_KEY = (date) => `time-focus-ratings-${date}`;

function loadFromLS(date) {
  try {
    const raw = localStorage.getItem(LS_KEY(date));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveToLS(date, data) {
  try { localStorage.setItem(LS_KEY(date), JSON.stringify(data)); } catch {}
}

export function useDailyRatings(date = todayStr()) {
  const { upsertDailyRating, getDailyRating } = usePocketBase();

  const [ratings, setRatings]           = useState({ ...EMPTY_RATINGS });
  const [notes, setNotes]               = useState('');
  const [ratingNotes, setRatingNotes]   = useState({}); // { kids: "text", ... }
  const [saving, setSaving]             = useState(false);
  const [saved, setSaved]               = useState(false);
  const [pbAvailable, setPbAvailable]   = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const local = loadFromLS(date);
      if (local && !cancelled) {
        setRatings(local.ratings ?? { ...EMPTY_RATINGS });
        setNotes(local.notes ?? '');
        setRatingNotes(local.ratingNotes ?? {});
      }
      try {
        const record = await getDailyRating(date);
        if (record && !cancelled) {
          setRatings(record.ratings ?? { ...EMPTY_RATINGS });
          setNotes(record.notes ?? '');
          setRatingNotes(record.ratingNotes ?? {});
          saveToLS(date, record);
        }
      } catch {
        setPbAvailable(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [date]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateRating = useCallback((key, value) => {
    setRatings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  }, []);

  const updateRatingNote = useCallback((key, text) => {
    setRatingNotes(prev => ({ ...prev, [key]: text }));
    setSaved(false);
  }, []);

  const save = useCallback(async () => {
    setSaving(true);
    const { total, domain_totals } = computeTotals(ratings);
    const data = { date, ratings, total, domain_totals, notes, ratingNotes };

    saveToLS(date, data);

    if (pbAvailable) {
      try {
        await upsertDailyRating(data);
      } catch {
        setPbAvailable(false);
      }
    }

    setSaving(false);
    setSaved(true);
  }, [date, ratings, notes, ratingNotes, pbAvailable]); // eslint-disable-line react-hooks/exhaustive-deps

  const { total, domain_totals } = computeTotals(ratings);

  return {
    ratings, notes, ratingNotes, total, domain_totals,
    saving, saved, pbAvailable,
    setNotes, updateRating, updateRatingNote, save,
  };
}

export function useRatingsRange(startDate, endDate) {
  const { getDateRange } = usePocketBase();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const pb = await getDateRange(startDate, endDate);
        if (!cancelled) setRecords(pb);
      } catch {
        const results = [];
        const start = new Date(startDate), end = new Date(endDate);
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const ds = d.toISOString().slice(0, 10);
          const local = (() => { try { const r = localStorage.getItem(`time-focus-ratings-${ds}`); return r ? JSON.parse(r) : null; } catch { return null; } })();
          if (local) results.push({ ...local, date: ds });
        }
        if (!cancelled) setRecords(results);
      }
      if (!cancelled) setLoading(false);
    }
    if (startDate && endDate) load();
  }, [startDate, endDate]); // eslint-disable-line react-hooks/exhaustive-deps

  return { records, loading };
}
