import { useParams, useNavigate } from 'react-router-dom';
import Container from '../components/layout/Container';
import { useBoards } from '../hooks/useBoards';
import { useSavedPins } from '../hooks/useSavedPins';
import { Masonry } from '../components/feed/Masonry';
import { PinCard } from '../components/feed/PinCard';
import { Button } from '../components/core/Button';

export default function BoardDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { boards } = useBoards();
    const { listSavedPins } = useSavedPins();

    const board = boards.find(b => b.id === id);
    const savedPins = id ? listSavedPins(id) : [];

    if (!board) {
        return (
            <Container className="pt-24">
                <div className="text-center py-48 text-muted">Board not found</div>
                <div className="flex justify-center mt-16">
                    <Button variant="secondary" onClick={() => navigate('/boards')}>Back to Boards</Button>
                </div>
            </Container>
        );
    }

    return (
        <Container className="pt-24 pb-32">
            <div className="mb-24 flex flex-col gap-8">
                <button
                    onClick={() => navigate('/boards')}
                    className="text-muted hover:text-text transition-colors flex items-center gap-4 text-caption font-semibold self-start"
                >
                    ← All Boards
                </button>
                <h1 className="text-h1 font-h1 text-text">{board.name}</h1>
                <p className="text-body text-muted">{savedPins.length} {savedPins.length === 1 ? 'pin' : 'pins'}</p>
            </div>

            {savedPins.length > 0 ? (
                <Masonry>
                    {savedPins.map(pin => (
                        <PinCard key={pin.id} pin={pin} />
                    ))}
                </Masonry>
            ) : (
                <div className="text-center py-64 flex flex-col items-center gap-16 border border-dashed border-border rounded-card bg-bg/50">
                    <p className="text-body text-muted">No pins yet.</p>
                    <Button variant="primary" onClick={() => navigate('/')}>
                        Discover ideas
                    </Button>
                </div>
            )}
        </Container>
    );
}
