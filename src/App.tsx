import {BrowserRouter as Router, Link, Route, Routes, useNavigate} from 'react-router-dom';
import React, {useCallback, useEffect, useState} from 'react';
import {MediaProvider} from "./contexts/MediaContext.tsx";
import Gallery from './components/Gallery';
import UploadPage from './components/UploadPage';
import Landing from './components/Landing';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import axios, {isAxiosError} from "axios";

const gallery_path: string = '/gallery';
const upload_path: string = '/upload';
const login_path: string = '/login';
const signup_path: string = '/signup';
const dashboard_path: string = '/dashboard';

const AppContent: React.FC = () => {
    const [userId, setUserId] = useState<number | null>(-1);
    const [username, setUsername] = useState<string | null>(null);
    const [userDir, setUserDir] = useState<string | null>(null);
    const navigate = useNavigate();

    const validateSession = useCallback(async () => {
        const token = sessionStorage.getItem('authToken');
        if (!token) {
            setUserId(-1);
            setUsername(null);
            setUserDir(null);
            return;
        }

        const response = await axios.get(`${import.meta.env.VITE_HOST}/api/token`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if (response.status === 200 && response.data !== null) {
            setUserId(response.data.id);
            setUsername(response.data.username);
            setUserDir(response.data.path);
        }
    }, [])

    const handleLogout = () => {
        sessionStorage.removeItem('authToken');
        setUserId(-1);
        setUsername(null);
        setUserDir(null);
        navigate('/');
    };

    useEffect(() => {
        validateSession().catch((error) => {
            if (isAxiosError(error)) {
                if (error.status === 401) {
                    sessionStorage.removeItem('authToken');
                    setUserId(-1);
                    setUsername(null);
                    setUserDir(null);
                    alert("Session timed out or invalid. Please log in again.");
                    navigate('/');
                }
            }
        })
    }, [navigate, validateSession]);

    return (
        <>
            <nav
                style={{
                    fontFamily: 'Arial, monospace',
                    backgroundColor: '#ddd',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'fixed',
                    padding: '10px 0',
                    top: '0',
                    left: '0',
                    width: '100%',
                    zIndex: 9999,
                }}
            >
                <div
                    style={{
                        display: 'flex',
                    }}
                >
                    <Link
                        to='/dashboard'
                        style={{
                            textDecoration: 'none',
                            padding: '10px',
                            color: 'black',
                        }}
                    >
                        Home
                    </Link>
                    <Link
                        to={gallery_path}
                        style={{
                            textDecoration: 'none',
                            padding: '10px',
                            pointerEvents: (userId !== -1) ? 'auto' : 'none',
                            color: (userId !== -1) ? 'black' : 'gray',
                        }}
                    >
                        Gallery
                    </Link>
                    <Link
                        to={upload_path}
                        style={{
                            textDecoration: 'none',
                            padding: '10px',
                            pointerEvents: (userId !== -1) ? 'auto' : 'none',
                            color: (userId !== -1) ? 'black' : 'gray',
                        }}
                    >
                        Upload
                    </Link>
                </div>
                <div
                    style={{
                        display: 'flex',
                        marginRight: '10px',
                    }}
                >
                    {userId !== -1 ? (
                        <Link
                            to='/'
                            style={{
                                textDecoration: 'none',
                                color: 'black',
                                padding: '10px',
                                cursor: 'pointer',
                            }}
                            onClick={handleLogout}
                        >
                            Logout
                        </Link>
                    ) : (
                        <Link
                            to={login_path}
                            style={{
                                textDecoration: 'none',
                                color: 'black',
                                padding: '10px',
                                cursor: 'pointer',
                            }}
                        >
                            Login
                        </Link>
                    )}
                </div>
            </nav>
            <Routes>
                <Route path='/' element={<Landing/>}/>
                <Route path={gallery_path} element={<Gallery userDir={userDir}/>}/>
                <Route path={upload_path} element={<UploadPage useDirectory={userDir}/>}/>
                <Route path={login_path} element={<Login/>}/>
                <Route path={signup_path} element={<Signup/>}/>
                <Route path={dashboard_path} element={<Dashboard authUserId={userId} authUsername={username}/>}/>
            </Routes>
        </>
    );
};

const App: React.FC = () => {
    return (
        <MediaProvider>
            <Router>
                <AppContent/>
            </Router>
        </MediaProvider>
    );
};

export default App;
