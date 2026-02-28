import { createBrowserRouter, RouterProvider, Outlet, Link } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Search from './pages/Search';
import Boards from './pages/Boards';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Admin from './pages/Admin';

const AppShell = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Dev links for Settings / Admin (since they aren't in bottom nav directly) */}
      <div className="bg-gray-100 p-2 text-xs flex gap-4 border-b border-gray-200">
        <span className="font-semibold">Dev Links:</span>
        <Link to="/settings" className="hover:underline text-blue-600">Settings</Link>
        <Link to="/admin" className="hover:underline text-blue-600">Admin</Link>
      </div>

      {/* Main Content Area (padding bottom to avoid overlap with nav) */}
      <main className="pb-24">
        <Outlet />
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNav />
    </div>
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