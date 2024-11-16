import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {jwtDecode} from 'jwt-decode';

interface DecodedToken {
  exp: number;
}

const useAuth = () => {
  const router = useRouter();

  const isTokenExpired = (token: string | null): boolean => {
    if (!token) return true;

    try {
      const decodedToken: DecodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; 
      return decodedToken.exp < currentTime;
    } catch (error) {
      return true;
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('token');

    if (isTokenExpired(token) && token) {
      localStorage.removeItem('token');
      localStorage.removeItem('loggedInUser');
      localStorage.removeItem('loggedInUserEmail');
      alert('Session expired. Please log in again.');
      router.push('/login');
    }
  }, [router]);
};

export default useAuth;
