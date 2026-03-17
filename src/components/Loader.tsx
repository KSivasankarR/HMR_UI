import React from 'react'
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import Image from 'next/image';
import styles from '../../styles/components/Loader.module.scss';
import { LoadingAction } from '../redux/commonSlice';
import { ImCross } from 'react-icons/im';

const Loader = () => {
    const Loading = useAppSelector((state) => state.common.Loading);
    const dispatch = useAppDispatch()
    return (
        <>
            {Loading.enable ? <div className={styles.container} >
                <div className={styles.loader}>
                    <Image alt='' width={50} height={50} className={styles.image} src="/hmr/images/Loader.svg"></Image>
                </div>

            </div> : <div></div>}
        </>
    )

}

export default Loader