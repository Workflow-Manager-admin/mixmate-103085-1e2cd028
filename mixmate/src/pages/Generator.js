import React, { useState } from 'react';
import { supabase } from '../supabase/client';

const FILTERS = [
  { name: 'All', value: null },
  { name: 'Refreshing', value: 'refreshing' },
  { name: 'Strong', value: 'strong' },
  { name: 'Sweet', value: 'sweet' },
  { name: 'Classic', value: 'classic' }
];

export default function Generator() {
  const [liquor, setLiquor] = useState('');
  const [filter, setFilter] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleGenerate(e) {
    e.preventDefault();
    setLoading(true);
    let query = supabase.from('cocktails').select('*');
    if (liquor?.trim()) query = query.contains('liquors', [liquor]);
    if (filter) query = query.contains('tags', [filter]);
    const { data, error } = await query.limit(5);
    setRecipes(data || []);
    setLoading(false);
  }

  return (
    <div>
      <div className="section-header">Cocktail Generator</div>
      <form onSubmit={handleGenerate} style={{ display: "flex", gap: 14, marginBottom: 18, alignItems: "end", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontWeight: 500, marginBottom: 5 }}>Liquor type</div>
          <input
            type="text"
            className="liquor-card"
            placeholder="e.g., Vodka, Gin..."
            value={liquor}
            onChange={e => setLiquor(e.target.value)}
            style={{ minWidth: 120 }}
          />
        </div>
        <div>
          <div style={{ fontWeight: 500, marginBottom: 5 }}>Filter</div>
          <select
            className="liquor-card"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{ minWidth: 100 }}
          >
            {FILTERS.map(f => <option key={f.name} value={f.value || ''}>{f.name}</option>)}
          </select>
        </div>
        <button className="card-btn" type="submit" style={{ alignSelf: "flex-end", minWidth: 113 }}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>
      <div className="card-row">
        {recipes.map(r =>
          <div key={r.id} className="cocktail-card">
            <img src={r.image_url} alt={r.name} className="card-img" />
            <div className="card-title">{r.name}</div>
            <div className="card-desc">{r.description}</div>
            <details>
              <summary className="card-btn" style={{ display: 'inline-block', margin: "7px 0 0 0" }}>Recipe</summary>
              <div style={{ margin: '8px 0' }}>
                <div><strong>Ingredients:</strong><br />{r.ingredients}</div>
                <div style={{ marginTop: 5 }}><strong>Steps:</strong><br />{r.steps}</div>
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
