import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (signInError) setError(signInError.message);
    // On success, the session listener in useAdminSession swaps this form out.
  };

  return (
    <div className="admin-shell admin-shell--centered">
      <form className="admin-login" onSubmit={onSubmit}>
        <div className="admin-login__title mono">ADMIN LOGIN</div>
        <label className="admin-field">
          <span className="mono">EMAIL</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
        </label>
        <label className="admin-field">
          <span className="mono">PASSWORD</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <p className="admin-login__error mono">{error}</p>}
        <button className="admin-btn" type="submit" disabled={submitting}>
          {submitting ? "SIGNING IN…" : "SIGN IN"}
        </button>
      </form>
    </div>
  );
}
