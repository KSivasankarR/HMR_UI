import React, { Fragment, useEffect, useState } from 'react';
import styles from '../styles/pages/LoginPage.module.scss';
import Image from "next/image";
import TableInputText from '../src/components/TableInputText';
import { useRouter } from 'next/router';
import { CompleteSingup, UserLogin, OfficerLogin, RequestOTPForForgetPswd, ResetPasswordByMail, RequestOTPForEmail, VerifyOTPForEmail, CallTokenInvalidate } from '../src/axios';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import { LoadingAction, PopupAction } from '../src/redux/commonSlice';
import { saveLoginDetails } from '../src/redux/loginSlice';

const LoginPage = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const LoginTypes = [
    { key: 0, label: 'User Login', sublabel: '', name: false, email: true, mobile: false, pswd: true, rpswd: false, emailLabel: false, otp: false, buttonName: 'Login' },
    { key: 1, label: 'Department Login', sublabel: '', name: false, email: true, mobile: false, pswd: true, rpswd: false, emailLabel: false, otp: false, buttonName: 'Login' },
    { key: 2, label: 'New Registration!', sublabel: 'Sign up', name: false, email: true, mobile: false, pswd: false, rpswd: false, otp: false, emailLabel: false, buttonName: 'Send OTP' },
    { key: 3, label: 'Forgot Password', sublabel: 'Email Verify', name: false, email: true, mobile: false, pswd: false, rpswd: false, emailLabel: false, buttonName: 'Send OTP', otp: false, },
    { key: 4, label: 'New Registration!', sublabel: 'OTP Verification', name: false, email: false, mobile: false, pswd: false, rpswd: false, emailLabel: true, otp: true, buttonName: 'Verify OTP' },
    { key: 5, label: 'New Registration!', sublabel: 'User Registration', name: true, email: false, mobile: true, pswd: true, rpswd: true, otp: false, emailLabel: true, buttonName: 'Register' },
    { key: 6, label: 'Forgot Password', sublabel: 'Verify OTP', name: false, email: false, mobile: false, pswd: false, rpswd: false, emailLabel: true, otp: true, buttonName: 'Verify OTP' },
    { key: 7, label: 'Forgot Password', sublabel: 'Change Password', name: false, email: false, mobile: false, pswd: true, rpswd: true, otp: false, emailLabel: true, buttonName: 'SUBMIT' },
  ];

  const Loading = (value: boolean) => {dispatch(LoadingAction({enable:value}));}

  const initialLoginDetails = {
    loginKey: 0,
    loginLabel: '',
    loginName: '',
    loginEmail: '',
    loginMobile: '',
    loginPassword: '',
    loginRPassword: '',
    lastLogin:'',
    sroNumber: '',
    otp: ''
  }
  const passcodeRules = ['* Password should contain atleast 8 characters.', '* Atleast one uppercase character.', '* Atleast one lowercase character.', '* Atleast one digit.', 'Example: tEst1234.'];

  const [SelectedLoginType, setSelectedLoginType] = useState<number>(0);
  const [LoginDetails, setLoginDetails] = useState(initialLoginDetails);
  const [FormErrors, setFormErrors] = useState<any>({});
  const [eye, setEye] = useState<boolean>(false);
  const [eye1, setEye1] = useState<boolean>(false);

  const onChange = (e: any) => {
    let addName = e.target.name;
    let addValue = e.target.value;

    if (addName == "loginPassword" || addName == "loginRPassword") {
      addValue = addValue.replace(' ', '');
    }
    if (addName == "loginName" && addValue.length < 2) {
      addValue = addValue.replace(' ', '');
    }

    if (addName == "loginName") {
      addValue = addValue.replace(/[^\w\s]/gi, "");
      addValue = addValue.replace(/[0-9]/gi, "");
    }

    else if (addName == "loginMobile") {
      if (addValue.length > 10) {
        addValue = addValue.substring(0, 10);
      }
    }
    setLoginDetails({ ...LoginDetails, [addName]: addValue });
  }
  
  useEffect(() => {
    CallTokenInvalidate();
    setTimeout(() =>{localStorage.clear();},200);
    dispatch(saveLoginDetails(initialLoginDetails));
  }, [])


  const onSubmit = (e: any) => {
    e.preventDefault();

    let myError: any = validate(LoginDetails)
    setFormErrors(myError)

    if (Object.keys(myError).length === 0) {
      // window.alert("type"+SelectedLoginType);
      switch (SelectedLoginType) {
        case 0: UserLoginAction(); break;
        case 1: OfficerLoginAction(); break;
        case 2: RegEmailVerification(); break;
        case 3: ForgetEmailVerification(); break;
        case 4: RegOTPVerification(); break;
        case 5: RegisterAction(); break;
        case 6: ForgetOTPVerification(); break;
        case 7: ResetPasswordAction(); break;
        default: break;
      }
    } else {
      // window.alert(JSON.stringify(myError));
    }
  }

  const validate = (values: any) => {
    type errors = {
      loginEmail?: string;
      loginMobile?: string;
      loginRPassword?: string;
      loginPassword?: string;
      loginName?: string;
    };

    const obj: errors = {}
    if (SelectedLoginType == 5 && values.loginMobile.length != 10) {
      obj.loginMobile = "Enter 10 digit valid mobile number.";
    }

    // if (values.loginMobile != "") {
    //   var regex = /^[6789]\d{9}$/;
    //   if (!regex.test(values.loginMobile)) obj.loginMobile = "Enter Valid Mobile Number.";
    // } 

    if ((SelectedLoginType == 5 || SelectedLoginType == 7) && !validateForm(values.loginPassword)) {
      obj.loginPassword = "Please enter a valid and strong password.";
    }

    if ((SelectedLoginType == 5 || SelectedLoginType == 7) && values.loginRPassword != values.loginPassword) {
      obj.loginRPassword = "Password does not match.";
    }

    return obj;
  }

  const UserLoginAction = async () => {
    try {
      let data = {
        loginEmail: LoginDetails.loginEmail,
        loginPassword: LoginDetails.loginPassword
      }

      await CallLogin(data);
    } catch (error) {
      ShowAlert(false, "Error:" + error, "");
    }
  }

  const CallLogin = async (value: any) => {
    Loading(true);
    let result: any = await UserLogin(value);
    Loading(false);
    if (result.status) {
      let query = {
        loginId: result.data.loginId,
        loginEmail: result.data.loginEmail,
        loginName: result.data.loginName,
        lastLogin:result.data.lastLogin,
        token: result.data.token,
        appNo: result.data.appNo,
        loginType: result.data.loginType,
        status: result.data.status,
        registrationDetails: result.data.registrationDetails
      }
      localStorage.setItem("loginDetails", JSON.stringify(query));
      dispatch(saveLoginDetails(query));
    }

    if (result && result.status) {
      router.push({
        pathname: '/UserDashboard',
      })
    } else {
      ShowAlert(false, result.message, "");
    }
  }

  const ShowAlert = (type, message, redirect) => { dispatch(PopupAction({ enable: true, type: type, message: message, redirect: redirect })); }

  const OfficerLoginAction = async () => {

    try {
      let data = {
        loginEmail: LoginDetails.loginEmail,
        loginPassword: LoginDetails.loginPassword
      }

      await CallOfficeLogin(data);
    } catch (error) {
      ShowAlert(false, "Error:" + error, "");
    }
  }

  const CallOfficeLogin = async (value: any) => {
    Loading(true);
    let result: any = await OfficerLogin(value);
    Loading(false);
    let query;
    if(result && result.status){
      query = {
        loginId: result.data.loginId,
        loginEmail: result.data.loginEmail,
        loginName: result.data.loginName,
        token: result.data.token,
        lastLogin:result.data.lastLogin,
        loginType: result.data.loginType,
        sroDistrict: result.data.sroDistrict,
        sroMandal: result.data.sroMandal,
        sroOffice: result.data.sroOffice,
        sroNumber: result.data.sroNumber,
        role: result.data.role,
        villageScretariatCode: result.data.villageScretariatCode,
        villageScretariatName: result.data.villageScretariatName
      }
    } 
    localStorage.setItem("loginDetails", JSON.stringify(query));
    dispatch(saveLoginDetails(query));
    if (result && result.status) {
      router.push({
        pathname: '/OfficeDashboard',
      })
      // localStorage.setItem('LoginUser', JSON.stringify(result.data));
    } else {
      ShowAlert(false, result.message, "");
    }
  }

  const ForgetEmailVerification = async () => {
    try {
      let data = { loginEmail: LoginDetails.loginEmail, }
      await CallForgetEmailVerification(data);

    } catch (error) {
      ShowAlert(false, "Error:" + error, "");

    }
  }

  const CallForgetEmailVerification = async (data) => {
    Loading(true);
    let result: any = await RequestOTPForForgetPswd(data);
    Loading(false);
    if (result && result.status) {
        ShowAlert(true, result.data || result.message, "");
        setSelectedLoginType(6);
    } else {
      ShowAlert(false, result.message, "");
    }
  }

  const ForgetOTPVerification = async () => {
      Loading(true);
      let result: any = await VerifyOTPForEmail(LoginDetails.loginEmail, LoginDetails.otp, 'forgotOtp');
      Loading(false);
      if (result && result.status) {
        ShowAlert(true, result.message || result.data, "");
        setSelectedLoginType(7);
      } else {
        ShowAlert(false, result.message, "");
      }
  }

  const ResetPasswordAction = async () => {
    try {
      let data = {
        loginEmail: LoginDetails.loginEmail,
        loginPassword: LoginDetails.loginPassword,
        otp:LoginDetails.otp
      }
      await CallResetPasswordAction(data);
    } catch (error) { ShowAlert(false, "Error:" + error, ""); }
  }
  const CallResetPasswordAction = async (data) => {
    Loading(true);
    let result: any = await ResetPasswordByMail(data);
    Loading(false);
    if (result && result.status) { 
      LoginDetails.loginPassword="";
      ShowAlert(true, result.message || result.data, ""); 
    }
    else {
      ShowAlert(false, "Password reset failed.", "");
    }
    setSelectedLoginType(0);
  }

  const RegEmailVerification = async () => {
    try {
      let data = { loginEmail: LoginDetails.loginEmail, }
      await CallRegEmailVerification(data);
    } catch (error) {
      ShowAlert(false, "Error:" + error, "");

    }
  }

  const CallRegEmailVerification = async (data) => {
    Loading(true);
    let result: any = await RequestOTPForEmail(data);
    Loading(false);
    if (result) {
      if (result.status) {
        ShowAlert(true, result.message || result.data, "");
        setSelectedLoginType(4);
      }
      else {
        ShowAlert(false, result.message, "");
      }

    } else {
      ShowAlert(false, "Register user failed.", "");
    }
  }

  const RegOTPVerification = async () => {

      Loading(true);
      let result: any = await VerifyOTPForEmail(LoginDetails.loginEmail, LoginDetails.otp, 'regOtp');
      Loading(false);
      if (result && result.status) {
        ShowAlert(true, result.message || result.data, "");
        setSelectedLoginType(5);
      } else {
        ShowAlert(false, result.message, "");
      }
  }

  const RegisterAction = async () => {
    try {
      let data = {
        loginEmail: LoginDetails.loginEmail,
        loginKey: 0,
        loginType: "USER",
        loginName: LoginDetails.loginName,
        loginMobile: LoginDetails.loginMobile,
        loginPassword: LoginDetails.loginPassword,
        otp: LoginDetails.otp
      }

      await CallSignUp(data);
    } catch (error) {
      ShowAlert(false, "Error:" + error, "");

    }
  }

  const CallSignUp = async (value: any) => {
    Loading(true);
    let result: any = await CompleteSingup(value);
    Loading(false);
    if (result && result.status) {
      ShowAlert(true, result.message, "");
      LoginDetails.loginPassword="";
      LoginDetails.loginRPassword="";
      setSelectedLoginType(0);
    } else  if (result && !result.status) {
      ShowAlert(false, result.message, "");
    }  else {
      ShowAlert(false, "Register user failed.", "");
    }
  }

  const renderHints = () => {
    return <div className={styles.ruleBox}>{passcodeRules.map(rule => {
      return <div key={rule}>{rule}</div>
    })}</div>
  }

  const validateForm = (loginPasscode) => {
    if(!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(loginPasscode))){
      // ShowAlert(false, 'Please enter a strong password')
      return false;
    }
    return true;
  }
  return (
    <div>
      <div className={styles.container} style={{ marginBottom: '5rem' }}>
        <div className={styles.leftContainer}>
          <div style={{ margin: '2rem', minHeight: 'calc(100vh - 373px)' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '1rem' }}>
              <div className={styles.button} onClick={()=> window.open("./hmr/pdf/act.pdf","_blank")}>Hindu Marriage Act</div>
              <div className={styles.button} onClick={()=> window.open("./hmr/pdf/rules.pdf","_blank")}>Rules</div>
              <div className={styles.button} onClick={()=> window.open("./hmr/pdf/procedures.pdf","_blank")}>Procedures</div>
              <div className={styles.button} onClick={()=> window.open("./hmr/pdf/user_manual.pdf","_blank")}>User Manual</div>
            </div>
            <div>
              <div>
                <text className={`${styles.TitleText1} ${styles.TitleText2}`} >Checklist</text>
              </div>
              <div className={styles.infoText}>1. Wife minimum age at the solemnisation of marriage – 18 years completed.</div>
              <div className={styles.infoText}>2. Husband minimum age at the solemnisation of marriage – 21 years completed.</div>
              <div className={styles.infoText}>3. Form-A in duplicate along with payment of prescribed fee.</div>
              <div className={styles.infoText}>4. Wedding invitation card.</div>
              <div className={styles.infoText}>5. A photograph of marriage ceremony capturing both wife and husband.</div>
              <div className={styles.infoText}>6. Residential proof of either of the spouse.</div>
              <div className={styles.infoText}>7. Copies of SSC Certificates of wife and husband or passport copies (for Date of Birth proof).</div>
              <div className={styles.infoText}>8. Three witnesses to sign in the form.</div>
              <div className={styles.infoText}>9. Three witnesses to sign in the register of Registrar office.</div>
            </div>
          </div>
          {/* <div className={styles.TopImageContainer}>
            <Image alt='' width={1000} height={90} className={styles.image} src="/hmr/images/topDesign.svg" />
          </div>
          <div className={styles.frameContainer}>
            <div className={styles.leftImageContainer}>
              <Image alt='' width={400} height={400} src="/hmr/images/elephont.svg" />
            </div>
            <Image alt='' width={1000} height={1000} className={styles.image} src="/hmr/images/Frame.svg" />
          </div> */}
        </div>
        <form onSubmit={onSubmit} className={styles.rightContainer} autoComplete="off">
          <div style={{ marginBottom: '2rem' }}>
            <text className={styles.HeadingText}>Hindu Marriage Registration</text>
          </div>
          <div className={styles.TitleText}>{LoginTypes[SelectedLoginType].label}</div>
          <div className={styles.subTitleText} style={{ fontWeight: "bold" }} >{LoginTypes[SelectedLoginType].sublabel}</div>
          {
            LoginTypes[SelectedLoginType].name && <div style={{ paddingTop: '10px', margin: 'auto' }}>
              <text className={styles.keyText}>Full Name :</text>
              <TableInputText name={'loginName'} type='text' placeholder='Firstname Lastname' required={true} value={LoginDetails.loginName} onChange={onChange} />
              <text className={styles.warningText}>{FormErrors.loginName}</text>
            </div>
          }
          {
            LoginTypes[SelectedLoginType].emailLabel && LoginTypes[SelectedLoginType].sublabel!=='User Registration' && <div style={{ paddingTop: '10px', margin: 'auto' }}>
              <text className={styles.keyText}>Email Address : {LoginDetails.loginEmail}</text>
            </div>

          }
          {
            LoginTypes[SelectedLoginType].email && <div style={{ paddingTop: '10px', margin: 'auto' }}>
              <text className={styles.keyText}>Email Address :</text>
              <TableInputText name={'loginEmail'} type='email' placeholder='Enter Email Address' required={true} value={LoginDetails.loginEmail} onChange={onChange} />
            </div>
          }
          {
            LoginTypes[SelectedLoginType].mobile && <div style={{ paddingTop: '5px', margin: 'auto' }}>
              <text className={styles.keyText}>Mobile Number :</text>
              <TableInputText name={'loginMobile'} type='number' placeholder='Enter Mobile Number' required={true} value={LoginDetails.loginMobile} onChange={onChange} />
              <text className={styles.warningText}>{FormErrors.loginMobile}</text>
            </div>
          }
          {
            LoginTypes[SelectedLoginType].pswd && <div style={{ paddingTop: '5px', margin: 'auto' }}>
               <text className={styles.keyText}>Password :</text>
              <div className={styles.inputdata}>
                <TableInputText name={'loginPassword'} type={!eye ? "password" : "text"} placeholder='Enter Password' required={true} value={LoginDetails.loginPassword} onChange={onChange}/>
                <div className={styles.icon} onClick={() => { setEye(!eye) }}>
                <Image height={14} width={20} src={eye ? "/hmr/images/eye.svg" : "/hmr/images/eye_hide.svg"} />
                </div>
              </div>
             <text className={styles.warningText}>{FormErrors.loginPassword}</text>
              {
                LoginTypes[SelectedLoginType].rpswd && FormErrors.loginPassword && renderHints()
              }
            </div>
          }
          {
            LoginTypes[SelectedLoginType].rpswd && <div style={{ paddingTop: '5px', margin: 'auto' }}>
              <text className={styles.keyText}>Confirm Password :</text>
              <div className={styles.inputdata}>
                <TableInputText name={'loginRPassword'} type={!eye1 ? "password" : "text"} placeholder='Enter Password Again' required={true} value={LoginDetails.loginRPassword} onChange={onChange} />
                  <div className={styles.icon} onClick={() => { setEye1(!eye1) }}>
                  <Image height={14} width={20} src={eye1 ? "/hmr/images/eye.svg" : "/hmr/images/eye_hide.svg"} />
                 </div>
              </div>
               <text className={styles.warningText}>{FormErrors.loginRPassword}</text>
            </div>
          }
          {
            LoginTypes[SelectedLoginType].otp && <div style={{ paddingTop: '5px', margin: 'auto' }}>
              <text className={styles.keyText}>Verification Code :</text>
              <TableInputText name={'otp'} type='number' placeholder='Enter Verification Code' required={true} value={LoginDetails.otp} onChange={onChange} />
              <text className={styles.warningText}>{FormErrors.otp}</text>
            </div>
          }

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
            {SelectedLoginType == 0 && <text onClick={() => { setSelectedLoginType(3); setLoginDetails(initialLoginDetails) }} className={styles.pointerText} >Forgot Password ?</text>}
            {(SelectedLoginType != 1 && SelectedLoginType != 0) ? <text onClick={() => { setSelectedLoginType(0); setLoginDetails(initialLoginDetails) }} className={styles.pointerText}>Back to User Login</text> : []}
          </div>
          <div className={styles.loginButtonContainer}>
            <button className={styles.loginButton}> <text className={styles.buttonText}>{LoginTypes[SelectedLoginType].buttonName}</text></button>
          </div>
          <div style={{ marginTop: '15px' }}>
            {SelectedLoginType == 0 && <div style={{ marginTop: '10px' }}>
              <text className={styles.simpleText} >Don’t have an account? </text>
              <text onClick={() => { setSelectedLoginType(2); setLoginDetails(initialLoginDetails) }} className={styles.RegPointerText}>New Registration!</text>
            </div>
            }
          </div>
        </form>
        <div style={{ display: 'flex',cursor:'pointer', justifyContent: 'flex-start', gap: '1rem', marginTop:'2em', marginLeft:'5em', height:'10%' }} >
          {SelectedLoginType == 1 && <div style={{paddingLeft:'0.8em', paddingRight:'0.6em'}} className={styles.button} onClick={() => { setSelectedLoginType(0); setLoginDetails(initialLoginDetails) }} > User Login </div>}
          {SelectedLoginType == 0 && <div className={styles.button} onClick={() => { setSelectedLoginType(1); setLoginDetails(initialLoginDetails) }} >Dept. Login</div>}
          </div>
      </div>
    </div>
  )
}

export default LoginPage;