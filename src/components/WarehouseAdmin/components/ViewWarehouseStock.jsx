import React from 'react'
import { useLocation } from 'react-router-dom'

const ViewWarehouseStock = () => {
    const {state} = useLocation()
    console.log("location",state);
    
   return (
      <div className="p-6 bg-[#F5F6FA] min-h-screen space-y-6">
        <div className="w-full bg-[#F5F6FA] py-8 px-6">
          <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row justify-between items-start gap-6">
            {/* Warehouse Info Card */}
            <div className="bg-white p-8 rounded-xl shadow-lg w-full space-y-6">
              <h2 className="text-3xl font-bold text-gray-800 border-b pb-4 mb-6">
                Article ( {state.article} )  Details
              </h2>
  
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">

                 <div>
                  <p className="text-sm font-medium text-gray-800">Sales Person</p>
                  <p className="text-base font-semibold">
                    {state.createdBy?.name}
                  </p>
                </div>
              
  
                <div>
                  <p className="text-sm font-medium text-gray-800">Category Code</p>
                  <p className="text-base font-semibold">
                    {state.categoryCode}
                  </p>
                </div>
  
                <div>
                  <p className="text-sm font-medium text-gray-800">Color</p>
                  <p className="text-base font-semibold">
                    {state.color}
                  </p>
                </div>
  
                <div>
                  <p className="text-sm font-medium text-gray-800">Size</p>
                  <p className="text-base font-semibold">
                    {state.size}
                  </p>
                </div>
  
                <div>
                  <p className="text-sm font-medium text-gray-800">Type</p>
                  <p className="text-base font-semibold">
                    {state.type}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-800">Quality</p>
                  <p className="text-base font-semibold">
                    {state.quality}
                  </p>
                </div>

                
              </div>
            </div>
            {/* Action Buttons */}
          </div>
        </div>
  
        
  
        
      </div>
    );
}

export default ViewWarehouseStock