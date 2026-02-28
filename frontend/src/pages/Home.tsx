import { useState } from 'react';
import { API_URL } from '../config/env';
import Container from '../components/layout/Container';
import Sheet from '../components/primitives/Sheet';
import { useToast } from '../components/primitives/useToast';

export default function Home() {
    const [isSheetOpen, setSheetOpen] = useState(false);
    const { toast } = useToast();

    return (
        <Container className="pt-24">
            <h1>Home</h1>
            <p className="text-muted mt-8 mb-16">Phase 2 UI foundation</p>

            <div className="flex gap-12 mb-24">
                <button
                    onClick={() => setSheetOpen(true)}
                    className="bg-accent text-surface px-16 py-8 rounded-full hover:bg-hover active:scale-95 transition-all text-button"
                >
                    Open Sheet
                </button>
                <button
                    onClick={() => toast({ message: "Board created successfully!", type: "success" })}
                    className="bg-surface text-text border border-border px-16 py-8 rounded-full hover:bg-bg active:scale-95 transition-all text-button"
                >
                    Show Toast
                </button>
            </div>

            <div className="font-mono bg-surface border border-border p-16 rounded-card">
                API_URL = {API_URL}
            </div>

            <Sheet
                isOpen={isSheetOpen}
                onClose={() => setSheetOpen(false)}
                title="Demo Sheet"
            >
                <div className="space-y-16">
                    <p className="text-body text-muted">
                        This is a placeholder bottom sheet body. It locks background scroll, closes on ESC, and traps focus.
                    </p>
                    <div className="h-64 bg-bg rounded-card border border-border flex items-center justify-center text-muted">
                        Placeholder content block
                    </div>
                    <button
                        onClick={() => setSheetOpen(false)}
                        className="w-full bg-border text-text py-12 rounded-full font-button hover:bg-muted/20 active:scale-95 transition-all"
                    >
                        Close
                    </button>
                </div>
            </Sheet>
        </Container>
    );
}
