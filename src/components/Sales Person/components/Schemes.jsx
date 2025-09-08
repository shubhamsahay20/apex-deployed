import React, { useState } from "react";
import { CiCalendarDate } from "react-icons/ci";
import { IoFilter } from "react-icons/io5";
import { FiTrash2 } from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Chart Data
const chartData = [
  { month: "Jan", monthly: 3.8, applied: 2.1 },
  { month: "Feb", monthly: 5.3, applied: 4.2 },
  { month: "Mar", monthly: 4.8, applied: 3.3 },
  { month: "Apr", monthly: 2.6, applied: 1.9 },
  { month: "May", monthly: 4.3, applied: 2.9 },
  { month: "June", monthly: 2.2, applied: 1.3 },
  { month: "July", monthly: 3.7, applied: 2.6 },
  { month: "Aug", monthly: 5.2, applied: 4.3 },
  { month: "Sept", monthly: 4.7, applied: 3.1 },
  { month: "Oct", monthly: 2.6, applied: 2.0 },
  { month: "Nov", monthly: 4.2, applied: 3.3 },
  { month: "Dec", monthly: 2.3, applied: 1.2 },
];

// Table Data
const schemeData = [
  { party: "Connect Enterprises", completion: "86%", type: "Norem ipsum dolor sit consect" },
  { party: "SS Enterprises", completion: "65%", type: "Norem ipsum  amet consect" },
  { party: "Geet Enterprises", completion: "74%", type: "Norem ipsum dolor sit consect" },
  { party: "Galaxy Enterprises", completion: "89%", type: "Norem sit amet consect" },
  { party: "Maya Enterprises", completion: "56%", type: "Norem ipsum dolor sit amet" },
  { party: "KK Enterprises", completion: "77%", type: "Norem ipsum dolor" },
];

const SchemeApplicationForm = ({ onBack }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Apply For Scheme</h2>
        <button onClick={onBack} className="text-sm text-blue-600 underline">← Back</button>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <input placeholder="Party Name" className="border px-4 py-2 rounded" value="John Mathew" readOnly />
        <select className="border px-4 py-2 rounded">
          <option>Norem ipsum dolor sit amet</option>
        </select>
        <select className="border px-4 py-2 rounded">
          <option>Norem ipsum dolor sit amet</option>
        </select>

        <select className="border px-4 py-2 rounded">
          <option>003</option>
        </select>
        <input placeholder="Quantity" className="border px-4 py-2 rounded" value="554" />
        <input placeholder="Add Size" className="border px-4 py-2 rounded" />
        <input placeholder="Add Products Colors" className="border px-4 py-2 rounded" />
        <input placeholder="Add Material Type" className="border px-4 py-2 rounded" />
      </div>

      {/* Articles List */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-md font-semibold">Articles List</h3>
        <div className="flex gap-2">
          <input type="text" placeholder="Search Article, order" className="border px-3 py-1 rounded" />
          <button className="border px-3 py-1 rounded">Today</button>
          <button className="bg-blue-500 text-white px-4 py-1 rounded">Add Articles</button>
        </div>
      </div>

      <table className="w-full border border-gray-200 text-sm mb-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Article</th>
            <th className="px-4 py-2 text-left">Size</th>
            <th className="px-4 py-2 text-left">Color</th>
            <th className="px-4 py-2 text-left">Soft/Hard</th>
            <th className="px-4 py-2 text-left">A/B</th>
            <th className="px-4 py-2 text-left">Quantity</th>
            <th className="px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {[301, 348, 369].map((article, i) => (
            <tr key={i} className="border-t">
              <td className="px-4 py-2">{article}</td>
              <td className="px-4 py-2">6X10</td>
              <td className="px-4 py-2">BK</td>
              <td className="px-4 py-2">S/H</td>
              <td className="px-4 py-2">{i === 2 ? 'B' : 'A'}</td>
              <td className="px-4 py-2 flex items-center gap-2">
                <button className="border px-2">−</button>
                <span>{i + 1}</span>
                <button className="border px-2">+</button>
              </td>
              <td className="px-4 py-2 text-red-500 cursor-pointer">🗑</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="bg-blue-500 text-white px-6 py-2 rounded">Apply for Scheme</button>
    </div>
  );
};

const ActiveSchemesOrder = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      {showForm ? (
        <SchemeApplicationForm onBack={() => setShowForm(false)} />
      ) : (
        <>
          {/* === Top Heading === */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              <h2 className="text-lg font-semibold">Active Schemes Order</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Apply For Scheme
              </button>
              <div className="flex items-center gap-2  rounded-md text-sm hover:bg-gray-50 transition text-gray-700">
              <CiCalendarDate  size={25}/>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition text-gray-700">
                            <IoFilter /> Filters
                          </button>
            </div>
          </div>

          {/* === Table Section === */}
          <div className="overflow-x-auto mb-8">
            <table className="min-w-full border border-gray-300 border-collapse">
              <thead className="bg-blue-50 text-gray-900">
                <tr className="text-sm font-semibold">
                  <th className="px-6 py-3 border border-gray-300 text-left">Party Name</th>
                  <th className="px-6 py-3 border border-gray-300 text-left">
                    Scheme Completion
                    <div className="text-xs font-normal text-gray-500">(In Percentage %)</div>
                  </th>
                  <th className="px-6 py-3 border border-gray-300 text-left">Scheme Type</th>
                </tr>
              </thead>
              <tbody>
                {schemeData.map((item, index) => (
                  <tr key={index} className="text-sm hover:bg-gray-50">
                    <td className="px-6 py-4">{item.party}</td>
                    <td className="px-6 py-4 border-l border-r border-gray-200 text-blue-600 font-semibold">
                      {item.completion}
                    </td>
                    <td className="px-6 py-4 border-r border-gray-200">{item.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* === Chart Section === */}
          <div className="w-[60%] ml-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                <h2 className="text-lg font-semibold">Scheme Orders</h2>
              </div>
              <div>
                <button className="p-2 border rounded-md text-gray-600 hover:bg-gray-100">
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>

            <div className="flex items-start gap-4 mb-4">
              <img
                src="https://via.placeholder.com/60"
                alt="Scheme icon"
                className="w-14 h-14 rounded-lg object-cover"
              />
              <div>
                <p className="font-semibold text-sm">Lorem ipsum dolor sit amet.</p>
                <p className="text-gray-500 text-sm">
                  Porem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                  vulpul aliquet odio mattis. Class aptent taciti...
                </p>
              </div>
            </div>

            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={30}>
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(val) => `${val}cr`} />
                  <Tooltip />
                  <Legend verticalAlign="top" />
                  <Bar dataKey="monthly" fill="#cfe2ff" name="Monthly Schemes" />
                  <Bar dataKey="applied" fill="#1d4ed8" name="Applied Schemes" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ActiveSchemesOrder;
