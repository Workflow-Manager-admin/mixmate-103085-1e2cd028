import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaGlassCheers, FaMagic, FaStar, FaShoppingBasket, FaFireAlt, FaRobot, FaUtensils } from 'react-icons/fa';

const links = [
  { to: '/explore', icon: <FaGlassCheers />, label: 'Explore' },
  { to: '/generator', icon: <FaMagic />, label: 'Generator' },
  { to: '/favorites', icon: <FaStar />, label: 'Favorites' },
  { to: '/shopping-list', icon: <FaShoppingBasket />, label: 'Shopping List' },
  { to: '/trending', icon: <FaFireAlt />, label: 'Trending' },
  { to: '/pairings', icon: <FaUtensils />, label: 'Pairings' },
  { to: '/ai-bartender', icon: <FaRobot />, label: 'AI Bartender' }
];

export default function Sidebar({ open, setOpen }) {
  return (
    <aside className={`sidebar${open ? ' open' : ''}`}>
      <div className="logo-bar">
        <span style={{ color: 'var(--accent)', fontSize: '1.5em', marginRight: 3 }}>*</span> MixMate
      </div>
      <nav className="sidebar-nav">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
            onClick={() => setOpen?.(false)}
            end
          >
            {link.icon} {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        © {new Date().getFullYear()} MixMate
      </div>
    </aside>
  );
}
