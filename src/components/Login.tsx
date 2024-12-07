import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !password) {
            setError('Username or password is required.');
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_HOST}/api/login`, {
                username,
                password,
            });

            if (response.status === 200) {
                const {token} = response.data;
                sessionStorage.setItem('authToken', token);
                setError('');
                setUsername('');
                setPassword('');
                navigate('/dashboard');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    setError('Invalid username or password.');
                    setPassword('');
                } else {
                    setError('An unknown error occurred');
                    console.error(error);
                }
            } else {
                setError('An unexpected error occurred.');
                console.error(error);
            }
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '70px',
                fontFamily: 'Arial, monospace',
            }}
        >
            <div style={{width: '25em'}}>
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div
                        style={{
                            marginBottom: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{
                                width: 'auto',
                                padding: '8px',
                                marginTop: '4px',
                            }}
                        />
                    </div>

                    <div
                        style={{
                            marginBottom: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: 'auto',
                                padding: '8px',
                                marginTop: '4px',
                            }}
                        />
                    </div>

                    {error && <p style={{color: 'red', fontSize: '14px'}}>{error}</p>}

                    <button
                        type="submit"
                        style={{
                            width: '25%',
                            padding: '10px',
                            margin: '10px 0',
                            backgroundColor: '#007bff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                        }}
                    >
                        Login
                    </button>
                </form>
                <a
                    style={{
                        fontSize: '12px',
                        textDecoration: 'none',
                        color: 'blue',
                    }}
                    href="/signup"
                >
                    No account? Sign up
                </a>
            </div>
        </div>
    );
};

export default LoginPage;
