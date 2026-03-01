import { createBrowserRouter, RouterProvider, Outlet, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import BottomNav from './components/BottomNav';
import Page from './components/layout/Page';
import ToastContainer from './components/primitives/Toast';
import Home from './pages/Home';
import Search from './pages/Search';
import BoardsList from './pages/BoardsList';
import BoardDetail from './pages/BoardDetail';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import PinDetail from './pages/PinDetail';
import { useReducedMotionPref } from './motion/useReducedMotionPref';
import { getPageVariants } from './motion/variants';

const AppShell = () => {
  const location = useLocation();
  const prefersReduced = useReducedMotionPref();
  const pageVariants = getPageVariants(prefersReduced);

  const [session, setSession] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/auth/me`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data && data.email) {
          setSession(data.email);
        }
      })
      .catch(() => { });
  }, []);

  return (
    <Page>
      <ToastContainer />
      {/* Dev links for Settings / Admin */}
      <div className="bg-surface p-8 flex gap-16 border-b border-border relative z-50 items-center justify-between">
        <div className="flex gap-16 items-center">
          <span className="font-semibold text-caption">Dev:</span>
          <Link to="/settings" className="hover:text-hover text-accent text-caption">Settings</Link>
          <Link to="/admin" className="hover:text-hover text-accent text-caption">Admin</Link>
        </div>
        <div className="text-caption text-secondary">
          {session ? `Signed in as ${session}` : 'Not signed in'}
        </div>
      </div>

      <main className="relative">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            className="w-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav />
    </Page>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Home /> },
      { path: 'search', element: <Search /> },
      { path: 'boards', element: <BoardsList /> },
      { path: 'boards/:id', element: <BoardDetail /> },
      { path: 'profile', element: <Profile /> },
      { path: 'settings', element: <Settings /> },
      { path: 'admin', element: <Admin /> },
      { path: 'pin/:id', element: <PinDetail /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}