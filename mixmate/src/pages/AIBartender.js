import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase/client';
import { useSession } from '../supabase/SessionContext';
import { FaRobot, FaPaperPlane } from 'react-icons/fa';

const OPENAI_KEY = process.env.REACT_APP_OPENAI_KEY;
const OPENAI_MODEL = "gpt-3.5-turbo"; // customizable

export default function AIBartender() {
  const { user } = useSession();
  const [q, setQ] = useState('');
  const [messages, setMessages] = useState([]);
  const inputRef = useRef();

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(16);
      setMessages(data || []);
    };
    fetch();
  }, [user]);

  async function sendQuestion(e) {
    e.preventDefault();
    if (!q.trim() || !user) return;
    setMessages(msgs => [...msgs, { question: q, answer: "...", id: Date.now() }]);
    setQ('');
    // Save user Q to supabase
    let answer = "Sorry, AI bartender is currently unavailable.";
    if (OPENAI_KEY) {
      try {
        const body = {
          model: OPENAI_MODEL,
          messages: [{ role: "user", content: q }],
        };
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_KEY}`,
          },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        answer = data.choices?.[0]?.message?.content?.trim() || "No answer provided.";
      } catch (e) {
        answer = "AI error.";
      }
    }
    setMessages(msgs =>
      msgs.map((m, i) => (i === msgs.length - 1 ? { ...m, answer } : m))
    );
    // Save to Supabase
    await supabase.from('chat_history').insert([
      { user_id: user.id, question: q, answer }
    ]);
  }

  if (!user) return <div className="card-desc">Log in to use the AI Bartender!</div>;

  return (
    <div>
      <div className="section-header">
        <FaRobot style={{ marginRight: 10, color: "var(--accent)" }} /> AI Bartender
      </div>
      <div style={{ maxWidth: 470 }}>
        <div className="card-desc" style={{ marginBottom: 15 }}>Ask the AI Bartender a drink question. Examples:</div>
        <ul style={{ marginBottom: 13, marginLeft: 20 }}>
          <li>What cocktails can I make with rum and lime?</li>
          <li>What is a refreshing vodka drink?</li>
          <li>How do I make an old fashioned?</li>
        </ul>
        <form onSubmit={sendQuestion} style={{ display: "flex", gap: 8 }}>
          <input
            ref={inputRef}
            type="text"
            value={q}
            onChange={e => setQ(e.target.value)}
            className="liquor-card"
            style={{ flex: 1, minWidth: 60 }}
            placeholder="Ask a cocktail question..."
            aria-label="Ask question"
          />
          <button className="card-btn" type="submit" disabled={!q.trim()} title="Send" style={{ display: "flex", alignItems: "center" }}>
            <FaPaperPlane />
          </button>
        </form>
        <div>
          {messages.map((m, idx) =>
            <div key={idx} className="liquor-card" style={{ margin: "12px 0" }}>
              <div style={{ fontWeight: 600, color: "var(--primary)" }}>Q: {m.question}</div>
              <div style={{ marginTop: 3, color: "var(--accent)" }}>A: {m.answer}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
