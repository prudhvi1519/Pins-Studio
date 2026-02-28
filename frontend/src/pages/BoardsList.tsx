import { Link } from 'react-router-dom';
import Container from '../components/layout/Container';
import { useBoards } from '../hooks/useBoards';
import { useSavedPins } from '../hooks/useSavedPins';

export default function BoardsList() {
    const { boards } = useBoards();
    const { getBoardPinCount } = useSavedPins();

    return (
        <Container className="pt-24 pb-32">
            <h1 className="text-h1 font-h1 text-text mb-24">Saved Boards</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16">
                {boards.map(board => {
                    const count = getBoardPinCount(board.id);
                    return (
                        <Link
                            key={board.id}
                            to={`/boards/${board.id}`}
                            className="bg-surface rounded-card p-24 border border-border shadow-card hover:shadow-sheet transition-shadow flex flex-col gap-8 group"
                        >
                            <h2 className="text-h2 font-semibold text-text group-hover:text-accent transition-colors">
                                {board.name}
                            </h2>
                            <p className="text-caption text-muted">
                                {count} {count === 1 ? 'pin' : 'pins'}
                            </p>
                        </Link>
                    )
                })}
            </div>

            {boards.length === 0 && (
                <div className="text-center py-48 text-muted">
                    No boards constructed yet.
                </div>
            )}
        </Container>
    );
}
