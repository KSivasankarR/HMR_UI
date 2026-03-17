import React, { useState } from 'react';
import styles from '../../styles/components/header.module.scss';
import Image from "next/image";
import { useRouter } from 'next/router'

export const Header = () => {

  const router = useRouter()
  const [SelectedformTypekey, setSelectedformTypekey] = useState<number>(1);

  const onNavbarClick = (key: any) => {
    setSelectedformTypekey(key);
    switch (key) {
      case 1: router.push('/LoginPage'); break;
      case 2: router.push('/AboutUs'); break;
      default:
        break;
    }
    
  }

  return (
    <header style={{paddingTop:"0.4%"}}>
      {/* Head container */}
      <div className={styles.HeadingContainer}>
        {/* Left container */}
        <div className={styles.leftHeadingContainer} >
        <Image alt='' width={70} height={70} src="/hmr/images/CBN.svg"/>
          <div className={styles.textContainer}>
            <text className={styles.titleText}>Sri. Nara Chandrababu Naidu</text>
            <text className={styles.infoText}>{"Hon'ble Chief Minister"}</text>
            <text className={styles.infoText}>Andhra Pradesh</text>
          </div>    
        </div>
        {/* mind container */}
        {/* <div className={styles.midHeadingContainer}> */}
        <div className={`${styles.leftHeadingContainer} ${styles.MiddleContainer}`}>
        <Image alt='' width={72} height={75} src="/hmr/images/aplogoimg.png" />
          <div className={` ${styles.textContainer} ${styles.RegtextContainer}`}>
          <text className={`${styles.titleText} ${styles.govtitleText}`}>REGISTRATION & STAMPS DEPARTMENT</text>
          <text className={`${styles.infoText} ${styles.govText}`}>GOVERNMENT OF ANDHRA PRADESH</text>
          </div>
          </div>
          {/* <Image alt='' width={500} height={80} src="/hmr/images/Logo.svg" /> */}
        {/* </div> */}
        {/* Right container */}
        {/* <div className={styles.rightHeadingContainer}>
          <div className={styles.textContainer} style={{ textAlign: 'right' }}>
            <text className={styles.titleText} >Sri. Dharmana Prasada Rao</text>
            <text className={styles.infoText}>{"Hon'ble Minister for Revenue,"}</text>
            <text className={styles.infoText}>Registration & Stamps</text>
          </div>
          <Image alt='' width={70} height={70} src="/hmr/images/minister.svg" />
        </div> */}
         <div className={styles.rightHeadingContainer} >
          <div className={styles.textContainer} style={{ textAlign: 'right' }}>
            <text className={styles.titleText} >Sri. Anagani Satya Prasad</text>
            <text className={styles.infoText}>{"Hon'ble Minister for Revenue,"}</text>
            <text className={styles.infoText}>Registration & Stamps</text>
          </div>
          <Image alt='' width={70} height={70} src="/hmr/images/AP-RM.svg"/>
        </div>
      </div>

      {/* InfoBar container */}
      <div className={styles.InfoBarContainer}>
        <div className={styles.InfoTextContainer}>
          <Image alt='' width={16} height={20} src="/hmr/images/icon-phone.svg" />
          <text className={styles.InfoBarText}>+91 9121106359</text>
          <Image alt='' width={16} height={20} src="/hmr/images/icon-email.svg" />
          <text className={styles.InfoBarText}>helpdesk-it[at]igrs[dot]ap[dot]gov[dot]in</text>
        </div>
        <div className={styles.SearchContainer}>
          {/* <input
            className={styles.searchBox}
            type="text"
            placeholder="Search"
            aria-label="Search" />
          <div className={`input-group-prepend ${styles.header_topbar_right_mdform_groupicon}`}>
            <button className={styles.searchButton} type="submit"><Image alt='' width={24} height={24} src="/hmr/images/icon-search.svg" /></button>
          </div> */}
        </div>
      </div>
      <div className={styles.StartLine}></div>
    </header>

  )
}
