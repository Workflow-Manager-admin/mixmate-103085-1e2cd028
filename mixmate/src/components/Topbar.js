import React from 'react';
import { FaBars, FaUserCircle } from 'react-icons/fa';
import { supabase } from '../supabase/client';
import { useSession } from '../supabase/SessionContext';

// PUBLIC_INTERFACE
export default function Topbar({ onMenu }) {
  const { user } = useSession();

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.reload();
  }

  async function handleLogin() {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  }

  return (
    <header className="topbar">
      <button className="burger" onClick={onMenu} aria-label="Menu">
        <FaBars />
      </button>
      <div>
        <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>MixMate</span>
      </div>
      <div className="user">
        {user ? (
          <>
            <FaUserCircle size={24} color="var(--primary)" />
            <span style={{ fontWeight: 500 }}>
              {user.email}
            </span>
            <button className="btn-auth" onClick={handleLogout}>Log Out</button>
          </>
        ) : (
          <button className="btn-auth" onClick={handleLogin}>Log in</button>
        )}
      </div>
    </header>
  );
}
