import {Dispatch, SetStateAction} from 'react';

export interface MediaFile {
    blobUrl: string;
    url: string;
    type: 'image' | 'video' | 'audio' | 'unknown';
    filename: string;
}

export interface MediaContextType {
    media: MediaFile[];
    isLoading: boolean;
    fetchMedia: (userDir: string | null) => Promise<void>;
    setMedia?: Dispatch<SetStateAction<MediaFile[]>>;
}