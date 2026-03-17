import React, { useState } from 'react'
import styles from '../../styles/components/UploadDoc.module.scss';
import { MdDownloadDone } from 'react-icons/md';

interface PropsTypes {
    label: string;
    required: boolean;
    onChange: any; 
    isUploadDone?:string;
    accept?:string;
}

const UploadDoc = ({ label,  required, onChange,isUploadDone='', accept="image/png, image/jpeg, image/jpg" }: PropsTypes) => {
    return (
        // <div className={styles.container}>
        //     <div className={styles.leftBox}>
        //         <div style={{ width: '80%' }}>
        //             <text className={styles.checkBoxText}>{label}</text>
        //             {required && <text className={styles.checkBoxText} style={{ color: 'red' }}>*</text>}
        //         </div>
        //     </div>
        //     {isChecked && 
            <div className={styles.rightBox}>
                 
                    {/* <text className={styles.checkBoxText}>File Browse</text> */}
                    
                        <input className={styles.uploadInputBox}
                            type='file'
                            required={required}
                            onChange={onChange}
                            accept={accept}
                        />
                        <div className={styles.confirmUpload} style={{backgroundColor: isUploadDone=='true'?'green':isUploadDone=='false'?'red':isUploadDone=='process'?'yellow':'transperent' }}></div>
                   
                    {
                    isUploadDone=='true' &&
                    <MdDownloadDone style={{height:'30px',width:'30px',color:'green',}}/>}
                </div>
            

            
        //  </div>
    )
}

export default UploadDoc;