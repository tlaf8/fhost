import {useContext} from 'react';
import {MediaContext} from '../contexts/MediaContext';
import {MediaContextType} from '../types/MediaTypes';

export function useMedia(): MediaContextType {
    const context = useContext(MediaContext);
    if (context === undefined) {
        throw new Error('useMedia must be used within a MediaProvider');
    }
    return context;
}