export interface Pin {
    id: string;
    title: string;
    domain: string;
    sourceUrl: string;
    canonicalUrl: string;
    imageUrl: string;
    imageWidth?: number;
    imageHeight?: number;
    tags?: string[];
    category?: string;
}
