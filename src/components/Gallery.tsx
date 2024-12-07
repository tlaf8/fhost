import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import MasonryCSS from 'react-masonry-css';
import {useMedia} from '../hooks/MediaHook';

interface MediaFile {
    blobUrl: string;
    url: string;
    type: 'image' | 'video' | 'audio' | 'unknown';
    filename: string;
}

const Gallery: React.FC<{ userDir: string | null }> = ({userDir}) => {
    const navigate = useNavigate();
    const {media, isLoading, fetchMedia} = useMedia();

    useEffect(() => {
        if (userDir) {
            fetchMedia(userDir).catch((error) => {
                console.error(error);
            });
        } else {
            navigate('/');
        }
    }, [userDir, fetchMedia, navigate]);

    const renderMediaContent = (file: MediaFile) => {
        const mediaStyles = {
            width: "100%",
            display: "block",
            borderRadius: "3px",
        };

        if (!file.blobUrl) {
            return (
                <div
                    style={{
                        width: "100%",
                        padding: "10px",
                        textAlign: "center",
                        backgroundColor: "#f0f0f0",
                    }}
                >
                    Loading {file.filename}...
                </div>
            );
        }

        switch (file.type) {
            case 'image':
                return (
                    <img
                        src={file.blobUrl}
                        alt={file.filename}
                        style={mediaStyles}
                        loading="lazy"
                        onError={(e) => {
                            e.currentTarget.src = "src/assets/404.png";
                        }}
                    />
                );

            case 'video':
                return (
                    <video
                        src={file.blobUrl}
                        style={mediaStyles}
                        controls
                    />
                );

            case 'audio':
                return (
                    <audio
                        src={file.blobUrl}
                        style={{...mediaStyles, height: '50px'}}
                        controls
                    />
                );

            default:
                return (
                    <div
                        style={{
                            width: "100%",
                            padding: "10px",
                            textAlign: "center",
                            backgroundColor: "#f0f0f0",
                        }}
                    >
                        Unsupported file type
                    </div>
                );
        }
    };

    const breakpointColumnsObj = {
        default: 5,
        900: 4,
        700: 3,
        500: 2,
        300: 1,
    };

    return (
        <div style={{marginTop: '70px', padding: '10px'}}>
            {media.length === 0 && isLoading ? (
                <div>Loading media...</div>
            ) : (
                <MasonryCSS
                    breakpointCols={breakpointColumnsObj}
                    className="masonry-grid"
                    columnClassName="masonry-grid-col"
                >
                    {media.map((file) => (
                        <div
                            key={file.filename}
                            className="media-container"
                            style={{
                                padding: "5px",
                            }}
                        >
                            {renderMediaContent(file)}
                            <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: "block",
                                    marginTop: "10px",
                                    textDecoration: "none",
                                    color: "blue",
                                }}
                            >
                                {file.filename}
                            </a>
                        </div>
                    ))}
                </MasonryCSS>
            )}
            {isLoading && media.length > 0 && <div>Loading more media...</div>}
        </div>
    );
};

export default Gallery;