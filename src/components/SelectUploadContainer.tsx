import React, { useState } from 'react'
// import styles from '../../styles/components/uploadContainer.module.scss';
import styles from '../../styles/components/UploadDoc.module.scss';

import { MdDownloadDone } from 'react-icons/md';

interface PropsTypes {
    label: string;
    required: boolean;
    onChange: any,
    isUploadDone?: string;
    accept?: string;
    onCancelUpload: any;
    uploadKey: string;
}

const SelectUploadContainer = ({ label, required, onCancelUpload,uploadKey, onChange, isUploadDone = '', accept = "image/png, image/jpeg, image/jpg" }: PropsTypes) => {
    const [isChecked, setIsChecked] = useState(false)
    return (
        <div className={styles.container}>
            <div className={styles.leftBox}>
                <div style={{ width: '6%' }}>
                    <input
                        required={false}
                        className={styles.checkBox}
                        type="checkbox"
                        value=""
                        checked={isChecked}
                        onChange={() => setIsChecked(!isChecked)}
                    />
                </div>
                <div style={{ width: '80%' }}>
                    <text className={styles.checkBoxText}>{label}</text>
                    {required && <text className={styles.checkBoxText} style={{ color: 'red' }}>*</text>}
                </div>

            </div>
            {isChecked &&
                <div className={styles.rightBox}>
                {
                    isUploadDone == "process" || isUploadDone == "PROCESS" || isUploadDone == "false" || isUploadDone == "FALSE" || isUploadDone == "" ?

                        <div>
                            {/* <div className={styles.checkBoxText}>{label}<text style={{ color: "red" }}>{required ? ' *' : null}</text></div> */}
                            <div style={{ display: "flex" }}>
                                <div style={{ width: '57%' }}>
                                    <input className={styles.uploadInputBox}
                                        type='file'
                                        required={required}
                                        onChange={onChange}
                                        accept={accept}
                                    />
                                    <div className={styles.confirmUpload} style={{ backgroundColor: (isUploadDone == 'false' || isUploadDone == "FALSE") ? 'red' : (isUploadDone == 'process' || isUploadDone == "PROCESS") ? 'yellow' : 'transperent', width: '80%' }}></div>
                                </div>
                            </div>
                        </div>
                        :
                        (isUploadDone == 'true' || isUploadDone == 'TRUE') &&
                        <div style={{ display: 'flex', alignItems: 'center', borderColor: 'black', borderWidth: '1px', borderRadius: '20px', backgroundColor: '#dddddd', width: '350px', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '1rem' }}>
                                <MdDownloadDone style={{ height: '40px', width: '40px', color: 'green', marginLeft: '2px' }} />
                                <div className={styles.checkBoxText} style={{ fontWeight: 600, fontSize: '14px', marginRight: '5px' }}>Document Uploaded</div>
                            </div>
                            <div onClick={() => onCancelUpload(uploadKey)} style={{ cursor: 'pointer', marginRight: '1rem' }}>X</div>
                        </div>
                }
                </div>
            }

        </div>
    )
}

export default SelectUploadContainer;