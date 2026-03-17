// pages/404.js
import Link from 'next/link';

import styles from '../styles/404.module.css';

const NotFoundPage = () => {
  return (
    <>
      <div className={styles.container} >
        <h1>404 - Page Not Found</h1>
        <br></br>
        <h4>Sorry, Service is temporarly down for sometime due to maintanence. Please try after sometime</h4>        
        <br></br>
      </div>
    </>
  );
};

export default NotFoundPage;