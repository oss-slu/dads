/*
Tracks whether the browser is online, using navigator.onLine and the
window "online"/"offline" events. Used to hide links to outside sites
(LMFDB, GitHub) when the desktop app has no network connection.
*/
import { useEffect, useState } from 'react';

export default function useOnline() {
  const [online, setOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return online;
}
