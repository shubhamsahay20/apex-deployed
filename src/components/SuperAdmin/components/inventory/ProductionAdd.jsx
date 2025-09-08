import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

const ProductionAdd = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("Pending");
    const [deleteId, setDeleteId] = useState(null);
    const [products, setProducts] = useState([
        {
            id: 1,
            article: "301",
            saleRef: "SO/301652",
            sourcelocation: "delhi",
            destination: "delhi",
            warehouse: "Warehouse 01",

            size: "6X10",
            color: "BK",
            stock: 83,
            quantity: 1,
        },



    ]);

    const updateQuantity = (id, change) => {
        setProducts((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + change) }
                    : item
            )
        );
    };

    const confirmDelete = (id) => {
        setDeleteId(id);
    };

    const handleDelete = () => {
        setProducts((prev) => prev.filter((item) => item.id !== deleteId));
        setDeleteId(null);
    };

    const handleCreateLabels = () => {
        navigate("/inventory/product-create-lebel", { state });
    };

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Add Product  </h2>
                <div className="flex gap-2">
                    {["In-progress ", "Done"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-1.5 rounded-md text-sm border ${activeTab === tab
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-gray-700 border-gray-300"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="text-sm font-medium">Date</label>
                    <input
                        type="text"
                        value={state?.date || ""}
                        className="border px-4 py-2 rounded-md text-sm w-full"
                    />
                </div>
                {/* <div>
                    <label className="text-sm font-medium"></label>
                    <input
                        type="text"
                        value={state?.article || ""}
                        className="border px-4 py-2 rounded-md text-sm w-full"
                    />
                </div> */}
                <div>
                    <label className="text-sm font-medium">Factory </label>
                    <select
                        value={state?.warehouse || ""}

                        className="border px-4 py-2 rounded-md text-sm  w-full"
                    >
                        <option value="Warehouse 01">Location 1</option>
                        <option value="Warehouse 02">Location 02</option>
                    </select>
                </div>

                <div>
                    <label className="text-sm font-medium">Deliverable Quantity</label>
                    <input
                        type="number"
                        placeholder="Deliverable Quantity"
                        className="border px-4 py-2 rounded-md text-sm w-full"
                    />
                </div>


            </div>

            {/* <p className="text-sm text-blue-600 font-medium mt-2">
                Sale Order Reference Number: <span className="underline cursor-pointer">{state?.saleRef}</span>
            </p> */}

            <div className="bg-white border rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Selected Products For Delivery</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border">
                        <thead className="bg-gray-100 text-gray-600">
                            <tr>
                                <th className="px-3 py-2 text-left">
                                    <input type="checkbox" className="mr-2" />Articles
                                </th>
                                <th>Sales Reference No.</th>
                                <th>Source Location</th>
                                <th>Destination WareHOuse </th>
                                <th>Size</th>
                                <th>Color</th>
                                <th>Soft/Hard</th>
                                <th>Stock</th>
                                <th>Quantity</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((prod) => (
                                <tr key={prod.id} className="border-t">
                                    <td className="px-3 py-2">
                                        <input type="checkbox" className="mr-2" />
                                        {prod.article}
                                    </td>
                                    <td>{prod.saleRef}</td>
                                    <td>{prod.sourcelocation}</td>
                                    <td>{prod.destination}</td>
                                    <td>{prod.warehouse}</td>

                                    <td>{prod.warehouse}</td>
                                    <td>{prod.size}</td>
                                    <td>{prod.color}</td>
                                    <td>{prod.stock}</td>
                                    <td>
                                        <div className="flex items-center border rounded overflow-hidden w-fit">
                                            <button
                                                className="px-2 py-1 bg-gray-200 hover:bg-gray-300"
                                                onClick={() => updateQuantity(prod.id, -1)}
                                            >–</button>
                                            <span className="px-3">{prod.quantity}</span>
                                            <button
                                                className="px-2 py-1 bg-gray-200 hover:bg-gray-300"
                                                onClick={() => updateQuantity(prod.id, 1)}
                                            >+</button>
                                        </div>
                                    </td>
                                    <td>
                                        <button
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => confirmDelete(prod.id)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex gap-3 mt-6">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
                        Submit
                    </button>
                    <button
                        className="border px-4 py-2 rounded text-sm"
                        onClick={handleCreateLabels}
                    >
                        Create Labels
                    </button>
                    <button className="border px-4 py-2 rounded text-sm">PDF</button>
                </div>
            </div>

            {deleteId !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-md w-96 text-center">
                        <div className="bg-red-100 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
                            <FaTrash className="text-red-500 text-2xl" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Partially Cancel Delivery Orders</h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Are you sure you want to partially cancel the Delivery Orders <strong>{deleteId}</strong>?
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100"
                                onClick={() => setDeleteId(null)}
                            >
                                No
                            </button>
                            <button
                                className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                                onClick={handleDelete}
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductionAdd;
