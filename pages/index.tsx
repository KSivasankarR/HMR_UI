import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.scss';
import LoginPage from './LoginPage';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Marriage Registration</title>
        <link rel="icon" href="/hmr/images/Govt-favicon.png" />
      </Head>
       <LoginPage/>
    </div>
  )
}

export default Home
