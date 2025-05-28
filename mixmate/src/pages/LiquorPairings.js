import React from 'react';

const PAIRINGS = [
  { drink: "Red Wine", food: "Steak" },
  { drink: "White Wine", food: "Seafood" },
  { drink: "Whiskey", food: "Grilled Meat" },
  { drink: "Gin", food: "Salads" },
  { drink: "Rum", food: "Barbecue" },
  { drink: "Vodka", food: "Smoked Salmon" },
  { drink: "Tequila", food: "Tacos" }
];

export default function LiquorPairings() {
  return (
    <div>
      <div className="section-header">Liquor Pairings</div>
      <div className="card-row">
        {PAIRINGS.map(pair => (
          <div key={pair.drink} className="pairing-card">
            <div className="card-title">
              <span style={{ color: "var(--accent)", marginRight: 8 }}>{pair.drink}</span>
              <span style={{ color: "var(--primary)" }}>+ {pair.food}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="card-desc" style={{ marginTop: 18 }}>
        Pairing suggestions help make the most of your MixMate experience!
      </div>
    </div>
  );
}
