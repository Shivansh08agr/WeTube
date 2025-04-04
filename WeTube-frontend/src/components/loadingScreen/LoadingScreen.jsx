import React from 'react'
import styles from './LoadingScreen.module.scss'

const LoadingScreen = () => {
  return (
    <div className={styles.loading}>
        <img src="/assets/loading.svg" alt="loading" />
        <p>Please Wait, it can take up to a maximum of 30-40s to load the first time (cold start) due to the free version of render.</p>
    </div>
  )
}

export default LoadingScreen