import { API_URL } from '../config/env';

export default function Home() {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-2">Home</h1>
            <p className="text-gray-600 mb-4">Phase 1 placeholder</p>
            <div className="text-xs font-mono bg-gray-100 p-2 rounded">
                API_URL = {API_URL}
            </div>
        </div>
    );
}
