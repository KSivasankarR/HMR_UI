
import React, { useState, useEffect } from 'react';
import styles from '../styles/pages/SroUpdateDetails.module.scss';
import ResetPassword from '../src/components/ResetPassword';
import { useRouter } from 'next/router';
import TableInputText from '../src/components/TableInputText';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import { LoadingAction, PopupAction } from '../src/redux/commonSlice';
import {CallUpdateSRO, CallTokenInvalidate} from '../src/axios';
import { saveLoginDetails } from '../src/redux/loginSlice';
import { handleLogOut } from '../utils';

const SroUpdateDetails = () => {
	let initialLoginDetails = useAppSelector((state) => state.login.loginDetails);
	const [LoginDetails, setLoginDetails] = useState(initialLoginDetails);
	const [ShowUpdateButton, setShowUpdateButton] = useState(false);
	const router = useRouter();
	const dispatch = useAppDispatch()

	const Loading = (value: boolean) => {dispatch(LoadingAction ({enable:value}));}

	// const intialPasswordData: any = {
	// 	oldPassword: '',
	// 	newPassword: '',
	// 	confirmPassword: ''
	// }
	// const [hidden, setHidden] = useState<any>();
	const [Popup, setPopup] = useState<any>({
		enable: false,
		type: true,
	});

	useEffect(() => {
		let data: any = localStorage.getItem("loginDetails");
		data = JSON.parse(data);
		if (data && data.token && (data.loginType == "OFFICER" || data.loginType == "officer")) {
			setLoginDetails(data);
		}
		else {
			handleLogOut()
		}
	}, [])

	const redirectToPage = (location: string) => {
		router.push({
			pathname: location
		})
	}
	const onLogout = () => {
		handleLogOut()
	}

	const UpdateAction = async() =>{
		Loading(true)
		let result = await CallUpdateSRO({loginName:LoginDetails.loginName, loginId:LoginDetails.loginId});
		Loading(false);
		 if(result.status){
			let data = {...LoginDetails,loginName:LoginDetails.loginName}
			localStorage.setItem("loginDetails",JSON.stringify(data));
			dispatch(saveLoginDetails(data));
			setShowUpdateButton(false);
			dispatch(PopupAction({ enable: true, type: true, message: "Officer details updated successfully."}));
		}
	}
	const DisplayTable = (key: any, value: any) => {
		return (
			<div style={{ display: 'flex' }}>
				<div className={styles.KeyContainer} >
					<text className={styles.keyText}>{key}</text>
				</div>
				<div className={styles.ValueContainer}>
					<text className={styles.valueText}>: {value}</text>
				</div>
			</div>
		);
	}
	// let closePopup = () => {
	// 	setHidden('');
	// }
	const resetPopup: any = async () => { setPopup({ ...Popup, enable: true, type: false }) }

	return (
		<div>
			<ResetPassword enable={Popup.enable} setPopup={setPopup} Popup={Popup} />
			<div className={styles.Navbar}>
				<text className={styles.NavbarText}> Welcome : {LoginDetails.loginName && LoginDetails.loginName.toUpperCase()}</text>
				<text className={styles.NavbarText}> Last Login : {LoginDetails.lastLogin}</text>
				<div style={{ cursor: 'pointer' }} onClick={onLogout}><text className={styles.NavbarText}> Logout </text></div>
			</div>

			<div className={styles.Container}>
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<text className={styles.TitleText}> Officer Details</text>
					<div>
						<button className={styles.btn} style={{ marginRight: '1rem' }} onClick={resetPopup}>Reset Password</button>
						<button className={styles.btn} onClick={() => { redirectToPage("/OfficeDashboard") }}>Back</button>
					</div>
				</div>
				<div className={styles.ListComponentContainer} style={{ marginBottom:"210px" }}>
					<div style={{ display: 'flex' }}>
						<text className={styles.keyText}>Name :</text>
						{
							LoginDetails && LoginDetails.role && LoginDetails.role !== "SRO" && LoginDetails.role !== "VR" ?
						<text className={styles.valueText}>{LoginDetails.loginName}</text>
						:
						<div className={styles.singleColumn}>
							<TableInputText name='husbandName' type='text' placeholder='Name - Surname' required={true} value={LoginDetails.loginName} onChange={(e)=>{ setShowUpdateButton(true);setLoginDetails({...LoginDetails,loginName:e.target.value})}} />
						</div>
						}
						{/* <text className={styles.valueText}>{LoginDetails.loginName.toUpperCase()}</text> */}
						{ShowUpdateButton?<div className={styles.updatebtn}  onClick={UpdateAction} >Update</div>:null}
					</div>
					<div style={{ display: 'flex', }}>
						<text className={styles.keyText}>Email :</text>
						<text className={styles.valueText}>{LoginDetails.loginEmail}</text>
					</div>
					{
						LoginDetails && LoginDetails.role && (LoginDetails.role === "SRO"  || LoginDetails.role === "VR") ?
					<>
					{LoginDetails.role === "SRO" ?
					<div style={{ display: 'flex', }}>
						<text className={styles.keyText}>SRO Number  :</text>
						<text className={styles.valueText}>{LoginDetails.sroNumber}</text>
					</div> :
					<div style={{ display: 'flex', }}>
					    <text className={styles.keyText}>VSWS Code  :</text>
						<text className={styles.valueText}>{LoginDetails.villageScretariatCode}</text>
				    </div>
					}
					{LoginDetails.role === "SRO" ?
					<div style={{ display: 'flex', }}>
						<text className={styles.keyText}>SRO Office  :</text>
						<text className={styles.valueText}>{LoginDetails.sroOffice}</text>
					</div>:
					<div style={{ display: 'flex', }}>
						<text className={styles.keyText}>VSWS Name  :</text>
						<text className={styles.valueText}>{LoginDetails.villageScretariatName}</text>
					</div>
					}
					<div style={{ display: 'flex', }}>
						<text className={styles.keyText}>District  :</text>
						<text className={styles.valueText}>{LoginDetails.sroDistrict}</text>
					</div>
					</>
					: ''
					}
				</div>
			</div>
			{/* <pre>{JSON.stringify(LoginDetails,null,2)}</pre> */}
		</div>
	)

}
export default SroUpdateDetails