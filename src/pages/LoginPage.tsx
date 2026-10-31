import React, { useState, type FormEvent } from 'react';
import { ArrowRight, Eye, EyeOff, Leaf, ShieldAlert } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AdminApi } from '../services/adminApi';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice('');
    setSubmitting(true);
    try {
      await AdminApi.login(email, password);
      const returnTo = (location.state as { from?: string } | null)?.from || '/';
      navigate(returnTo, { replace: true });
    } catch (error: any) {
      setNotice(error.response?.data?.message || 'Sign-in failed. Check your credentials and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="admin-login-page">
      <section className="admin-login-story" aria-label="Well Educated Foundation">
        <div className="admin-login-brand">
          <span className="admin-login-brand-mark"><ShieldAlert size={23} /></span>
          <span>
            <strong>Well Educated Foundation</strong>
            <small>ADMIN PORTAL</small>
          </span>
        </div>

        <div className="admin-login-story-copy">
          <span className="admin-login-kicker">COMMUNITY FIRST. ALWAYS.</span>
          <h1>Good work deserves <em>good stewardship.</em></h1>
          <p>Care, opportunity, and stronger communities start with people working together.</p>
          <div className="admin-login-story-signoff">
            <Leaf size={18} aria-hidden="true" />
            <span>Grounded in care. Growing together.</span>
          </div>
        </div>

        <div className="admin-login-story-footer">
          <span>WELL EDUCATED FOUNDATION</span>
          <span>EST. 2012</span>
        </div>
        <Leaf className="admin-login-story-leaf" aria-hidden="true" />
      </section>

      <section className="admin-login-form-panel" aria-labelledby="admin-login-title">
        <div className="admin-login-form-wrap">
          <span className="admin-login-form-eyebrow">STAFF ACCESS</span>
          <h2 id="admin-login-title">Welcome back</h2>
          <p className="admin-login-form-intro">Sign in to the Well Educated Foundation admin portal.</p>

          <form className="admin-login-form" onSubmit={handleSubmit}>
            <label className="admin-login-field">
              <span>Work email</span>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@welleducated.org"
                autoComplete="username"
                required
              />
            </label>

            <label className="admin-login-field">
              <span>Password</span>
              <span className="admin-login-password-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
                <button
                  className="admin-login-password-toggle"
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>

            <label className="admin-login-remember">
              <input type="checkbox" name="remember" />
              <span>Keep me signed in</span>
            </label>

            <button className="admin-login-submit" type="submit" disabled={submitting}>
              <span>{submitting ? 'Signing in...' : 'Sign in'}</span>
              {!submitting && <ArrowRight size={18} aria-hidden="true" />}
            </button>

            {notice && <p className="admin-login-notice" role="status">{notice}</p>}
          </form>

          <div className="admin-login-form-footer">
            <span className="admin-login-footer-mark"><Leaf size={15} aria-hidden="true" /></span>
            Well Educated Foundation · NGO Management Portal
          </div>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;