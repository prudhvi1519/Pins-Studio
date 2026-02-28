import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';

function Shell() {
  const isViteApiUrlAvailable = Boolean(import.meta.env.VITE_API_URL);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-50">
        <Link to="/" className="text-gray-500 hover:text-black">Home</Link>
        <Link to="/search" className="text-gray-500 hover:text-black">Search</Link>

        {/* Placeholder FAB */}
        <div className="-mt-8 bg-black rounded-full p-4 shadow-lg text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
        </div>

        <Link to="/boards" className="text-gray-500 hover:text-black">Boards</Link>
        <Link to="/profile" className="text-gray-500 hover:text-black">Profile</Link>
      </nav>

      {/* Admin/Settings dev links & Env check */}
      <div className="fixed top-2 right-2 flex gap-4 text-xs font-mono opacity-50">
        <Link to="/settings" className="hover:underline">Settings</Link>
        <Link to="/admin" className="hover:underline">Admin</Link>
        <span>API: {isViteApiUrlAvailable ? 'Set' : 'Unset'}</span>
      </div>
    </div>
  );
}

// Pages
const Home = () => <div className="p-8"><h1 className="text-3xl font-bold mb-4">Home</h1><p>Phase 1 Placeholder</p></div>;
const Search = () => <div className="p-8"><h1 className="text-3xl font-bold mb-4">Search</h1><p>Active state demonstration</p></div>;
const Boards = () => <div className="p-8"><h1 className="text-3xl font-bold mb-4">Boards</h1></div>;
const Profile = () => <div className="p-8"><h1 className="text-3xl font-bold mb-4">Profile</h1></div>;
const Settings = () => <div className="p-8"><h1 className="text-3xl font-bold mb-4">Settings</h1></div>;
const Admin = () => <div className="p-8"><h1 className="text-3xl font-bold mb-4">Admin</h1></div>;

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Shell />}>
          <Route index element={<Home />} />
          <Route path="search" element={<Search />} />
          <Route path="boards" element={<Boards />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}