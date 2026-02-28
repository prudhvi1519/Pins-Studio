import Container from '../components/layout/Container';
import { Input } from '../components/core/Input';
import { Chip } from '../components/core/Chip';

export default function Search() {
    return (
        <Container className="pt-24 space-y-24">
            <div>
                <h1>Search</h1>
                <p className="text-muted mt-8">Phase 2 UI foundation</p>
            </div>

            {/* Simulated Search Input */}
            <div className="relative max-w-md">
                <Input placeholder="Search pins, boards, tags…" />
                <svg className="absolute right-16 top-1/2 -translate-y-1/2 w-20 h-20 text-muted pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
            </div>

            {/* Simulated Filter Chips */}
            <div className="flex flex-wrap gap-8">
                <Chip selected size="md">For You</Chip>
                <Chip size="md">UI/UX Patterns</Chip>
                <Chip size="md">Marketing</Chip>
                <Chip size="md">Design Tools</Chip>
                <Chip size="md">Startups</Chip>
            </div>
        </Container>
    );
}
