import React from "react";
import blueshoes from "../../../public/images/blueshoes.svg"; 
const recommendedItems = [
  {
    sku: "333",
    stock: 60,
    variants: [
      { size: "6*9", color: "Gray", cartons: 12 },
      { size: "8*9", color: "Gray", cartons: 8 },
      { size: "7*8", color: "Gray", cartons: 4 },
      { size: "6*8", color: "Gray", cartons: 10 },
      { size: "9", color: "Gray", cartons: 14 },
      { size: "8", color: "Gray", cartons: 6 },
      { size: "6*7", color: "Gray", cartons: 22 },
    ],
  },
  {
    sku: "346",
    stock: 54,
    variants: [
      { size: "6*9", color: "Gray", cartons: 12 },
      { size: "8*9", color: "Gray", cartons: 8 },
      { size: "7*8", color: "Gray", cartons: 4 },
      { size: "6*8", color: "Gray", cartons: 10 },
      { size: "9", color: "Gray", cartons: 14 },
      { size: "8", color: "Gray", cartons: 6 },
      { size: "6*7", color: "Gray", cartons: 22 },
    ],
  },
];

const RecommendedSection = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Recommended for you</h2>
        <button className="text-sm bg-gray-100 px-2 py-1 rounded-md">Filter</button>
      </div>

      {/* Grid layout for side-by-side cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {recommendedItems.map((item, index) => (
          <div
            key={index}
            className="border p-4 rounded-lg flex flex-col gap-2"
          >
            <div className="flex items-center gap-4">
              <img
                src={blueshoes}
                alt="Product"
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold">{item.sku}</h3>
                  <button className="bg-blue-500 text-white px-2 py-1 rounded text-sm">
                    Buy Now
                  </button>
                </div>
                <p className="text-[10px] text-gray-500 mb-2">
                  In Stock: {item.stock} Cartons
                </p>
                <div className="grid grid-cols-2 gap-1 text-[10px] text-gray-600">
                  {item.variants.map((v, i) => (
                    <div key={i}>
                      {v.size} / {v.color} — {v.cartons} Cartons
                    </div>
                  ))}
                </div>
                <div className="flex justify-end items-center gap-2 mt-2">
                  <button className="text-sm">−</button>
                  <span>1</span>
                  <button className="text-sm">+</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full text-center text-sm text-blue-600 mt-4">
        View All →
      </button>
    </div>
  );
};

export default RecommendedSection;
