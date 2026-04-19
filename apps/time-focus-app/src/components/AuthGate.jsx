import { useState } from 'react';
import { usePocketBase } from '../hooks/usePocketBase.js';

export default function AuthGate({ children }) {
  const { isLoggedIn, login, register, logout, pb } = usePocketBase();
  const [mode, setMode]       = useState('login'); // 'login' | 'register'
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]       = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  // Re-render when auth state changes
  const [, forceRender] = useState(0);
  pb.authStore.onChange(() => forceRender(n => n + 1));

  if (isLoggedIn) {
    return (
      <>
        {children}
        <div className="fixed bottom-3 right-3">
          <button
            onClick={() => { pb.authStore.clear(); forceRender(n => n + 1); }}
            className="text-xs px-3 py-1.5 rounded-xl border"
            style={{ borderColor: 'var(--border)', color: 'var(--brown-mid)', background: 'var(--bg-card)' }}
          >
            Sign out
          </button>
        </div>
      </>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      forceRender(n => n + 1);
    } catch (err) {
      setError(err?.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-cream)' }}>
      <div className="w-full max-w-sm rounded-2xl border p-8" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <h1 className="text-3xl mb-1 text-center" style={{ color: 'var(--brown-dark)' }}>Time &amp; Focus</h1>
        <p className="text-sm text-center mb-8" style={{ color: 'var(--brown-mid)' }}>
          {mode === 'login' ? 'Sign in to continue' : 'Create your account'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'register' && (
            <input
              type="text"
              placeholder="Name (optional)"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-cream)', color: 'var(--brown-dark)' }}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-cream)', color: 'var(--brown-dark)' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-cream)', color: 'var(--brown-dark)' }}
          />

          {error && (
            <p className="text-xs text-center" style={{ color: 'var(--self)' }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-60"
            style={{ background: 'var(--gold)' }}
          >
            {loading ? '…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="text-xs text-center mt-5" style={{ color: 'var(--brown-mid)' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
            className="underline"
            style={{ color: 'var(--gold)' }}
          >
            {mode === 'login' ? 'Register' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
