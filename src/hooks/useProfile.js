import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import authService from '../api/auth.service';

export default function useProfile(accessToken) {
  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await authService.getProfile(accessToken);
      console.log("res for profile",res);
      
      setProfileData(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [accessToken]);

  return { profileData, setProfileData, loading, refetchProfile: fetchData };
}
