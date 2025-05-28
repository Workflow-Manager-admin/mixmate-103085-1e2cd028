import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Explore from './pages/Explore';
import Generator from './pages/Generator';
import Favorites from './pages/Favorites';
import ShoppingList from './pages/ShoppingList';
import Trending from './pages/Trending';
import AIBartender from './pages/AIBartender';
import LiquorPairings from './pages/LiquorPairings';
import { SessionContextProvider } from './supabase/SessionContext';
import './App.css';

// PUBLIC_INTERFACE
function App() {
  // Sidebar collapse for mobile menu
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SessionContextProvider>
      <Router>
        <div className="mixmate-app">
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
          <div className="main-content">
            <Topbar onMenu={() => setSidebarOpen((open) => !open)} />
            <main className="mixmate-main">
              <Routes>
                <Route path="/" element={<Navigate to="/explore" />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/generator" element={<Generator />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/shopping-list" element={<ShoppingList />} />
                <Route path="/trending" element={<Trending />} />
                <Route path="/pairings" element={<LiquorPairings />} />
                <Route path="/ai-bartender" element={<AIBartender />} />
                <Route path="*" element={<Navigate to="/explore" />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </SessionContextProvider>
  );
}

export default App;
