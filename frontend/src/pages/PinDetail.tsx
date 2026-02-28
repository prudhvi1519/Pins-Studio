import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getPinById } from '../data/getPinById';
import type { Pin } from '../types/pin';
import { useReducedMotionPref } from '../motion/useReducedMotionPref';
import { Button } from '../components/core/Button';
import Container from '../components/layout/Container';
import { SaveToBoardSheet } from '../components/boards/SaveToBoardSheet';

export default function PinDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const prefersReduced = useReducedMotionPref();

    const [pin, setPin] = useState<Pin | null>(null);
    const [isSaveSheetOpen, setIsSaveSheetOpen] = useState(false);

    useEffect(() => {
        if (id) {
            getPinById(id).then(res => {
                if (res) setPin(res);
            });
        }
    }, [id]);

    if (!pin) {
        return (
            <Container className="pt-24 flex justify-center">
                <div className="text-muted text-body mt-32">Loading...</div>
            </Container>
        );
    }

    const layoutId = prefersReduced ? undefined : `pin-image-${pin.id}`;

    return (
        <Container className="pt-24 pb-32 flex flex-col items-center">
            <div className="w-full max-w-2xl px-8 md:px-0">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-16 text-muted hover:text-text transition-colors flex items-center gap-4 text-caption font-semibold"
                >
                    ← Back
                </button>

                <div className="bg-surface rounded-[32px] overflow-hidden shadow-sheet">
                    <motion.div
                        layoutId={layoutId}
                        className="w-full bg-bg relative"
                    >
                        <img
                            src={pin.imageUrl}
                            alt={pin.title}
                            className="w-full h-auto max-h-[70vh] object-cover"
                        />
                    </motion.div>

                    <div className="p-24 md:p-32 flex flex-col gap-24">
                        <div className="flex items-center justify-between gap-16">
                            <div className="flex flex-col gap-4 overflow-hidden">
                                <h2 className="text-[22px] leading-[28px] font-semibold text-text truncate">{pin.title}</h2>
                                <p className="text-caption text-muted truncate">{pin.domain}</p>
                            </div>
                            <div className="flex items-center gap-12 flex-shrink-0">
                                <Button variant="secondary" onClick={() => window.open(pin.sourceUrl, '_blank')}>
                                    Open
                                </Button>
                                <Button variant="primary" onClick={() => setIsSaveSheetOpen(true)}>
                                    Save
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <SaveToBoardSheet
                isOpen={isSaveSheetOpen}
                onClose={() => setIsSaveSheetOpen(false)}
                pinId={pin.id}
            />
        </Container>
    );
}
