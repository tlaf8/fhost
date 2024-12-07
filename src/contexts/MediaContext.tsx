import React, {createContext, useCallback, useState} from 'react';
import axios from 'axios';
import {MediaContextType, MediaFile} from '../types/MediaTypes';

const MediaContext = createContext<MediaContextType | undefined>(undefined);

const MediaProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [media, setMedia] = useState<MediaFile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lastFetchedDir, setLastFetchedDir] = useState<string | null>(null);

    const getFileType = (filename: string): MediaFile['type'] => {
        const extension = filename.split('.').pop()?.toLowerCase() || '';

        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
        const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'];
        const audioExtensions = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'];

        if (imageExtensions.includes(extension)) return 'image';
        if (videoExtensions.includes(extension)) return 'video';
        if (audioExtensions.includes(extension)) return 'audio';

        return 'unknown';
    };

    const fetchFileBlob = useCallback(async (file: MediaFile, token: string) => {
        try {
            const response = await axios.get(file.url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: 'blob',
            });

            const blobUrl = URL.createObjectURL(response.data);
            return {...file, blobUrl};
        } catch (error) {
            console.error('Error fetching file:', file.filename, error);
            return null;
        }
    }, []);

    const fetchMedia = useCallback(async (userDir: string | null) => {
        if (!userDir || userDir === lastFetchedDir) {
            setIsLoading(false);
            return;
        }

        const token = sessionStorage.getItem('authToken');
        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            const fileListResponse = await axios.get(`${import.meta.env.VITE_HOST}/uploads/${userDir}/filelist`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Create file objects
            const files: MediaFile[] = fileListResponse.data.filelist.map((filename: string) => ({
                url: `${import.meta.env.VITE_HOST}/uploads/${userDir}/cmp/compressed_${filename}`,
                type: getFileType(filename),
                filename,
                blobUrl: ''
            }));

            const fetchedFiles = await Promise.all(
                files.map(file => fetchFileBlob(file, token))
            );

            const validFiles = fetchedFiles.filter((file): file is MediaFile => file !== null);
            setMedia(validFiles);
            setLastFetchedDir(userDir);
        } catch (error) {
            console.error('Error fetching media list:', error);
        } finally {
            setIsLoading(false);
        }
    }, [fetchFileBlob, lastFetchedDir]);

    return (
        <MediaContext.Provider value={{media, isLoading, fetchMedia, setMedia}}>
            {children}
        </MediaContext.Provider>
    );
};

export {MediaContext, MediaProvider};