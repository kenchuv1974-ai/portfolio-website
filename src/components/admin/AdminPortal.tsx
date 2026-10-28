import { useEffect, useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { isAuthenticated } from '../../services/authService';
import AdminDashboard from './AdminDashboard';
import AdminLogin from './AdminLogin';

export default function AdminPortal() {
  const { isAdminOpen, closeAdmin } = usePortfolio();
  const [authed, setAuthed] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    isAuthenticated().then((res) => {
      if (isMounted) {
        setAuthed(res);
        setChecking(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [isAdminOpen]);

  if (!isAdminOpen) return null;

  if (checking) {
    return (
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-xl text-white font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
          <span>Verifying security authorization...</span>
        </div>
      </div>
    );
  }

  if (authed) {
    return <AdminDashboard onLogout={() => setAuthed(false)} />;
  }

  return (
    <AdminLogin
      onAuthenticated={() => setAuthed(true)}
      onClose={closeAdmin}
    />
  );
}
