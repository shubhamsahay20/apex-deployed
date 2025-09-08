import React, { useState } from "react";
import InventoryCards from "./InventoryCards";

const cards = [
    { label: "Cartons Available", value: "1,114", color: "text-blue-600" },
    { label: "Today's Production", value: "124", color: "text-indigo-600" },
    { label: "Today's Orders", value: "2,868", color: "text-orange-500" },
    { label: "Today's Sale", value: "1,442", color: "text-green-600" },
];

const ProductList = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);

    const inventoryData = [
        {
            date: "11/12/22",
            article: "301",
            size: "6X10",
            color: "BK",
            softHard: "S/H",
            quantity: 20,
            warehouse: "Warehouse 01",
            availability: "In-stock",
            image: "https://via.placeholder.com/120"
        },
        {
            date: "9/1/23",
            article: "301",
            size: "8X10",
            color: "BK",
            softHard: "S/H",
            quantity: 84,
            warehouse: "Warehouse 02",
            availability: "In-stock",
            image: "https://via.placeholder.com/120"
        }
    ];

    const openDetailsModal = (article) => {
        setSelectedArticle(article);
    };

    return (
        <div className="p-4 space-y-6 bg-gray-100 min-h-screen">
            <h2 className="text-lg font-semibold text-gray-800">Inventory</h2>

            <InventoryCards cards={cards} />

            <div className="bg-white p-4 rounded-md shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-700">Products List</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                        <input type="text" placeholder="Search Article, order" className="text-sm px-3 py-1.5 border rounded-md" />
                        <button className="text-sm border px-3 py-1.5 rounded-md">Today</button>
                        <button onClick={() => setShowModal(true)} className="text-sm border px-3 py-1.5 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition">Add Article</button>
                        <button className="text-sm border px-3 py-1.5 rounded-md">Export</button>
                    </div>
                </div>

                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4 lg:pl-64">
                        <div className="bg-white w-full max-w-lg rounded-xl p-6 shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold text-gray-800">Add New Article</h3>
                                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-800 text-lg">✕</button>
                            </div>
                            <form className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input type="text" placeholder="Article Name" className="w-full border px-4 py-2 rounded-md text-sm" />
                                    <input type="text" placeholder="Size" className="w-full border px-4 py-2 rounded-md text-sm" />
                                    <input type="text" placeholder="Color" className="w-full border px-4 py-2 rounded-md text-sm" />
                                    <input type="text" placeholder="Soft/Hard" className="w-full border px-4 py-2 rounded-md text-sm" />
                                    <input type="number" placeholder="Quantity" className="w-full border px-4 py-2 rounded-md text-sm" />
                                    <input type="text" placeholder="Warehouse" className="w-full border px-4 py-2 rounded-md text-sm" />
                                </div>
                                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition">Add Article</button>
                            </form>
                        </div>
                    </div>
                )}

                <div className="overflow-auto">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b text-gray-600">
                                <th className="p-2">Date</th>
                                <th>Article</th>
                                <th>Size</th>
                                <th>Color</th>
                                <th>Soft/Hard</th>
                                <th>Quantity</th>
                                <th>Warehouse</th>
                                <th>Availability</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventoryData.map((row, idx) => (
                                <tr key={idx} className="border-t hover:bg-gray-50 cursor-pointer" onClick={() => openDetailsModal(row)}>
                                    <td className="p-2">{row.date}</td>
                                    <td>{row.article}</td>
                                    <td>{row.size}</td>
                                    <td className="font-semibold">{row.color}</td>
                                    <td>{row.softHard}</td>
                                    <td>{row.quantity}</td>
                                    <td className="text-blue-600 font-medium">{row.warehouse}</td>
                                    <td className={row.availability === "In-stock" ? "text-green-600" : "text-red-500"}>{row.availability}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedArticle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm p-14 lg:pl-64">
                    <div className="bg-white  rounded-xl p-6 shadow-xl overflow-y-auto max-h-[80vh]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-800">Article Details</h3>
                            <button onClick={() => setSelectedArticle(null)} className="text-gray-400 hover:text-gray-700">✕</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="border rounded-lg overflow-hidden">
                                <img src={selectedArticle.image} alt="Article" className="w-full h-full object-cover" />
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                                    <p><span className="font-semibold">Article:</span> {selectedArticle.article}</p>
                                    <p><span className="font-semibold">Size:</span> {selectedArticle.size}</p>
                                    <p><span className="font-semibold">Color:</span> {selectedArticle.color}</p>
                                    <p><span className="font-semibold">Soft/Hard:</span> {selectedArticle.softHard}</p>
                                    <p><span className="font-semibold">Stock Alert:</span> 20</p>
                                    <p><span className="font-semibold">View Logs:</span> <span className="text-blue-600 underline cursor-pointer">Inventory Logs</span></p>
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-gray-700 mb-1">STOCK</p>
                                    <table className="text-sm w-full border">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="p-2 border">Location</th>
                                                <th className="p-2 border">Quantity</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="p-2 border">Factory 46</td>
                                                <td className="p-2 border">32</td>
                                            </tr>
                                            <tr>
                                                <td className="p-2 border">Warehouse 02</td>
                                                <td className="p-2 border">18</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm font-semibold text-gray-700 mb-4">Inventory Logs</p>
                            <div className="space-y-4">
                                {[1, 2].map((log, index) => (
                                    <div key={index} className="flex items-start gap-4">
                                        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="user" className="w-8 h-8 rounded-full" />
                                        <div className="text-sm text-gray-700 space-y-0.5">
                                            <p className="font-medium text-gray-900">John Mathew <span className="text-xs text-gray-500">• 12 Dec 2022</span></p>
                                            <p>Lorem ipsum <span className="text-blue-600 underline">dolor sit amet</span>, consectetur elit.</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductList;
