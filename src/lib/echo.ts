import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
    interface Window {
        Pusher: typeof Pusher;
        Echo: Echo<any>;
    }
}

window.Pusher = Pusher;

const getAuthToken = (): string | null => {
    return localStorage.getItem('access_token');
};

// Realtime is disabled unless explicitly enabled (VITE_REVERB_ENABLED=true).
// The backend uses BROADCAST_CONNECTION=log, so there is no Reverb server to
// connect to; without this guard the browser spams connection errors.
const realtimeEnabled = import.meta.env.VITE_REVERB_ENABLED === 'true';

interface NoopChannel {
    listen: (event: string, callback: (...args: any[]) => void) => NoopChannel;
    stopListening: (event: string, callback?: (...args: any[]) => void) => NoopChannel;
}

const noopChannel = (): NoopChannel => ({
    listen: () => noopChannel(),
    stopListening: () => noopChannel(),
});

const noopEcho = {
    connector: { pusher: { config: {} } },
    private: (): NoopChannel => noopChannel(),
    leave: (): void => {},
} as unknown as Echo<any>;

const echo: Echo<any> = realtimeEnabled
    ? new Echo({
        broadcaster: 'pusher',
        key: import.meta.env.VITE_REVERB_APP_KEY || 'local-key',
        wsHost: import.meta.env.VITE_REVERB_HOST || 'localhost',
        wsPort: import.meta.env.VITE_REVERB_PORT || 8080,
        wssPort: import.meta.env.VITE_REVERB_PORT || 8080,
        forceTLS: (import.meta.env.VITE_REVERB_SCHEME || 'http') === 'https',
        encrypted: false,
        disableStats: true,
        enabledTransports: ['ws', 'wss'],
        cluster: 'mt1', // Required by Pusher.js but not used by Reverb (we use wsHost/wsPort)
        authEndpoint: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'}/broadcasting/auth`,
        auth: {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
                Accept: 'application/json',
            },
        },
    })
    : noopEcho;

export default echo;
