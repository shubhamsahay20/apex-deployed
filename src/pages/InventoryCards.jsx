import React from "react";

const InventoryCards = ({ cards }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white p-4 rounded-md shadow-sm border"
        >
          <p className={`text-xs font-medium ${card.color}`}>{card.label}</p>
          <p className="text-xl font-semibold text-gray-800 mt-1">{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default InventoryCards;
