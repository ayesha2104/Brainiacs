import { createClient } from 'redis';

let client = null;
let connecting = null;

async function getClient() {
    if (!process.env.REDIS_URL) return null;
    if (client?.isOpen) return client;

    if (!connecting) {
        client = createClient({ url: process.env.REDIS_URL });
        client.on('error', (err) => console.error('❌ Redis error:', err.message));
        connecting = client.connect()
            .then(() => console.log('✅ Redis connected'))
            .catch((err) => {
                console.error('❌ Redis connection failed:', err.message);
                client = null;
            });
    }
    await connecting;
    return client;
}

export async function getCache(key) {
    try {
        const c = await getClient();
        if (!c) return null;
        const value = await c.get(key);
        return value ? JSON.parse(value) : null;
    } catch (err) {
        console.error('Cache read error:', err.message);
        return null;
    }
}

export async function setCache(key, value, ttlSeconds) {
    try {
        const c = await getClient();
        if (!c) return;
        await c.set(key, JSON.stringify(value), { EX: ttlSeconds });
    } catch (err) {
        console.error('Cache write error:', err.message);
    }
}

export async function deleteCache(key) {
    try {
        const c = await getClient();
        if (!c) return;
        await c.del(key);
    } catch (err) {
        console.error('Cache delete error:', err.message);
    }
}
