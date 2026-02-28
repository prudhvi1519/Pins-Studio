import { API_URL } from '../config/env';
import Container from '../components/layout/Container';

export default function Home() {
    return (
        <Container className="pt-24">
            <h1>Home</h1>
            <p className="text-muted mt-8 mb-16">Phase 2 UI foundation</p>
            <div className="font-mono bg-surface border border-border p-16 rounded-card">
                API_URL = {API_URL}
            </div>
        </Container>
    );
}
