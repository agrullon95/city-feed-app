import React from 'react';
import styles from '../styles/Skeleton.module.css';

const SkeletonPost = () => {
    return (
        <article className={styles.skeletonCard} aria-hidden="true">
            <div className={styles.header}>
                <div className={styles.avatar} />
                <div className={styles.lines}>
                    <div className={`${styles.line} ${styles.short}`} />
                    <div className={`${styles.line} ${styles.medium}`} />
                </div>
            </div>

            <div className={styles.content}>
                <div className={`${styles.line} ${styles.long}`} />
                <div className={styles.spacer} />
                <div className={`${styles.line} ${styles.medium}`} />
            </div>
        </article>
    );
};

export default SkeletonPost;
