import React, { useEffect, useState } from 'react'
import styles from '../../styles/components/PopupAlert.module.scss';
import { ImCross } from 'react-icons/im';
import { MdOutlineDoneOutline } from 'react-icons/md';
import TableInputText from './TableInputText';
import stylesPopup from '../../styles/components/ResetPassword.module.scss';
import { UsePasswordByOfficer, CallTokenInvalidate } from '../axios';
import router from 'next/router';
import { useAppDispatch, useAppSelector } from '../../src/redux/hooks';
import { PopupAction } from '../redux/commonSlice';
import Image from "next/image";
import { handleLogOut } from '../../utils';

interface PropsTypes {
    enable: boolean;
    setPopup: any;
    Popup: any;
}


const ResetPassword = ({ enable, setPopup, Popup }: PropsTypes) => {
	let LoginDetails = useAppSelector((state)=> state.login.loginDetails);

	const [PswdDetails,setPswdDetails]=useState<any>({oldPswrd:"", newPswrd:"", cnfPswrd:""});
	const [eye, setEye] = useState<boolean>(false);
    const [eye1, setEye1] = useState<boolean>(false);
	const [eye2, setEye2] = useState<boolean>(false);
	const dispatch = useAppDispatch();

	const changeValue = async (e:any) => {
		setPswdDetails({ ...PswdDetails, [e.target.name]: e.target.value })
	}

	const passcodeRules = ['* Password should contain atleast 8 characters.', '* Atleast one uppercase character.', '* Atleast one lowercase character.', '* Atleast one digit.', 'Example: tEst1234.'];

	const validateForm = (loginPasscode) => {
		if(!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(loginPasscode))){
		  // ShowAlert(false, 'Please enter a strong password')
		  return false;
		}
		return true;
	  }
	
	const renderHints = () => {
		return <div className={stylesPopup.ruleBox}>{passcodeRules.map(rule => {
		  return <div key={rule}>{rule}</div>
		})}</div>
	}

	const ShowAlert = (type, message, redirect) => { dispatch(PopupAction({ enable: true, type: type, message: message, redirect: redirect })); }


	const validate = () => {
		let flag = true, msg = '';
		if(PswdDetails.oldPswrd === ""){
			flag = false;
			msg = 'Please enter old password'
		}
		else if(!validateForm(PswdDetails.newPswrd)){
			flag = false;
			msg = 'Please enter a valid and strong password'
		}
		else if(PswdDetails.newPswrd !== PswdDetails.cnfPswrd){
			flag = false;
			msg = 'Password does not match'
		}
		msg && ShowAlert(false, msg, '')
		return flag;
	}

	const onSubmit =async (e: any) => {
		e.preventDefault();
		if(validate()){
			var setPswrdDetails={
				//"loginEmail": LoginDetails.loginEmail,
				"oldPassword":PswdDetails.oldPswrd,
				"newPassword":PswdDetails.newPswrd
			}
			await UsePasswordByOfficer(setPswrdDetails).then((res:any)=>{
				if(res.success === true)
				{
					setPswdDetails({oldPswrd:"", newPswrd:"", cnfPswrd:""});
					ShowAlert(true, "Please Login again with new Password", '')	
					handleLogOut()
				}
				else
					ShowAlert(false, res.message , '');
			}).catch((e)=>{
				ShowAlert(false, e.Message , '');
			})
		}
	}
	return (
		<div>
			{enable &&
				<div className={stylesPopup.container}>
					<div className={stylesPopup.Messagebox}>
						<div className={stylesPopup.header}>
							<div className={stylesPopup.letHeader} >
								<h5>Reset Password</h5>
								{/* <text className={stylesPopup.text}>Message</text> */}
							</div>
							<div>
								<ImCross  onClick={() => setPopup({ ...Popup, enable: false })} className={stylesPopup.crossButton} />
							</div>
						</div>
						<div style={{ marginTop:'20px',marginRight:'4%'}}>
						    {/* <div style={{ marginLeft: '350px' }}>
                                <input type='checkbox' onChange={() => { setEye(!eye) }} />
                                <label>Show Password</label>
                            </div> */}
							<div>
								<div style={{display:"flex",position:'relative'}}>
									<h6>Old Password :</h6><span style={{ marginLeft: '64px' }}><div style={{width:'200px'}}><TableInputText name={'oldPswrd'} type={eye ? 'text' : 'password'} placeholder={'OLD PASSWORD'} required={true} value={PswdDetails.oldPswrd} onChange={changeValue} /></div></span>
									<div className={styles.icon} onClick={() => { setEye(!eye) }}>
                                          <Image height={14} width={20} src={eye ? "/hmr/images/eye.svg" : "/hmr/images/eye_hide.svg"} />
                                    </div>
								</div>
							</div>
							<div >
							     <div style={{ display: "flex", marginTop: '10px',position:'relative' }}>
                                     <h6>New Password :</h6><span style={{ marginLeft: '57px' }}><div style={{width:'200px'}}><TableInputText type={eye1 ? 'text' : 'password'} placeholder={'NEW PASSWORD'} required={true} value={PswdDetails.newPswrd} onChange={changeValue} name={'newPswrd'} /></div></span>
									 <div className={styles.icon} onClick={() => { setEye1(!eye1) }}>
                                          <Image height={14} width={20} src={eye1 ? "/hmr/images/eye.svg" : "/hmr/images/eye_hide.svg"} />
                                    </div>
								 </div>
								{renderHints()}
								{/* <input type={'text'} style={{marginLeft:'40px'}}/> */}
								{/* <text style={{marginLeft:'10px',color:'#1AA3E3'}}><b>{LoginDetails.loginName}</b></text> */}
							</div>
							<div>
							     <div style={{ display: "flex", marginTop: '10px',position:'relative'}}>
                                     <h6>Confirm Password :</h6><span style={{ marginLeft: '31px' }}><div style={{width:'200px'}}><TableInputText type={eye2 ? 'text' : 'password'} placeholder={'CONFIRM PASSWORD'} required={true} value={PswdDetails.cnfPswrd} onChange={ changeValue} name={'cnfPswrd'} /></div></span>
                                     <div className={styles.icon} onClick={() => { setEye2(!eye2) }}>
                                          <Image height={14} width={20} src={eye2 ? "/hmr/images/eye.svg" : "/hmr/images/eye_hide.svg"} />
                                    </div>
								</div>
								{/* <input type='text' style={{marginLeft:'40px'}} /> */}
								{/* <text style={{marginLeft:'10px',color:'#1AA3E3'}}><b>{LoginDetails.loginName}</b></text> */}
							</div>
							<div style={{marginTop:'33px',display:'center'}}>
								<button className={styles.rpsbtn} onClick={onSubmit}>SUBMIT</button>
							</div>

						</div>
					</div>
				</div>
			}
	</div>
    )
}

export default ResetPassword