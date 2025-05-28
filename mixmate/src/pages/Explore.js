import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase/client';
import { useSession } from '../supabase/SessionContext';

const LIQUORS = [
  { name: "Whiskey", img: "https://cdn.jsdelivr.net/gh/kaviapublic/cocktail-assets/whiskey.png" },
  { name: "Gin", img: "https://cdn.jsdelivr.net/gh/kaviapublic/cocktail-assets/gin.png" },
  { name: "Tequila", img: "https://cdn.jsdelivr.net/gh/kaviapublic/cocktail-assets/tequila.png" },
  { name: "Rum", img: "https://cdn.jsdelivr.net/gh/kaviapublic/cocktail-assets/rum.png" },
  { name: "Vodka", img: "https://cdn.jsdelivr.net/gh/kaviapublic/cocktail-assets/vodka.png" },
  { name: "Brandy", img: "https://cdn.jsdelivr.net/gh/kaviapublic/cocktail-assets/brandy.png" },
  { name: "Liqueur", img: "https://cdn.jsdelivr.net/gh/kaviapublic/cocktail-assets/liqueur.png" },
];

export default function Explore() {
  const [selected, setSelected] = useState(LIQUORS[0].name);
  const [info, setInfo] = useState(null);
  const [cocktails, setCocktails] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch liquor detail and cocktails
  useEffect(() => {
    const run = async () => {
      setLoading(true);
      // Liquor info and cocktail suggestions come from Supabase
      const { data: liquorInfo } = await supabase.from('liquors').select('*').eq('name', selected).single();
      const { data: cocktailList } = await supabase.from('cocktails').select('*').contains('liquors', [selected]).limit(5);

      setInfo(liquorInfo);
      setCocktails(cocktailList || []);
      setLoading(false);
    };
    run();
  }, [selected]);

  return (
    <div>
      <div className="section-header">Explore Liquors</div>
      <div className="card-row" style={{ marginBottom: 26, gap: 14 }}>
        {LIQUORS.map(l => (
          <div
            key={l.name}
            className="liquor-card"
            style={{
              border: selected === l.name ? "2.5px solid var(--accent)" : "1px solid #ececec",
              boxShadow: selected === l.name ? "0 3px 18px rgba(249,217,35,0.085)" : "var(--card-shadow)",
              cursor: 'pointer'
            }}
            onClick={() => setSelected(l.name)}
            tabIndex={0}
          >
            <img src={l.img} alt={l.name} className="card-img" />
            <div className="card-title">{l.name}</div>
          </div>
        ))}
      </div>
      {loading ? (
        <div className="card-desc">Loading...</div>
      ) : (
        <>
          {info && (
            <div className="liquor-card" style={{ marginBottom: 24, maxWidth: 350 }}>
              <div className="card-title" style={{ fontSize: "1.28rem" }}>{info.name}</div>
              <div className="card-desc">{info.description}</div>
              <div style={{ margin: "9px 0" }}>
                <div style={{ fontWeight: 600 }}>Recommended Mixers:</div>
                <div style={{ color: 'var(--primary)' }}>
                  {info.mixers}
                </div>
              </div>
            </div>
          )}
          {cocktails.length > 0 && (
            <>
              <div className="section-header" style={{ fontSize: "1.4rem" }}>Cocktail Ideas</div>
              <div className="card-row">
                {cocktails.map(cocktail =>
                  <div key={cocktail.id} className="cocktail-card">
                    <img src={cocktail.image_url} alt={cocktail.name} className="card-img" />
                    <div className="card-title">{cocktail.name}</div>
                    <div className="card-desc">{cocktail.description}</div>
                    <a href="#generator" className="card-btn" style={{ textDecoration: "none" }}>View Recipe</a>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
