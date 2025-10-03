// hooks/useAutoLogout.js
import { useEffect } from 'react';

export default function useAutoLogout(logout, timeout = 1000 * 60 * 60) {
  useEffect(() => {
    let timer;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        logout();
        window.location.href = '/login'; // force redirect
      }, timeout);
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll'];

    events.forEach((event) => window.addEventListener(event, resetTimer));

    // Start initial timer
    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [logout, timeout]);
}
