import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../Context/AuthContext';
import productionService from '../../../api/production.service';
import Loader from '../../../common/Loader';


const DetailField = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
    <p className="text-sm font-medium text-gray-600">{label}</p>
    <p className="text-base font-semibold text-gray-800">{value || '-'}</p>
  </div>
);

const ViewProduction = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [productionData, setProductionData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await productionService.getProductionById(
          user.accessToken,
          id,
        );

        console.log("res", res);

        setProductionData(res.data.data || {});
      } catch (error) {
        console.error('Error fetching production:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.accessToken, id]);

  if (loading) return <Loader />;

  return (
    <div className="p-6 bg-[#F5F6FA] min-h-screen">
      <div className="max-w-[1200px] mx-auto bg-white rounded-xl shadow-lg p-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-600 font-medium hover:underline"
        >
          ⬅️ Back
        </button>

        <h2 className="text-3xl font-bold text-gray-800 border-b pb-4 mb-8">
          Production Details
        </h2>

        {/* ✅ Image Section - now directly below the heading */}
        {productionData?.category?.image && (
          <div className="mb-10">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{productionData.article} Image</h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm flex justify-center">
              <img
                src={productionData.category.image}
                alt="Category"
                className="max-h-64 object-contain rounded-lg"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-700">
          <DetailField
            label="PRODUCTION NO"
            value={productionData.productionNo}
          />
          <DetailField label="ARTICLE" value={productionData.article} />
          <DetailField label="CATEGORY NAME" value={productionData?.category?.categoryCode} />
          <DetailField label="COLOR" value={productionData?.category?.color} />
          <DetailField label="QUALITY" value={productionData?.category?.quality} />
          <DetailField label="SIZE" value={productionData?.category?.size} />
          <DetailField label="TYPE" value={productionData?.category?.type} />
        </div>
      </div>
    </div>
  );
};

export default ViewProduction;
