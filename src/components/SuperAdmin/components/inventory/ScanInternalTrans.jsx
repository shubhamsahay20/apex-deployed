import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ScanInternalTrans = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([
        { id: 1, article: "301", total: 7665, scanned: 0 },
        { id: 2, article: "596", total: 987, scanned: 1 },
    ]);

    const updateScanned = (id, change) => {
        setProducts((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        scanned: Math.max(0, Math.min(item.total, item.scanned + change)),
                    }
                    : item
            )
        );
    };

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            <h2 className="text-lg font-semibold text-gray-800">Scan Internal Transfers</h2>

            <div className="bg-white p-4 border rounded-md">
                <div className="mb-4 font-medium text-sm text-gray-700">
                    WH01/OUT/452167
                </div>
                <table className="w-full text-sm text-left">
                    <thead className="text-gray-600 bg-gray-100">
                        <tr>
                            <th className="py-2 px-4">Article Number</th>
                            <th className="py-2 px-4">No. Of Cartons</th>
                            <th className="py-2 px-4"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((item) => (
                            <tr key={item.id} className="border-t">
                                <td className="py-2 px-4">{item.article}</td>
                                <td className="py-2 px-4">
                                    <span className="text-gray-500">
                                        {item.scanned}/<span className="font-semibold">{item.total}</span>
                                    </span>
                                </td>
                                <td className="py-2 px-4">
                                    <div className="flex items-center border rounded w-fit overflow-hidden">
                                        <button
                                            onClick={() => updateScanned(item.id, -1)}
                                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                                        >
                                            –
                                        </button>
                                        <span className="px-3">{item.scanned}</span>
                                        <button
                                            onClick={() => updateScanned(item.id, 1)}
                                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                                        >
                                            +
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex gap-3 mt-6">
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                        onClick={() => navigate("/inventory/internal-scan-details")} // <- update with your route
                    >
                        Validate
                    </button>
                    <button className="border px-4 py-2 rounded text-sm">Add Product</button>
                    <button className="border px-4 py-2 rounded text-sm">PDF</button>
                </div>
            </div>
        </div>
    );
};

export default ScanInternalTrans;
