import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import authService from '../api/auth.service';

export default function useProfile(accessToken) {
  const [profileData, setrProfileData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await authService.getProfile(accessToken);
        console.log('Profile response', res.data);

        setrProfileData(res.data);
      } catch (error) {
        console.log(error.response?.data?.message);
        toast.error(error.response?.data?.message);
      }
    };

    fetchData();

}, []);
return { profileData };
}
