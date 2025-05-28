import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase/client';
import { useSession } from '../supabase/SessionContext';
import { FaStar } from 'react-icons/fa';

export default function Favorites() {
  const { user } = useSession();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!user) return setFavorites([]);
    const fetchFavs = async () => {
      const { data } = await supabase.from('favorites').select('*,cocktails(*)').eq('user_id', user.id);
      setFavorites((data || []).map(r => r.cocktails));
    };
    fetchFavs();
  }, [user]);

  async function removeFavorite(id) {
    await supabase.from('favorites').delete().match({ user_id: user.id, cocktail_id: id });
    setFavorites(favorites => favorites.filter(f => f.id !== id));
  }

  if (!user) {
    return <div className="card-desc">Please log in to save and view favorites!</div>;
  }

  return (
    <div>
      <div className="section-header">Your Favorite Cocktails</div>
      <div className="card-row">
        {favorites.length === 0 && <div className="card-desc">No favorites yet.</div>}
        {favorites.map(f =>
          <div key={f.id} className="cocktail-card">
            <img src={f.image_url} alt={f.name} className="card-img" />
            <div className="card-title">{f.name}</div>
            <div className="card-desc">{f.description}</div>
            <button className="favorite-btn" title="Remove" onClick={() => removeFavorite(f.id)}>
              <FaStar style={{ color: "#e2761a" }} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
