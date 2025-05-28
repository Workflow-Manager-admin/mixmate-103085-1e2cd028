import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase/client';
import { FaFireAlt } from 'react-icons/fa';

export default function Trending() {
  const [trending, setTrending] = useState([]);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    // Trending cocktails by like_count
    const run = async () => {
      const { data } = await supabase
        .from('cocktails')
        .select('*')
        .order('like_count', { ascending: false })
        .limit(8);
      setTrending(data || []);
    };
    run();
    // Realtime: listen to likes
    const subscription = supabase.channel('public:cocktails')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'cocktails' }, payload => {
        setTrending(x => x.map(c =>
          c.id === payload.new.id ? { ...c, like_count: payload.new.like_count } : c
        ));
      })
      .subscribe();
    return () => { supabase.removeChannel(subscription); };
  }, []);

  useEffect(() => {
    // Recent cocktails (by created_at)
    const getRecent = async () => {
      const { data } = await supabase
        .from('cocktails')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);
      setRecent(data || []);
    };
    getRecent();

    // Live feed for inserts
    const subscription = supabase.channel('public:cocktails')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'cocktails' }, payload => {
        setRecent(x => [{ ...payload.new }, ...x].slice(0, 6));
      })
      .subscribe();
    return () => { supabase.removeChannel(subscription); };
  }, []);

  return (
    <div>
      <div className="section-header">
        <FaFireAlt style={{ marginRight: 7, verticalAlign: "-2px", color: "var(--accent)" }} /> Trending Cocktails
      </div>
      <div className="carousel-row">
        {trending.map(c => (
          <div key={c.id} className="cocktail-card">
            <img src={c.image_url} alt={c.name} className="card-img" />
            <div className="card-title">{c.name}</div>
            <div className="card-desc">{c.description}</div>
            <div style={{ color: "var(--accent)", fontWeight: 600, fontSize: ".98em" }}>
              {c.like_count} ❤️
            </div>
          </div>
        ))}
      </div>
      <div className="section-header" style={{ fontSize: "1.28rem" }}>Recent Additions</div>
      <div className="carousel-row">
        {recent.map(c => (
          <div key={c.id} className="cocktail-card">
            <img src={c.image_url} alt={c.name} className="card-img" />
            <div className="card-title">{c.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
