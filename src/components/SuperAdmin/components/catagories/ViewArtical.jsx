import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authService from '../../../../api/auth.service';
import { useAuth } from '../../../../Context/AuthContext';
import Loader from '../../../../common/Loader';
import { toast } from 'react-toastify';

const ViewArticle = () => {
  const { id } = useParams(); // Get the article ID from URL
  const { user } = useAuth();
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch category data
  const fetchCategory = async () => {
    setLoading(true);
    try {
      const res = await authService.getCategoryById(id, user.accessToken);
      setCategory(res.data?.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch details');
      navigate(-1); // Go back if error occurs
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [id]);

  if (loading) return <Loader />;

  if (!category) return null; // Or show "Not Found"

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex justify-center">
      <div className="w-full max-w-4xl bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Article Details</h2>

        <div className="mb-4">
          <strong>Article:</strong> {category.article}
        </div>

        {category.category.map((cat, idx) => (
          <div key={idx} className="border p-4 rounded mb-2 bg-gray-50">
            <div><strong>Category Code:</strong> {cat.categoryCode}</div>
            <div><strong>Size:</strong> {cat.size}</div>
            <div><strong>Color:</strong> {cat.color}</div>
            <div><strong>Type:</strong> {cat.type}</div>
            <div><strong>Quality:</strong> {cat.quality}</div>
          </div>
        ))}

        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ViewArticle;
