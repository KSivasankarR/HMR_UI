import React, { useState, useEffect } from 'react'
import styles from '../styles/pages/ViewUserDetails.module.scss';
import { useRouter } from 'next/router';
import { Table } from 'react-bootstrap';
import { GetUserByAppNo, CallTokenInvalidate, UseGetReceipt } from '../src/axios';
import UploadContainer from '../src/components/UploadContainer';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import { LoadingAction, PopupAction } from '../src/redux/commonSlice';
import { handleLogOut } from '../utils';

const initialUserDetails = {
    husbandName: "",
    husbandReligion: "",
    husbandCaste: "",
    husbandDateofBirth: "",
    husbandMobile: "",
    husbandMarriageAge: "",
    husbandRankorProfession: "",
    husbandCountry: "",
    husbandState: "",
    husbandDistrict: "",
    husbandMandal: "",
    husbandVillageWard: "",
    husbandAddress: "",
    husbandOffice: "",
    husbandRelationship: "",
    husbandFatherName: "",
    husbandMotherName: "",
    wifeName_beforeMarriage: "",
    wifeName_afterMarriage: "",
    change_wifeName_to_afterMarriage: "",
    wifeReligion: "",
    wifeCaste: "",
    wifeDateofBirth: "",
    wifeMobile: "",
    wifeMarriageAge: "",
    wifeRankorProfession: "",
    wifeCountry: "",
    wifeState: "",
    wifeDistrict: "",
    wifeMandal: "",
    wifeVillageWard: "",
    wifeAddress: "",
    wifeOffice: "",
    wifeRelationship: "",
    wifeFatherName: "",
    wifeMotherName: "",
    isWifeDivorce: "",
    marriageDate: "",
    marriageCountry: "",
    marriageState: "",
    marriageDistrict: "",
    marriageMandal: "",
    marriageVillageWard: "",
    marriageAddress: "",
    marriageType: "",
    regDate: "",
    appNo: "",
    status: "",
    sroOffice: "",
    slotDate: "",
    slotTime: "",
    certificateCopies: "",
    casteType: "",
    loginKey: "",
    loginLabel: "",
    loginName: "",
    loginEmail: "",
    loginMobile: "",
    loginPassword: "",
    loginRPassword: "",
    doc_final_regForm: "",
    doc_final_regForm_upload: "",
    documents: [],
}


const Receipt = () => {
    let initialLoginDetails = useAppSelector((state) => state.login.loginDetails);
    const [LoginDetails, setLoginDetails] = useState(initialLoginDetails);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [AllowToSubmit, setAllowToSubmit] = useState(false);
    const [UserDetails, setUserDetails] = useState<any>(initialUserDetails);
    // const [LoginDetails, setLoginDetails] = useState<any>(
    //     {
    //         loginId: '',
    //         loginEmail: '',
    //         loginName: '',
    //         token: '',
    //         appNo: '',
    //         status: '',
    //         loginType: ''
    //     }
    // )
    const ShowAlert = (type, message, redirect) => { dispatch(PopupAction({ enable: true, type: type, message: message, redirect: redirect })); }
    const Loading = (value: boolean) => {dispatch(LoadingAction({enable:value}));}
    const GetUserDetails = async (registrationId: any) => {
        try{
            Loading(true);
            let data = await GetUserByAppNo(registrationId, LoginDetails.loginType);
            Loading(false);
            if (data) {
               
                let myData =  data.data;
                myData = {...myData, registrationId:registrationId}
                setUserDetails(myData); 
            }
        }catch(err){
            console.log(err);
        }
       
    }


    useEffect(() => {
        let data: any = localStorage.getItem("loginDetails");
        data = JSON.parse(data);
        if (data && data.token && (data.loginType === 'USER' || data.loginType === 'user')) {
            let registrationIDVal;
            if(localStorage.getItem("Prieview")!=undefined && localStorage.getItem("Prieview")!=null)
            {
                let data2 = JSON.parse(localStorage.getItem("Prieview"));
                if(data2&&data2.registrationId&&data2.registrationId !="")
                    registrationIDVal = data2.registrationId;
            }
            else
                registrationIDVal = localStorage.getItem("registrationId");
            
            if(registrationIDVal != undefined && registrationIDVal != null && registrationIDVal.length>0){
                GetUserDetails(registrationIDVal);
                setLoginDetails(data)
            }
        }
        else {
            handleLogOut()
        }
        if (UserDetails.status === "NEW") {
            window.addEventListener("popstate", handleBackArrow);
            return () => {
                window.removeEventListener("popstate", handleBackArrow);
            };
        }
    }, [UserDetails.status]);

    const handleBackArrow = () => {
        router.push("/UserDashboard");
    };

    const DisplayTable = (key: any, value: any) => {
        return (
            <div className={styles.AddressClassForDiv} style={{ display: 'flex', justifyContent:'center', }}>
                <div style={{ width: '50%', marginRight:'20px', display:'flex', justifyContent:'flex-end', marginTop:'0px' }} >
                    <text className={styles.keyText} style={{marginTop:'2px'}}>{key}</text>
                </div>
                <div className={styles.valueText} style={{marginTop:'2px'}}>:</div>
                <div style={{ width: '40%', marginLeft:'20px', display:'flex', justifyContent:'flex-start', marginTop:'0px' }} >
                    <text className={styles.valueText} style={{marginTop:'2px'}}>{value}</text>
                </div>

            </div>
        );
    }


 

    const ChangeDateFormat = (Date: string) => {
        if (Date) {
            let Arry = Date.split('-');
            return (Arry[2] + "-" + Arry[1] + "-" + Arry[0])
        }
        return Date;

    }

    const PrintRecept = async(id)=>{
        Loading(true);
        let result = await UseGetReceipt(id);
        Loading(false);
    }


    return (
        <div>
            <div className={styles.Navbar}>
                {/* <text>{JSON.stringify(UserDetails.loginType)}</text> */}
                <text className={styles.NavbarText}> Welcome : {LoginDetails.loginName.toUpperCase()}</text>
                <text className={styles.NavbarText}> Last Login : {LoginDetails.lastLogin}</text>
                <div style={{ cursor: 'pointer' }} onClick={() => { handleLogOut() }} ><text className={styles.NavbarText}> Logout </text></div>
            </div>
            <div className={styles.Container}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <text className={styles.DashboardTitleText}>HINDU MARRIAGE REGISTRATION</text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <text style={{ color:'green', fontSize:'20px'}}>Your application saved successfully.</text>
                </div>

                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <div className={styles.ListComponentContainer}>
                        <div style={{display:'flex', justifyContent:'center'}}>
                        <text className={styles.TitleText} style={{margin:'0px'}}>Acknowledgement Receipt</text>
                        </div>
                        {DisplayTable("Application Number", UserDetails.appNo)}
                        {DisplayTable("Husband Name", UserDetails.husbandName)}
                        {DisplayTable("Wife Name", UserDetails.wifeName_beforeMarriage)}
                        {UserDetails.villageScretariatName != null && UserDetails.villageScretariatName != undefined && UserDetails.villageScretariatName != "" ? DisplayTable("Village Secretariat Name", UserDetails.villageScretariatName):DisplayTable("Sub Registrar Office", UserDetails.sroOffice)}
                        {DisplayTable("Slot Date", ChangeDateFormat(UserDetails.slotDate))}
                        {DisplayTable("Slot Time", UserDetails.slotTime)}
                    </div>
                </div>
            
            <div style={{display:'flex', justifyContent:'center' }}>
                <text style={{color:'red'}}>Note:</text>
                <text>Please visit to designated sub registrar/village secretariat office on selected slot date.</text>
            </div>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop:'5px' }}>
                <div onClick={() => PrintRecept(UserDetails.appNo)} className={styles.EditButton2} style={{width:'100px'}}><text className={styles.NavbarText}>Print</text></div>
                <div onClick={() => { router.push("/UserDashboard"); }} className={styles.EditButton2} style={{width:'100px'}}><text className={styles.NavbarText}>Exit </text></div>
            </div>
            </div>

            {/* <pre>{JSON.stringify(UserDetails, null, 2)}</pre> */}
        </div>
    )
}

export default Receipt;