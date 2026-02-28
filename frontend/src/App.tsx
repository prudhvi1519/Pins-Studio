import { createBrowserRouter, RouterProvider, Outlet, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import BottomNav from './components/BottomNav';
import Page from './components/layout/Page';
import Home from './pages/Home';
import Search from './pages/Search';
import Boards from './pages/Boards';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import { useReducedMotionPref } from './motion/useReducedMotionPref';
import { getPageVariants } from './motion/variants';

const AppShell = () => {
  const location = useLocation();
  const prefersReduced = useReducedMotionPref();
  const pageVariants = getPageVariants(prefersReduced);

  return (
    <Page>
      {/* Dev links for Settings / Admin */}
      <div className="bg-surface p-8 flex gap-16 border-b border-border relative z-50">
        <span className="font-semibold text-caption">Dev:</span>
        <Link to="/settings" className="hover:text-hover text-accent text-caption">Settings</Link>
        <Link to="/admin" className="hover:text-hover text-accent text-caption">Admin</Link>
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
      { path: 'boards', element: <Boards /> },
      { path: 'profile', element: <Profile /> },
      { path: 'settings', element: <Settings /> },
      { path: 'admin', element: <Admin /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}