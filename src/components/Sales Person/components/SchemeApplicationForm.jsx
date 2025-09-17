export const SchemeApplicationForm = ({ onBack }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Apply For Scheme</h2>
        <button onClick={onBack} className="text-sm text-blue-600 underline">
          ← Back
        </button>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <input
          placeholder="Party Name"
          className="border px-4 py-2 rounded"
          value="John Mathew"
          readOnly
        />
        <select className="border px-4 py-2 rounded">
          <option>Norem ipsum dolor sit amet</option>
        </select>
        <select className="border px-4 py-2 rounded">
          <option>Norem ipsum dolor sit amet</option>
        </select>

        <select className="border px-4 py-2 rounded">
          <option>003</option>
        </select>
        <input
          placeholder="Quantity"
          className="border px-4 py-2 rounded"
          value="554"
        />
        <input placeholder="Add Size" className="border px-4 py-2 rounded" />
        <input
          placeholder="Add Products Colors"
          className="border px-4 py-2 rounded"
        />
        <input
          placeholder="Add Material Type"
          className="border px-4 py-2 rounded"
        />
      </div>

      {/* Articles List */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-md font-semibold">Articles List</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search Article, order"
            className="border px-3 py-1 rounded"
          />
          <button className="border px-3 py-1 rounded">Today</button>
          <button className="bg-blue-500 text-white px-4 py-1 rounded">
            Add Articles
          </button>
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

      <button className="bg-blue-500 text-white px-6 py-2 rounded">
        Apply for Scheme
      </button>
    </div>
  );
};