import React, { useState } from 'react'
import styles from '../../styles/components/uploadContainer.module.scss';
import { MdDownloadDone } from 'react-icons/md';

interface PropsTypes {
    label: string;
    required: boolean;
    onChange: any;
    isUploadDone?:string;
    accept?:string;
}

const UploadContainer = ({ label,  required, onChange,isUploadDone='', accept="image/png, image/jpeg, image/jpg" }: PropsTypes) => {
    return (
        <div className={styles.container}>
            <div className={styles.leftBox}>
                <div style={{ width: '80%' }}>
                    <text className={styles.checkBoxText}>{label}</text>
                    {required && <text className={styles.checkBoxText} style={{ color: 'red' }}>*</text>}
                </div>
            </div>
            <div className={styles.rightBox}>
                 <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}> 
                    <text className={styles.checkBoxText}>File Browse</text>
                    <div style={{width:'40%'}}>
                        <input className={styles.columnInputBox}
                            type='file'
                            required={required}
                            onChange={onChange}
                            accept={accept}
                        />
                        <div className={styles.confirmUpload} style={{backgroundColor: (isUploadDone=='true'||isUploadDone=='TRUE')?'green':isUploadDone=='false'?'red':isUploadDone=='process'?'yellow':'transperent' }}></div>
                    </div>
                    {
                    isUploadDone=='true' &&
                    <MdDownloadDone style={{height:'30px',width:'30px',color:'green',}}/>}
                    <text style={{color:'green'}}>Document uploaded</text>
                </div>
            </div>

            
         </div>
    )
}

export default UploadContainer;