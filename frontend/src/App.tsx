import { createBrowserRouter, RouterProvider, Outlet, Link } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Page from './components/layout/Page';
import Home from './pages/Home';
import Search from './pages/Search';
import Boards from './pages/Boards';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Admin from './pages/Admin';

const AppShell = () => {
  return (
    <Page>
      {/* Dev links for Settings / Admin */}
      <div className="bg-surface p-8 flex gap-16 border-b border-border">
        <span className="font-semibold text-caption">Dev:</span>
        <Link to="/settings" className="hover:text-hover text-accent text-caption">Settings</Link>
        <Link to="/admin" className="hover:text-hover text-accent text-caption">Admin</Link>
      </div>

      <main>
        <Outlet />
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