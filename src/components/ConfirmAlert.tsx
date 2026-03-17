import React, { useEffect } from 'react'
import styles from '../../styles/components/PopupAlert.module.scss';
import { ImCross } from 'react-icons/im';
import { MdDone, MdOutlineDoneOutline } from 'react-icons/md';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { ConfirmAction, PopupAction } from '../redux/commonSlice';
import { useRouter } from 'next/router';

const ConfirmAlert = () => {
    const router = useRouter();
    const ConfirmMemory = useAppSelector((state) => state.common.ConfirmMemory);
    const dispatch = useAppDispatch()

    const Clicked=(value)=>{
        dispatch(ConfirmAction ({ ...ConfirmMemory, enable: false, result:value }))
    }
    return (
        <div>
            {
            ConfirmMemory.enable &&
                <div className={styles.container}>
                    <div className={styles.Messagebox}>
                        <div className={styles.header} style={{marginBottom:'1rem'}}>
                            <div className={styles.letHeader} >
                                <text className={styles.text}>Confirmation</text>
                            </div>
                            {/* <div>
                                <ImCross onClick={() => dispatch(PopupAction({ ...ConfirmMemory, enable: false }))} className={styles.crossButton} />
                            </div> */}
                        </div>
                        <div style={{ paddingLeft: '1rem', paddingRight: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <text className={styles.message} style={{fontSize:'20px'}}>{ConfirmMemory.message}</text>
                        </div>
                        <div style={{ display:"flex",marginTop:'1rem' }}>
                            {ConfirmMemory.buttons.map(x=>{
                                return(
                                    <button style={{margin:'2px', paddingLeft:'1em', paddingRight:'1em'}} key ={x} onClick={()=>Clicked(x)} >{x}</button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default ConfirmAlert;