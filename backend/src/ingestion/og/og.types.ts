export interface OgMetadata {
    title: string | null;
    description: string | null;
    image: string | null;
    domain: string;
}

export interface IngestionResult {
    sourceUrl: string;
    canonicalUrl: string;
    metadata?: OgMetadata;
    error?: string;
    isDuplicate?: boolean;
}
