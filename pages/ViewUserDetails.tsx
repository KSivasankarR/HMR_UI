import React, { useState, useEffect } from 'react'
import styles from '../styles/pages/ViewUserDetails.module.scss';
import { useRouter } from 'next/router';
import { Table } from 'react-bootstrap';
import TableInputText from '../src/components/TableInputText';
import TableText from '../src/components/TableText';
import {
    GetUserByAppNo, UploadDoc, GetFormLink, SaveUser, GetFormLinkUser,
    downloadFileByNameAndAppNo, CallTokenInvalidate, GetVerificationStatus,
    Esigncoordinates,PendingEsign,DefaceCFMSChallan
} from '../src/axios';
import UploadContainer from '../src/components/UploadContainer';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import { ConfirmAction, LoadingAction, PopupAction } from '../src/redux/commonSlice';
import { Row, Col } from 'react-bootstrap'
import { handleLogOut } from '../utils';
import Image from 'next/image';

const initialUserDetails = {
    husbandAadhar: "",
    wifeAadhar: "",
    husbandPassport: "",
    wifePassport: "",
    husbandAadharOtp: "",
    wifeAadharOtp: "",
    husbandDOI:"",
    husbandDOE:"",
    wifeDOI:"",
    wifeDOE:"",
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
    documentNumber: "",
    updatedAt:"",
    documents: [],
    husbandeSignAadhar:"",
    wifeeSignAadhar:"",
    witness1Aadhar: "",
    witness2Aadhar: "",
    witness3Aadhar: "",
    sroAadhar: "",
    witness1Name:"",
    witness2Name:"",
    witness3Name:"",
    srName:"",
    husbandeSignStatus: false,
	wifeeSignStatus: false,
	witness1eSignStatus: false,
	witness2eSignStatus: false,
	witness3eSignStatus: false,
	sroeSignStatus: false,
}


const ViewUserDetails = () => {
    let initialLoginDetails = useAppSelector((state) => state.login.loginDetails);
    const ConfirmMemory = useAppSelector((state) => state.common.ConfirmMemory);
    const [LoginDetails, setLoginDetails] = useState(initialLoginDetails);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [AllowToUpload, setAllowToUpload] = useState(false);
    const [UserDetails, setUserDetails] = useState<any>(initialUserDetails);
    const [payData, setPayData] = useState<any>({})
    const [showInputs, setShowInputs] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [esignUrl, setEsignUrl] = useState("");
    const [xmlValue, setXMLValue] = useState('');
    const [FieldName, setFieldName] = useState("esignRequest");
    const [esignRequestValue, setEsignRequestValue] = useState('');
    const igrsEsign = true;

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

    useEffect(() => {
      if(ConfirmMemory.enable==false && ConfirmMemory.result !="" && ConfirmMemory.operation =="generate Certifricate"){

        if(ConfirmMemory.result =="YES"){
            dispatch(ConfirmAction({ enable: false,message:"", buttons:[], operation:"",result:""})) 
            CallGetFormLink(UserDetails._id,LoginDetails.sroNumber) 
        }
        
      }
    });
    
      const Pendingesign = async () => {
        try {
            let registrationNumber = UserDetails.appNo;
            let rrnvalue = localStorage.getItem('rrnvalue');
    
            if (!registrationNumber || !rrnvalue) return;
    
            let data = {
                registrationNumber: registrationNumber,
                esignstatus: rrnvalue
            };
            Loading(true);
            const response = await PendingEsign(data);
            Loading(false);
            if (response) {
                ShowAlert(
                    !response.message?.message ? true : false,
                    response.message?.message || response.message,
                    ""
                );
                const loginData = localStorage.getItem("loginDetails");
                if (loginData) {
                    const parsedData = JSON.parse(loginData);
                    if (parsedData?.token) {
                        setLoginDetails(parsedData);
                        const regId = localStorage.getItem('registrationId');
                        if (regId) {
                            GetUserDetails(regId, parsedData.loginType);
                        }
                    }
                }
                localStorage.removeItem('rrnvalue');
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            localStorage.removeItem('rrnvalue');
        }
    };

  
    const Esign = async (role:any) => {
        try {
            let data = {
                registrationNumber: UserDetails?.appNo,
                flag: role,
                aadhar: '',
                aadharname: '',
                searchText: ''
            };
    
            switch (role) {
                case 'husband':
                    data.aadhar = UserDetails.husbandeSignAadhar;
                    data.aadharname = UserDetails.husbandName;
                    data.searchText = 'HUSBAND SIGNATURE';
                    if (UserDetails.husbandAadhar !== UserDetails.husbandeSignAadhar) {
                        ShowAlert(false, "Husband Aadhaar does not match.", "");
                        return;
                    }
                    break;
                case 'wife':
                    data.aadhar = UserDetails.wifeeSignAadhar;
                    data.aadharname = UserDetails.wifeName_beforeMarriage;
                    data.searchText = 'WIFE SIGNATURE';
                    if (UserDetails.wifeAadhar !== UserDetails.wifeeSignAadhar) {
                        ShowAlert(false, "Wife Aadhaar does not match.", "");
                        return;
                    }
                    break;
                case 'witness1':
                    data.aadhar = UserDetails.witness1Aadhar;
                    data.aadharname = UserDetails.witness1Name;
                    data.searchText = 'WIT1';
                    break;
                case 'witness2':
                    data.aadhar = UserDetails.witness2Aadhar;
                    data.aadharname = UserDetails.witness2Name;
                    data.searchText = 'WIT2';
                    break;
                case 'witness3':
                    data.aadhar = UserDetails.witness3Aadhar;
                    data.aadharname = UserDetails.witness3Name;
                    data.searchText = 'WIT3';
                    break;
                case 'sro':
                    data.aadhar = UserDetails.sroAadhar;
                    data.aadharname = UserDetails.srName;
                    data.searchText = ['SIGNATURE OF THE REGISTRAR', 'Marriage Registrar'].join(','); 
                    break;
            }
    
            if (!data.aadhar) {
                ShowAlert(false,"Aadhaar number is required for eSign.", "");
                return;
            }
            if (data.aadhar.length !== 12) {
                ShowAlert(false, "Aadhaar number must be in 12 digits only.", "");
                return;
            }
            if (!data.aadharname) {
                ShowAlert(false,"Aadhaar name is required for eSign.", "");
                return;
            }
    
            if (!checkForDuplicateAadhar(data.aadhar, role)) {
                return;
            }
    
            Loading(true);
            let result = await Esigncoordinates(data);
            Loading(false);
    
            if (!result || result.message) {
                ShowAlert(false,`Error: ${result.message || "Something went wrong"}`, "");

                return;
            }
        
            setEsignUrl(result.data?.esignPostUrl); 
            setXMLValue(result.data?.eSignRequest);
            setFieldName(result.data?.fieldName);
    
            let rrnvalue = result.rrn;
            localStorage.setItem('rrnvalue', rrnvalue);
    
            setEsignRequestValue(result.data);
        } catch (error) {
            console.error("Esign function error:", error);
            ShowAlert(false,`Error: ${error.message || "Unexpected error occurred"}`, "");

        }
    };
    
    useEffect(() => {
        if (esignRequestValue) {
            const form = document.getElementById(
                "createEsignForm"
            ) as HTMLFormElement | null;
            const esignRequestInput = form?.querySelector(
                'input[name="esignRequest"]'
            ) as HTMLInputElement | null;

            if (esignRequestInput) {
                esignRequestInput.value = esignRequestValue;
                form.submit();
            }
        }
    }, [esignRequestValue]);


    useEffect(() => {
        if (xmlValue) {
            if (igrsEsign) {
                let ID: any = document.getElementById('igrs_input');
                ID.click();
            } else {
                let ID = document.getElementById('xmlInput');
                ID.click();
            }
        }
    }, [xmlValue])

 
    const handleAadharChange = (e, field) => {
        let value = e.target.value;
        if (field.includes('Aadhar')) {
            value = value.replace(/\D/g, '').slice(0, 12);
        } else {
            value = value
            .replace(/[^A-Za-z ]/g, '')      
            .replace(/\s{2,}/g, ' ')       
            .replace(/^\s+/g, '')             
            .toUpperCase();     
        }
        setUserDetails(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    const checkForDuplicateAadhar = (aadharNumber: string, role: string) => {
        const aadharNumbers = [
            UserDetails.husbandeSignAadhar,
            UserDetails.wifeeSignAadhar,
            UserDetails.witness1Aadhar,
            UserDetails.witness2Aadhar,
            UserDetails.witness3Aadhar,
            UserDetails.sroAadhar
        ].filter(Boolean);
    
        const count = aadharNumbers.filter(aadhar => aadhar === aadharNumber).length;
    
        if (count > 1) {
            ShowAlert(false,`This Aadhaar number (${aadharNumber}) has already been entered.`, "");
            return false;
        }

        if (aadharNumber === UserDetails.husbandAadhar && role !== "husband") {
            ShowAlert(false, "This is Husband's Aadhaar number. Please enter it only in Husband's section.", "");
            return false;
        }
    
        if (aadharNumber === UserDetails.wifeAadhar && role !== "wife") {
            ShowAlert(false, "This is Wife's Aadhaar number. Please enter it only in Wife's section.", "");
            return false;
        }
    
        if (role === "husband" && aadharNumber !== UserDetails.husbandAadhar) {
            ShowAlert(false, "This is not Husband's Aadhaar number.", "");
            return false;
        }
    
        if (role === "wife" && aadharNumber !== UserDetails.wifeAadhar) {
            ShowAlert(false, "This is not Wife's Aadhaar number.", "");
            return false;
        }
    
        return true;
    };

    const AskConfirmation =async (message,buttons,operation)=>{dispatch(ConfirmAction({ enable: true,message:message, buttons:buttons, operation:operation}));} 
    const ShowAlert = (type, message,redirect) => { dispatch(PopupAction({ enable: true, type: type, message: message, redirect:redirect })); }
    const Loading = (value: boolean) => {dispatch(LoadingAction ({enable:value}));}

    const GetUserDetails = async (registrationId: any, loginType: any) => {
        Loading(true);
        let data = await GetUserByAppNo(registrationId, loginType);
        Loading(false);
        if (data) {
            if( (data.data.paymentType && data.data.paymentType=="PAY ONLINE") ||
                (data.data.transactionId && data.data.transactionId.length>0))
            {
                if( (data.data.transactionId).indexOf("_")>-1 && (data.data.payStatus!=undefined && !data.data.payStatus))   
                    setShowForm(false);
                else
                    setShowForm(true);
            }
            else
                setShowForm(true);
            
            let data2 = {...data.data, registrationId:registrationId}
             setUserDetails(data2); 
        }
    }

    const CallGetFormLink = async (appNo: any,sroNumber:any) => {
        Loading(true);
        let data = await GetFormLink({appNo,sroNumber});
        Loading(false);
        if (data.Success) {
            setUserDetails({...UserDetails,cert_url:data.Url, documentNumber: data.documentNumber});
            setTimeout(() => {
                setAllowToUpload(true);
            }, 500);
        }
        else
        {
            ShowAlert(false,data.message, "");
        }
    }


    useEffect(() => {
        let data: any = localStorage.getItem("loginDetails");
        data = JSON.parse(data);
        if (data && data.token) {
            // window.alert(localStorage.getItem("registrationId"));
            GetUserDetails(localStorage.getItem("registrationId"), data.loginType);
            setLoginDetails(data)
        }
        else {
            handleLogOut()
        }
    }, [])

    
    useEffect(() => {
        const registrationNumber = UserDetails.appNo;     
        const rrnvalue = localStorage.getItem('rrnvalue');
        if (registrationNumber && rrnvalue) {
          Pendingesign();
        }
      }, [UserDetails]);

    const ShiftToLocation = (location: string) => {
        router.push({
            pathname: location,
            // query: query,
        })
    }


    const DisplayTable = (key: any, value: any) => {
        return (
            <div className={styles.AddressClassForDiv} style={{ display: 'flex' }}>
                <div className={styles.KeyContainer} >
                    <text className={styles.keyText}>{key}</text>
                </div>
                <div>:</div>
                {key=="Address"?
                    <div className={styles.ValueContainer}>
                        <text className={styles.valueText}>{value}</text>
                    </div>
                    :
                    <div className={styles.ValueContainer}>
                        <text className={styles.valueText}>{value}</text>
                    </div>
                }
            </div>
        );
    }

    const OnFileSelect = async (event: any, docName: string, uploadName: string) => {
        setUserDetails({ ...UserDetails, [uploadName]: "process" });
        const formData = new FormData();
        formData.append('image', event.target.files[0]);
        let data: any = {
            docName: docName,
            registrationId: UserDetails._id
        }
        Loading(true);
        let result = await UploadDoc(data, formData, LoginDetails.loginType);
        Loading(false);
        if (result.status) {
            ShowAlert(true, "File uploaded successfully.","");
            setUserDetails({ ...UserDetails, [uploadName]: "true" });
        }
        else { setUserDetails({ ...UserDetails, [uploadName]: "false" }); }
    }

    const MakeProcessDone = async (user: any) => {
        Loading(true);
        let success = await SaveUser({ registrationId: UserDetails._id, status: 'COMPLETED' }, LoginDetails.loginType);
        Loading(false);
        if (success == "User data saved successfully.") {
            return ShowAlert(true, "Registration process is completed successfully.","/OfficeDashboard");
        }
        else {
            return ShowAlert(false, success, "");
        }
    }

    const GetVerificationTransactionStatus = async (deptTransID: any) => {
        Loading(true);
        let result = await GetVerificationStatus(deptTransID);
        Loading(false);
        if (result && result.status) {
            setShowInputs(true);
            setPayData({ ...result.data })
            ShowAlert(true,result.message,"");
        }
        else {
            setShowInputs(false);
            setShowForm(false);
            return ShowAlert(false,result.message,"");
        }
    }

    const GetDefaceStatus = async (deptTransID: any) => {
        Loading(true);
        let result = await DefaceCFMSChallan(deptTransID);
        Loading(false);
        if (result && result.status) {
            setShowForm(true)
            setShowInputs(false)
            return ShowAlert(true,result.message,"");
        }
        else {
            setShowForm(false);
            return ShowAlert(false,result.message,"");
        }
    }

    const GoBack = () => {
        // let login = { ...LoginDetails, sroOffice: UserDetails.sroOffice }
        if(LoginDetails.loginType=="officer")
            ShiftToLocation("/OfficeDashboard");
        else
            ShiftToLocation("/UserDashboard");
    }

    const OpenCertficate = (data)=>{
        data = data.find(x=>x.fileName=="doc_final_regForm");
        window.open(data.downloadLink);
    }

    const DisplayLablesForDocs = (label: string) => {
        switch (label) {
            case "doc_weddingCard": return "Wedding Card";
            case "doc_husbandBirthProof": return "Husband's Proof of Birth";
            case "doc_wifeBirthProof": return "Wife's Proof of Birth";
            case "doc_marriagePhoto": return "Marriage Photo";
            case "doc_husbandResidenceProof": return "Husband Residence Proof";
            case "doc_wifeResidenceProof": return "Wife Residence Proof";
            case "doc_receipt": return "Payment Receipt";
            case "doc_husBandPhoto": return "Husband Photo";
            case "doc_final_regForm": return "Final Form";
            case "doc_marriageRecept": return "Marriage Function Hall Receipt";
            case "doc_isHusbandDivorcee": return "Decree of Court (Husband)";
            case "doc_isHusbandWidower": return "Proof of Death (Deceased Wife)";
            case "doc_isWifeDivorcee": return "Decree of Court (Wife)";
            case "doc_isWifeWidow": return "Proof of Death (Deceased Husband)";
            case "doc_marriageRecept": return "Marriage Hall Receipt"
            case "doc_wifePhoto": return "Wife Photo";
            case "doc_husbandPhoto": return "Husband Photo";
            default: return "Unknown Document";
        }
    }

    const ChangeDateFormat = (Date: string) => {
        if (Date) {
            let Arry = Date.split('-');
            return (Arry[2] + "-" + Arry[1] + "-" + Arry[0])
        }
        return Date;

    }

    const onCancelUpload = (uploadKey)=>{
        setUserDetails({ ...UserDetails, [uploadKey]: ""});
    }

    const allSigned =
    (!UserDetails.husbandeSignAadhar || UserDetails.husbandeSignStatus) &&
    (!UserDetails.wifeeSignAadhar || UserDetails.wifeeSignStatus) &&
    UserDetails.witness1eSignStatus &&
    UserDetails.witness2eSignStatus &&
    UserDetails.witness3eSignStatus &&
    UserDetails.sroeSignStatus;


    return (
        <div>
            <div className={styles.Navbar}>
                {/* <text>{JSON.stringify(UserDetails.loginType)}</text> */}
                <text className={styles.NavbarText}> Welcome : {LoginDetails.loginName.toUpperCase()}</text>
                <text className={styles.NavbarText}> Last Login : {LoginDetails.lastLogin}</text>
                <div style={{ cursor: 'pointer' }} onClick={() => { handleLogOut() }} ><text className={styles.NavbarText}> Logout </text></div>
            </div>
            <div className={styles.Container}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <text className={styles.DashboardTitleText}>{LoginDetails.loginType && LoginDetails.loginType.toUpperCase() == "USER" ? 'Registration Details' : "User Details"}</text>
                    {LoginDetails.loginType &&
                        <div style={{ display: 'flex' }}>
                        {(UserDetails && UserDetails.cert_url=="" && LoginDetails.loginType.toUpperCase() == "OFFICER" && LoginDetails.role && 
                            ((LoginDetails.role === "SRO" && (UserDetails.villageScretariatCode==""||UserDetails.villageScretariatCode==null)) || 
                            (LoginDetails.role === "VR" && UserDetails.villageScretariatCode) ))?<div className={styles.EditButton} onClick={() => {
                            if(UserDetails.status == "DRAFT")
                            {
                                localStorage.setItem("redirectFrom", "ViewUserDetails");
                                localStorage.setItem("Prieview", JSON.stringify(UserDetails));
                                ShiftToLocation("/Registrations")
                            }else{
                                ShiftToLocation("/OfficerUserUpdate")
                            } 
                    }}><text className={styles.NavbarText}>Edit</text></div>:null}
                        <div className={styles.EditButton} onClick={GoBack}><text className={styles.NavbarText}>Back</text></div>
                    </div>
                    }
                </div>
                <div style={{width:'100%'}}>
                    <div style={{ display: 'flex' }}>
                        <div className={styles.ListComponentContainer}>
                            <text className={styles.TitleText}>Slot Details</text>
                            {DisplayTable("Application Number", UserDetails.appNo)}
                            {DisplayTable("Date of Registration", UserDetails.regDate)}

                            {UserDetails.villageScretariatName != null && UserDetails.villageScretariatName != undefined && UserDetails.villageScretariatName != "" ? DisplayTable("Village Secretariat Name", UserDetails.villageScretariatName):null}
                            {DisplayTable("SRO Office", UserDetails.sroOffice)}
                            {DisplayTable("Slot Date", ChangeDateFormat(UserDetails.slotDate))}
                            {DisplayTable("Slot Time", UserDetails.slotTime)}
                            {DisplayTable("Number of Certificate Copies", UserDetails.certificateCopies)}

                        </div>
                        <div className={styles.ListComponentContainer}>
                            <text className={styles.TitleText}>Marriage Details</text>
                            {DisplayTable("Date of Marriage", ChangeDateFormat(UserDetails.marriageDate))}
                            {DisplayTable("Husband Age at the time of Marriage", UserDetails.husbandMarriageAge)}
                            {DisplayTable("Wife Age at the time of Marriage", UserDetails.wifeMarriageAge)}
                            {DisplayTable("Place of Marriage", UserDetails.marriageAddress)}
                            {DisplayTable("Status", UserDetails.status)}
                        </div>

                    </div>
                    <div style={{ display: 'flex' }}>
                        <div className={styles.ListComponentContainer}>
                            <text className={styles.TitleText}>Husband Details</text>
                            {DisplayTable(" Name", UserDetails.husbandName)}
                            {DisplayTable(" Religion", UserDetails.husbandReligion)}
                            {DisplayTable(" Caste", UserDetails.husbandOtherCaste ? UserDetails.husbandOtherCaste : UserDetails.husbandCaste)}
                            {DisplayTable(" Date of Birth", ChangeDateFormat(UserDetails.husbandDateofBirth))}
                            {DisplayTable(" Mobile Number", UserDetails.husbandMobile)}
                            {DisplayTable(" Country", UserDetails.husbandCountry)}
                            {DisplayTable(" State", UserDetails.husbandState)}
                            {DisplayTable("Address", UserDetails.husbandAddress)}
                            {DisplayTable("Relationship", UserDetails.husbandRelationship)}
                            {DisplayTable(" Father Name", UserDetails.husbandFatherName)}
                            {DisplayTable(" Mother Name", UserDetails.husbandMotherName)}
                            {DisplayTable(" Is Husband a Widower", UserDetails.isHusbandWidower)}
                            {DisplayTable(" Is Husband a Divorcee", UserDetails.radio_isHusbandDivorcee)}
                            {UserDetails.husbandAadhar === null || UserDetails.husbandAadhar===undefined || UserDetails.husbandAadhar === "" ?DisplayTable(" Passport Number", UserDetails.husbandPassport):DisplayTable("Aadhaar Number", UserDetails.husbandAadhar)}
                            {UserDetails.husbandPassport != null && UserDetails.husbandPassport!=undefined && UserDetails.husbandDOI != "" ?DisplayTable(" Passport Date of Issue", UserDetails.husbandDOI):null}
                            {UserDetails.husbandPassport != null && UserDetails.husbandPassport!=undefined && UserDetails.husbandPassport != "" ?DisplayTable(" Passport Date of Expiry", UserDetails.husbandDOE):null}
                            {UserDetails.radio_isHusbandDivorcee == "YES" && DisplayTable(" Husband Divorcee Date", ChangeDateFormat(UserDetails.isHusbandDivorcee))}
                        </div>

                        <div className={styles.ListComponentContainer}>
                            <text className={styles.TitleText}>Wife Details</text>
                            {DisplayTable("Name Before Marriage", UserDetails.wifeName_beforeMarriage)}
                            {DisplayTable("Name After Marriage", UserDetails.wifeName_afterMarriage == '' ? ' N/A ' : UserDetails.wifeName_afterMarriage)}
                            {DisplayTable("Request to Change Name", UserDetails.change_wifeName_to_afterMarriage)}
                            {DisplayTable("Religion", UserDetails.wifeReligion)}
                            {DisplayTable("Caste", UserDetails.wifeOtherCaste ? UserDetails.wifeOtherCaste : UserDetails.wifeCaste)}
                            {DisplayTable("Date of Birth", ChangeDateFormat(UserDetails.wifeDateofBirth))}
                            {DisplayTable("Mobile Number", UserDetails.wifeMobile)}
                            {/* {DisplayTable("Profession", UserDetails.wifeRankorProfession)} */}
                            {DisplayTable("Country", UserDetails.wifeCountry)}
                            {DisplayTable("State", UserDetails.wifeState)}
                            {DisplayTable("Address", UserDetails.wifeAddress)}
                            {DisplayTable("Relationship", UserDetails.wifeRelationship)}
                            {DisplayTable("Father Name", UserDetails.wifeFatherName)}
                            {DisplayTable("Mother Name", UserDetails.wifeMotherName)}
                            {DisplayTable("Is Wife a Widow", UserDetails.isWifeWidow)}
                            {DisplayTable("Is Wife a Divorcee", UserDetails.radio_isWifeDivorcee)}
                            {UserDetails.wifeAadhar === null || UserDetails.wifeAadhar===undefined || UserDetails.wifeAadhar === "" ?DisplayTable(" Passport Number", UserDetails.wifePassport):DisplayTable(" Aadhaar Number", UserDetails.wifeAadhar)}
                            {UserDetails.wifePassport != null && UserDetails.wifePassport!=undefined && UserDetails.wifePassport != "" ?DisplayTable(" Passport Date of Issue", UserDetails.wifeDOI):null}
                            {UserDetails.wifePassport != null && UserDetails.wifePassport!=undefined && UserDetails.wifePassport != "" ?DisplayTable(" Passport Date of Expiry", UserDetails.wifeDOE):null}
                            {UserDetails.radio_isWifeDivorcee == "YES" && DisplayTable("Wife Divorcee Date", ChangeDateFormat(UserDetails.isWifeDivorcee))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="row">
                    <div className="col s12 board">
                        <Table striped bordered hover>
                            <thead className={styles.TitleText}>
                                <tr>
                                    <th>Document Name</th>
                                    <th>View Document</th>
                                </tr>
                            </thead>
                            <tbody>
                                {UserDetails.documents.map((item: any, index: number) => {
                                    if(item.fileName=="doc_final_regForm"){return}
                                    return [
                                        <tr key={index}>
                                            <td>{DisplayLablesForDocs(item.fileName)}</td>
                                            <td><a href="javascript:void(0)" onClick={() => {
                                                downloadFileByNameAndAppNo(item.fileName, UserDetails.appNo,LoginDetails.loginType);
                                            }} > View </a></td>
                                        </tr>
                                    ];
                                })}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
            
            {LoginDetails.loginType && LoginDetails.loginType.toUpperCase() != "USER" && LoginDetails.role && ((LoginDetails.role === "SRO" && 
            (UserDetails.villageScretariatCode === "" || UserDetails.villageScretariatCode === null)) || 
            (LoginDetails.role === "VR" && UserDetails.villageScretariatCode) ) && UserDetails.status=="PENDING"?
                <div style={{ margin: '1rem' }}>
                    {UserDetails && UserDetails.cert_url == "" && ((LoginDetails.role === "SRO" && 
                    (UserDetails.villageScretariatCode==""||UserDetails.villageScretariatCode==null)) || 
                    (LoginDetails.role === "VR" && UserDetails.villageScretariatCode) ) ? 
                        <div>
                            <div style={{ marginLeft: '3rem' }}>
                                {(!showForm || showInputs) ?
                                    <Row style={{ margin: '1rem' }}>
                                        <Col>
                                            <div style={{ position: 'relative' }}>
                                                <TableText label=" Dept. Transaction ID :" required={true} LeftSpace={false} />
                                                <div style={{ position: 'absolute', top: '0rem', left: '160px', width: '50%' }}>
                                                    <TableInputText type='text' placeholder='' required={true} name={'transactionId'} value={UserDetails.transactionId} onChange={(e) => {setUserDetails({...UserDetails, transactionId: e.target.value})}} />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col >
                                            <div className={styles.EditButton} style={{width:'35%' }} onClick={(e) => { GetVerificationTransactionStatus(UserDetails.transactionId) }} ><text className={styles.NavbarText}>Verify Transaction</text></div>
                                        </Col>
                                    </Row>
                                : null}

                                {showInputs && (
                                    <Row style={{ margin: '1rem' }} >
                                        <Col>
                                            <div style={{ position: 'relative' }}>
                                                <TableText label="Amount Paid :" required={false} LeftSpace={false} />
                                                <div style={{ position: 'absolute', top: '0rem', left: '120px' }}>
                                                    {/* <TableInputText type='number' placeholder="" required={true} name={'amount'} value={payData.amount ? payData.amount : ''} onChange={() => { }} /> */}
                                                    <TableText label={payData.amount ? payData.amount : ''} required={false} LeftSpace={false} textTransform={'uppercase'} />
                                                </div>
                                            </div>
                                        </Col>
                                        {/* <Col>
                                            <div style={{ position: 'relative' }}>
                                                <TableText label="Payment Mode :" required={false} LeftSpace={false} />
                                                <div style={{ position: 'absolute', top: '0rem', left: '120px' }}>
                                                    <TableInputText type='text' placeholder="" required={true} name={'paymentMode'} value={payData.paymentMode ? payData.paymentMode : ''} onChange={() => { }} />
                                                    <TableText label={payData.paymentMode ? payData.paymentMode : ''} required={false} LeftSpace={false} textTransform={'uppercase'} />
                                                </div>
                                            </div>
                                        </Col> */}
                                        <Col >
                                            <div className={styles.EditButton} style={{width:'35%' }} onClick={(e) => { GetDefaceStatus(UserDetails.transactionId) }} ><text className={styles.NavbarText}>Deface Transaction</text></div>
                                        </Col>
                                    </Row>
                                )}
                            </div>

                            <div>
                                {
                                    UserDetails.payStatus!=undefined && UserDetails.payStatus &&
                                    <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem' }}>
                                        <text>Department Transaction ID {UserDetails.transactionId} with paid amount {UserDetails.paidAmount}Rs. is verified and defaced by {LoginDetails.role === 'VR'?'VSWS':'SRO'}.</text>
                                    </div>
                                }
                                {showForm ?
                                    <div style={{ display: 'flex', justifyContent: 'center', margin: '3rem' }}>
                                        <div onClick={() => AskConfirmation("Please confirm uploaded documents have been viewed.", ["YES", "NO"], "generate Certifricate")} className={styles.EditButton2}><text className={styles.NavbarText}>Generate Form</text></div>
                                    </div> : null}
                            </div>
                        </div>
                        :
                        <div>
                            <div className="container">
                                <div className='mb-3 text-danger'>
                                    Note: Husbands and Wifes eSign is required only if both Husband and Wife Aadhaar numbers are available.
                                </div>
                                <div className="row">
                                    <div className="col s12 board">
                                        <Table striped bordered hover>
                                            <thead className={styles.TitleText}>
                                                <tr>
                                                    <th>Parties</th>
                                                    <th>Aadhar Number</th>
                                                    <th>Name as per Aadhar</th>
                                                    <th>eSign</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Husband</td>
                                                    <td><input type="number"  maxLength={12} value={UserDetails.husbandeSignAadhar} onChange={(e) => handleAadharChange(e, 'husbandeSignAadhar')} readOnly={UserDetails.husbandeSignStatus === true} /></td>
                                                    <td><input type="text" value={String(UserDetails.husbandName || '')} readOnly /></td>
                                                    <td>
                                                        {UserDetails.husbandeSignStatus === true  ? (
                                                            <div className={styles.EKYCDone}>
                                                                <Image alt="Success Icon" src={'/hmr/images/success-icon.png'} height={20} width={20} />
                                                                <span>eSign Done</span>
                                                            </div>
                                                        ) : !UserDetails.husbandAadhar || !UserDetails.wifeAadhar ? (
                                                            <span>eSign not required</span>
                                                        ) : (
                                                            <div className={styles.EditButton} onClick={() => Esign('husband')}>
                                                                <span className={styles.NavbarText}>eSign</span>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Wife</td>
                                                    {/* <td><input type="number" value={String(UserDetails.wifeAadhar || '')} readOnly /></td> */}
                                                    <td><input type="number"  maxLength={12} value={UserDetails.wifeeSignAadhar} onChange={(e) => handleAadharChange(e, 'wifeeSignAadhar')} readOnly={UserDetails.wifeeSignStatus === true} /></td>
                                                    <td><input type="text" value={String(UserDetails.wifeName_beforeMarriage || '')} readOnly /></td>
                                                    <td>
                                                        {UserDetails.wifeeSignStatus === true  ? (
                                                            <div className={styles.EKYCDone}>
                                                                <Image alt="Success Icon" src={'/hmr/images/success-icon.png'} height={20} width={20} />
                                                                <span>eSign Done</span>
                                                            </div>
                                                        ) : !UserDetails.husbandAadhar || !UserDetails.wifeAadhar ? (
                                                            <span>eSign not required</span>
                                                        ) : (
                                                            <div className={styles.EditButton}onClick={() => Esign('wife')}>
                                                            <span className={styles.NavbarText}>eSign</span>
                                                        </div>
                                                        )}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Witness 1</td>
                                                    <td><input type="number"  maxLength={12} value={UserDetails.witness1Aadhar} onChange={(e) => handleAadharChange(e, 'witness1Aadhar')} readOnly={UserDetails.witness1eSignStatus === true} /></td>
                                                    <td><input type="text" value={UserDetails.witness1Name} onChange={(e) => handleAadharChange(e, 'witness1Name')} readOnly={UserDetails.witness1eSignStatus === true} /></td>
                                                    <td> {UserDetails.witness1eSignStatus === true  ? (
                                                        <div className={styles.EKYCDone}>
                                                            <Image alt="Success Icon" src={'/hmr/images/success-icon.png'} height={20} width={20} />
                                                            <span>eSign Done</span>
                                                        </div>
                                                    ) : (
                                                        <div className={styles.EditButton} onClick={() => Esign('witness1')}>
                                                            <span className={styles.NavbarText}>eSign</span>
                                                        </div>
                                                    )}
                                                    </td>                                              

                                                </tr>
                                                <tr>
                                                    <td>Witness 2</td>
                                                    <td><input type="number"  maxLength={12} value={UserDetails.witness2Aadhar} onChange={(e) => handleAadharChange(e, 'witness2Aadhar')} readOnly={UserDetails.witness2eSignStatus === true} /></td>
                                                    <td><input type="text" value={UserDetails.witness2Name} onChange={(e) => handleAadharChange(e, 'witness2Name')} readOnly={UserDetails.witness2eSignStatus === true}/></td>
                                                    <td> {UserDetails.witness2eSignStatus === true ? (
                                                        <div className={styles.EKYCDone}>
                                                            <Image alt="Success Icon" src={'/hmr/images/success-icon.png'} height={20} width={20} />
                                                            <span>eSign Done</span>
                                                        </div>
                                                    ) : (
                                                        <div className={styles.EditButton}onClick={() => Esign('witness2')}>
                                                            <span className={styles.NavbarText}>eSign</span>
                                                        </div>
                                                    )}
                                                    </td>  
                                                </tr>
                                                <tr>
                                                    <td>Witness 3</td>
                                                    <td><input type="number"  maxLength={12} value={UserDetails.witness3Aadhar} onChange={(e) => handleAadharChange(e, 'witness3Aadhar')} readOnly={UserDetails.witness3eSignStatus === true} /></td>
                                                    <td><input type="text" value={UserDetails.witness3Name} onChange={(e) => handleAadharChange(e, 'witness3Name')} readOnly={UserDetails.witness3eSignStatus === true} /></td>
                                                    <td> {UserDetails.witness3eSignStatus === true ? (
                                                        <div className={styles.EKYCDone}>
                                                            <Image alt="Success Icon" src={'/hmr/images/success-icon.png'} height={20} width={20} />
                                                            <span>eSign Done</span>
                                                        </div>
                                                    ) : (
                                                        <div className={styles.EditButton}onClick={() => Esign('witness3')}>
                                                            <span className={styles.NavbarText}>eSign</span>
                                                        </div>
                                                    )}
                                                    </td> 
                                                </tr>
                                                <tr>
                                                    <td>SRO</td>
                                                    <td><input type="number"  maxLength={12} value={UserDetails.sroAadhar} onChange={(e) => handleAadharChange(e, 'sroAadhar')} readOnly={UserDetails.sroeSignStatus === true}/></td>
                                                    <td><input type="text" value={String(UserDetails.srName)}  onChange={(e) => handleAadharChange(e, 'srName')} readOnly={UserDetails.sroeSignStatus === true} /></td>
                                                    <td> {UserDetails.sroeSignStatus === true ? (
                                                        <div className={styles.EKYCDone}>
                                                            <Image alt="Success Icon" src={'/hmr/images/success-icon.png'} height={20} width={20} />
                                                            <span>eSign Done</span>
                                                        </div>
                                                    ) : (
                                                        <div className={styles.EditButton}onClick={() => Esign('sro')}>
                                                            <span className={styles.NavbarText}>eSign</span>
                                                            </div>
                                                    )}
                                                    </td> 
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center', margin: '3rem' }}>
                                <div
                                    onClick={() => {
                                        if (allSigned) {
                                           downloadFileByNameAndAppNo("doc_docForm", UserDetails.appNo,LoginDetails.loginType);
                                        } else {
                                            ShowAlert(false, "All eSigns are required before proceeding.", "");
                                        }
                                    }}
                                    className={`${styles.EditButton2} ${!allSigned ? styles.DisabledButton : ""}`}
                                    style={{ cursor: allSigned ? "pointer" : "not-allowed", opacity: allSigned ? 1 : 0.5 }}
                                >
                                    <text className={styles.NavbarText}>Get eSign Form</text>
                                </div>
                            </div>
                        </div>}
                        {UserDetails&&UserDetails.documentNumber !=""?
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Table style={{width:'50%'}}>
                                    <tr style={{borderStyle:'none', fontWeight:'bold'}}>
                                        <td style={{width:'45%'}}>Document Sequence Number :</td>
                                        <td>{UserDetails.documentNumber} of {new Date(UserDetails.updatedAt).getFullYear()}</td>
                                    </tr>
                                </Table>
                            </div>
                        :null}
                    {UserDetails&&UserDetails.cert_url !=""?
                        <div className={styles.uploadContainer}>
                            <UploadContainer onCancelUpload={onCancelUpload} accept='image/png, image/jpeg, image/jpg, application/pdf' isUploadDone={UserDetails.doc_final_regForm_upload} label='Upload Signed Registration Form' required={true} uploadKey='doc_final_regForm_upload' onChange={(e: any) => { OnFileSelect(e, 'doc_final_regForm', 'doc_final_regForm_upload') }} />
                        </div>
                    :null}
                    {UserDetails.doc_final_regForm_upload=="true" && allSigned ?
                        <div style={{ display: 'flex', justifyContent: 'center', margin: '3rem' }}>
                            <div className={styles.EditButton2} style={{ backgroundColor: '#005177' }} onClick={MakeProcessDone}><text className={styles.NavbarText}>Complete Registration Process</text></div>
                        </div>:null}
                </div>
                :
                <div style={{ margin: '1rem' }}>
                    {UserDetails.status == "COMPLETED" && LoginDetails.loginType == "officer" && LoginDetails.role && (LoginDetails.role === 'SRO' || LoginDetails.role === 'VR') ?
                        <div style={{ display: 'flex', justifyContent: 'center', margin: '3rem' }}>
                            <div onClick={() => downloadFileByNameAndAppNo("doc_final_regForm", UserDetails.appNo,LoginDetails.loginType)} className={styles.EditButton2}><text className={styles.NavbarText}>Get Marriage Certificate </text></div>
                        </div> : null}
                </div>
                // <div style={{ margin: '1rem' }}>
                //     {UserDetails.status == "COMPLETED" ?
                //         <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '3rem' }}>
                //             <div onClick={() => CallGetFormLinkUser(UserDetails.registrationId)} className={styles.EditButton2}><text className={styles.NavbarText}>Get Marriage Certificate </text></div>
                //         </div> : null}
                // </div>
            }
            <div>
                    <form id="URL" name="URL" method="POST" encType="multipart/formdata"
                        action={`${process.env.ESIGN_PAGE}`}>
                        <input type="Submit" value="Submit" id={"xmlInput"} style={{ visibility: 'hidden' }} />
                        <input type="hidden" name="msg" value={xmlValue} />
                    </form>
                    <form action={esignUrl ? esignUrl : `${process.env.OWN_ESIGN_URL}`} method="POST" >
                        <input type="hidden" id="esignRequest" name={FieldName} value={xmlValue} />
                        <input type="submit" value="Submit" style={{ visibility: 'hidden' }} id='igrs_input' />
                    </form>
                </div>
            {/* <pre>{JSON.stringify(eSignStatuses,null,2)}</pre> */}
            {/* <pre>{JSON.stringify(UserDetails,null,2)}</pre> */}
        </div>
    )
}

export default ViewUserDetails;