import React, { useEffect, useState } from 'react';
import styles from '../styles/GlobalLoader.module.css';
import axios from 'axios';

export default function GlobalLoader() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const requestInterceptor = axios.interceptors.request.use((config) => {
            setCount((c) => c + 1);
            return config;
        }, (err) => {
            return Promise.reject(err);
        });

        const responseInterceptor = axios.interceptors.response.use((res) => {
            setCount((c) => Math.max(0, c - 1));
            return res;
        }, (err) => {
            setCount((c) => Math.max(0, c - 1));
            return Promise.reject(err);
        });

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, []);

    if (count === 0) return null;

    return (
        <div className={styles.overlay} aria-live="polite">
            <div className={styles.spinner} role="status" aria-hidden={false}>
                Loading…
            </div>
        </div>
    );
}
