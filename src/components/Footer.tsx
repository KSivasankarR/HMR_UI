import React, { useState, useEffect  } from 'react'
import styles from '../../styles/components/Footer.module.scss';
import { useAppSelector } from '../redux/hooks';
// import { useLocation } from 'react-router-dom';

const Footer = () => {

  const [loginType, setLoginType] = useState("");
  const loginDetails = useAppSelector(state => state.login.loginDetails)
  // const location = useLocation();

  useEffect(() => {
    let data: any = localStorage.getItem("loginDetails");
    if(data && data != 'undefined'){
      data = JSON.parse(data);
      setLoginType(data.loginType.toUpperCase())
    } else {
      if(loginType){
        setLoginType('')
      }
    }

  }, [loginDetails])

  return (
    
    <footer>
      <div className={styles.footerContainer}>
      {loginType === "OFFICER" ?
        <span className={styles.footerText}>Copyright © All rights reserved with Registration & Stamps Department, Government of Andhra Pradesh. For feedback, send mail to igrs_support@criticalriver.com</span>
        :<span className={styles.footerText}>Copyright © All rights reserved with Registration & Stamps Department, Government of Andhra Pradesh.</span>
      }
      </div>
    </footer>
 
    )
}

export default Footer