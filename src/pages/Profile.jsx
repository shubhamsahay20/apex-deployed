import React, { useState, useEffect } from 'react';
import {
  FaEdit,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUser,
} from 'react-icons/fa';
import userSix from '../images/user/user-06.png';
import Breadcrumb from '../components/SuperAdmin/components/Breadcrumbs/Breadcrumb';
import useProfile from '../hooks/useProfile';
import { useAuth } from '../Context/AuthContext';
import { toast } from 'react-toastify';
import authService from '../api/auth.service';
import Loader from '../common/Loader';

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const { user } = useAuth();
  const id = user.user.id;

  const { profileData, refetchProfile, loading } = useProfile(user.accessToken);

  const [formData, setFormData] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (profileData) setFormData(profileData);
  }, [profileData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const changedFields = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== profileData[key]) {
        changedFields[key] = formData[key];
      }
    });

    if (selectedFile) {
      changedFields.profileImage = selectedFile;
    }

    if (Object.keys(changedFields).length === 0) {
      toast.info('No changes detected.');
      return;
    }

    try {
      const formDataToSend = new FormData();
      for (const key in changedFields) {
        formDataToSend.append(key, changedFields[key]);
      }

      const res = await authService.editProfile(user.accessToken, id, formDataToSend);
      toast.success(res.message || 'Profile updated successfully!');
      await refetchProfile();
      setEditMode(false);
      setSelectedFile(null);
      setPreviewImage(null);
    } catch (error) {
      console.log("error +++",error);
      
      toast.error(error.response?.data?.message || 'Update failed may be image is to large ');
    }
  };

  if (loading) return <Loader />;

  // Avatar fallback helper
  const getAvatar = (name, imageSrc, size = 'w-32 h-32') => {
    const initial = name?.charAt(0)?.toUpperCase() || 'U';
    const colors = ['#E57373', '#64B5F6', '#81C784', '#FFD54F', '#BA68C8', '#4DB6AC'];
    const color = colors[initial.charCodeAt(0) % colors.length];

    if (imageSrc) {
      return (
        <img
          src={imageSrc}
          alt="Profile"
          className={`${size} rounded-full border-4 border-white shadow-lg object-cover`}
        />
      );
    }
    return (
      <div
        className={`${size} rounded-full flex items-center justify-center text-white text-3xl font-semibold border shadow-lg`}
        style={{ backgroundColor: color }}
      >
        {initial}
      </div>
    );
  };

  return (
    <>
      <Breadcrumb pageName="Profile" />

      {editMode ? (
        <div className="bg-gray-50 p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
            Edit Profile
          </h2>

          <div className="flex flex-col sm:flex-row gap-12">
            <div className="flex flex-col items-center gap-4">
              {getAvatar(formData.name, previewImage || formData.profileImage)}

              <label
                htmlFor="profileImage"
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 cursor-pointer transition"
              >
                <FaEdit /> Change Picture
              </label>
              <input
                id="profileImage"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter name"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Phone
                </label>
                <input
                  type="number"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location || ''}
                  onChange={handleChange}
                  className="w-full md:w-2/3 border rounded-lg px-4 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter location"
                />
              </div>

              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition w-full sm:w-auto"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="border border-gray-300 hover:bg-gray-100 px-6 py-2.5 rounded-lg font-medium transition w-full sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 relative mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-10">
            <div className="flex flex-col items-center">
              {getAvatar(profileData.name, profileData.profileImage)}
              <button
                className="mt-4 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition"
                onClick={() => setEditMode(true)}
              >
                <FaEdit /> Edit Profile
              </button>
            </div>

            <div className="flex flex-col gap-6 w-full">
              <h2 className="text-2xl font-bold text-gray-800 border-b pb-3">
                My Profile
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileInfo icon={<FaUser />} label="Name" value={profileData.name} />
                <ProfileInfo icon={<FaPhone />} label="Phone" value={profileData.phone} />
                <ProfileInfo icon={<FaEnvelope />} label="Email" value={profileData.email} />
                <ProfileInfo icon={<FaMapMarkerAlt />} label="Location" value={profileData.location} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const ProfileInfo = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 border rounded-lg p-4 shadow-sm bg-gray-50">
    <div className="text-blue-600">{icon}</div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-gray-800 font-medium">{value || 'N/A'}</p>
    </div>
  </div>
);

export default Profile;
