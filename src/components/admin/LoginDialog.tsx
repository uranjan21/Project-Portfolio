import { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Dialog } from './Dialog';

export function LoginDialog({ onClose }: { onClose: () => void }) {
  const { login } = usePortfolio();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      await login(password);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setBusy(false);
    }
  };

  return (
    <Dialog title="Admin access" onClose={onClose}>
      <label htmlFor="admin-password">Password</label>
      <input
        id="admin-password"
        type="password"
        autoFocus
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && password) void submit();
        }}
      />
      {error && <div className="error">{error}</div>}
      <div className="dialog-actions">
        <button className="btn" onClick={onClose}>Cancel</button>
        <button className="btn primary" disabled={busy || !password} onClick={() => void submit()}>
          {busy ? 'Verifying…' : 'Authenticate'}
        </button>
      </div>
    </Dialog>
  );
}
