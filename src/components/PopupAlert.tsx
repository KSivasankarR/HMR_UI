import React, { useEffect } from 'react'
import styles from '../../styles/components/PopupAlert.module.scss';
import { ImCross } from 'react-icons/im';
import { MdDone, MdOutlineDoneOutline } from 'react-icons/md';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { PopupAction } from '../redux/commonSlice';
import { useRouter } from 'next/router';
import {CallTokenInvalidate} from '../axios';
import { handleLogOut } from '../../utils';

const PopupAlert = () => {
    const router = useRouter();
    const PopupMemory = useAppSelector((state) => state.common.PopupMemory);
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (PopupMemory.enable) {
            setTimeout(() => { if (PopupMemory.redirect && PopupMemory.redirect != "") { 
                if(PopupMemory.redirect === '/'){
                    handleLogOut()
                }else{
                    router.push(PopupMemory.redirect);
                }
             } dispatch(PopupAction({ ...PopupMemory, enable: false })) }, 5000);
        }
    }, [PopupMemory.enable])

    return (
        <div>
            {
            PopupMemory.enable &&
                <div className={styles.container}>
                    <div className={styles.Messagebox}>
                        <div className={styles.header}>
                            <div className={styles.letHeader} >
                                <text className={styles.text}>Message</text>
                            </div>
                            {/* <div>
                                <ImCross onClick={() => dispatch(PopupAction({ ...PopupMemory, enable: false }))} className={styles.crossButton} />
                            </div> */}
                        </div>
                        <div style={{ paddingLeft: '1rem', paddingRight: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {PopupMemory.type ?

                                <div style={{ backgroundColor: '#2CC746', borderRadius: '100px', width: '60px', height: '60px', display: 'flex', justifyContent: 'center', margin: '10px' }}>
                                    <MdDone style={{ width: '30px', height: '30px', color: 'white', margin: '15px' }} />
                                </div>
                                :
                                <div style={{ backgroundColor: 'red', borderRadius: '100px', width: '60px', height: '60px', display: 'flex', justifyContent: 'center', margin: '10px' }}>
                                    <ImCross style={{ width: '30px', height: '30px', color: 'white', margin: '15px' }} />
                                </div>

                            }
                            <text className={styles.message}>{PopupMemory.message}</text>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default PopupAlert