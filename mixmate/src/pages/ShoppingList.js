import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase/client';
import { useSession } from '../supabase/SessionContext';
import { FaTrash } from 'react-icons/fa';

export default function ShoppingList() {
  const { user } = useSession();
  const [items, setItems] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (!user) return setItems([]);
    const fetchItems = async () => {
      const { data } = await supabase.from('shopping_list').select('*').eq('user_id', user.id).order('created_at', { ascending: true });
      setItems(data || []);
    };
    fetchItems();
  }, [user]);

  async function addItem(e) {
    e.preventDefault();
    if (!input.trim()) return;
    const { error } = await supabase.from('shopping_list').insert([{ user_id: user.id, item: input.trim() }]);
    if (!error) setItems([...items, { user_id: user.id, item: input.trim() }]);
    setInput('');
  }

  async function removeItem(id) {
    await supabase.from('shopping_list').delete().match({ id });
    setItems(items => items.filter(it => it.id !== id));
  }

  if (!user) return <div className="card-desc">Log in to manage your shopping list.</div>;

  return (
    <div>
      <div className="section-header">Shopping List</div>
      <form onSubmit={addItem} style={{ marginBottom: 16, display: "flex", gap: 10 }}>
        <input
          type="text"
          placeholder="Add ingredient..."
          className="liquor-card"
          style={{ width: 220, fontSize: "1rem" }}
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button className="card-btn" type="submit">Add</button>
      </form>
      <ul>
        {items.map(it =>
          <li key={it.id} className="liquor-card" style={{ margin: "6px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{it.item}</span>
            <button title="Remove" className="favorite-btn" style={{ position: "relative", right: 0 }} onClick={() => removeItem(it.id)}>
              <FaTrash />
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}
