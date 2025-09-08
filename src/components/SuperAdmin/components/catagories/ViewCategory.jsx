import React from 'react';

const CreateWarehouseForm = () => {
  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-md shadow">
      <h2 className="text-xl font-semibold mb-6">Create Warehouse/Factory</h2>
      <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Warehouse/Factory Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Warehouse/Factory Name
          </label>
          <input
            type="text"
            placeholder="Enter Warehouse/Factory Name"
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="text"
            placeholder="990 32 64 970"
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter Email"
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* ZIP Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ZIP Code
          </label>
          <input
            type="text"
            placeholder="Enter ZIP Code"
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <select className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Choose Location</option>
            <option>Location 1</option>
            <option>Location 2</option>
            <option>Location 3</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex items-end pt-2">
          <button
            type="submit"
            className="bg-[#007CF0] text-white px-5 py-2 rounded hover:bg-blue-600 transition text-sm"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateWarehouseForm;
