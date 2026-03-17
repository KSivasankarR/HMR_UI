import React, { useState, useEffect } from 'react'
import styles from '../styles/pages/ViewUserDetails.module.scss';
import { useRouter } from 'next/router';
import { Table } from 'react-bootstrap';
import { GetUserByAppNo, UploadDoc, GetFormLink, SaveUser, GetFormLinkUser, 
    downloadFileByNameAndAppNo, CallTokenInvalidate } from '../src/axios';
import UploadContainer from '../src/components/UploadContainer';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import { ConfirmAction, LoadingAction, PopupAction } from '../src/redux/commonSlice';
import { handleLogOut } from '../utils';

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
    husbandOtherCaste: "",
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
    wifeOtherCaste: "",
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
    villageScretariatName:"",
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


const ViewUserDetails = () => {
    let initialLoginDetails = useAppSelector((state) => state.login.loginDetails);
    const [LoginDetails, setLoginDetails] = useState(initialLoginDetails);
  const ConfirmMemory = useAppSelector((state) => state.common.ConfirmMemory);
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
    const ShowAlert = (type, message,redirect) => { dispatch(PopupAction({ enable: true, type: type, message: message, redirect })); }

    const Loading = (value: boolean) => {dispatch(LoadingAction({enable:value}));}

    const AskConfirmation =async (message,buttons,operation)=>{dispatch(ConfirmAction({ enable: true,message:message, buttons:buttons, operation:operation}));} 

  useEffect(() => {
    if(ConfirmMemory.enable==false && ConfirmMemory.result !=""){
      if(ConfirmMemory.result =="YES"){ 
          dispatch(ConfirmAction({ enable: false,message:"", buttons:[], operation:"",result:""})) 
          CallSaveUser();
      }
      
    }
  });

  const GetUserDetails = async (Prieview: any) => {
    let data2;
    Loading(true);
    console.log(Prieview);
    let regitsrtaionIDVal;
    if (Prieview == "fetchData") {
        regitsrtaionIDVal = localStorage.getItem("registrationId");
        data2 = await GetUserByAppNo(regitsrtaionIDVal, LoginDetails.loginType);
        if (data2 && data2.data) {
            setUserDetails({ ...data2.data, registrationId: regitsrtaionIDVal, documents: data2.data.documents });
        }
    } else {
      let data = JSON.parse(Prieview);
      regitsrtaionIDVal = data.registrationId
      data2 = await GetUserByAppNo(regitsrtaionIDVal, LoginDetails.loginType);
      setUserDetails({ ...data, registrationId: regitsrtaionIDVal, documents: data2.data.documents });
    }   
    Loading(false);
  };

    const CallGetFormLink = async (appNo: any) => {
        Loading(true);
        let data = await GetFormLink(appNo);
        Loading(false);
        if (data) {
            setTimeout(() => {
                window.open(data.Url);
            }, 500);
        }
    }

    const CallGetFormLinkUser = async (appNo: any) => {
        Loading(true);
        let data = await GetFormLinkUser(appNo);
        Loading(false);
        if (data) {
            setTimeout(() => {
                window.open(data.Url);
            }, 500);

        }
    }

    useEffect(() => {
      let data: any = localStorage.getItem("loginDetails");
      data = JSON.parse(data);

      if ( data && data.token && (data.loginType === "user" || data.loginType === "USER") )
      {
        console.log(localStorage.getItem("isFromDashboard"));
        if (localStorage.getItem("isFromDashboard") == "Yes") {
          GetUserDetails("fetchData");
        } else {
          GetUserDetails(localStorage.getItem("Prieview"));
        }
        
        setLoginDetails(data);
      } else {
        handleLogOut()
      }
    }, []);


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
            ShowAlert(true, "file uploaded successfully","");
            setUserDetails({ ...UserDetails, [uploadName]: "true" });
            setAllowToSubmit(true);
        }
        else { setUserDetails({ ...UserDetails, [uploadName]: "false" }); }
    }

    const MakeProcessDone = async (user: any) => {
        Loading(true);
        let success = await SaveUser({ registrationId: UserDetails._id, status: 'COMPLETED' }, LoginDetails.loginType);
        Loading(false);
        if (success === "User data saved successfully.") {
            return ShowAlert(true, "User process is done successfully.","/OfficeDashboard");
        } else {
            ShowAlert(false, success, "")
        }
    }

    const CallSaveUser = async () => {
        let user = { ...UserDetails, sentMail: true, mailMessage: "Marriage Registration Application Number is " + UserDetails.appNo + " . Please carry all the documents uploaded for verification purpose. Thank you." }
        Loading(true);
        let result: any = await SaveUser(user, LoginDetails.loginType);
        Loading(false);
        if (result === 'User data saved successfully.') {
          ShowAlert(true, result + " Please be available with three witnesses on selected slot date. Thank You.","/Receipt");
        }
        else {
          ShowAlert(false, result,"");
        }
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

    const GoBackToEdit = () =>{
        // let location = localStorage.getItem("redirectFrom");
        localStorage.setItem("Prieview",JSON.stringify(UserDetails));
        localStorage.setItem("redirectFrom","PreViewUserDetails");
        // router.push(location);
        router.push("/Registrations");
    }

    const onCancelUpload = (uploadKey)=>{
        setUserDetails({ ...UserDetails, [uploadKey]: "" });
    }
    let isFutureDate = false;
    let slotDateAndTime = new Date( UserDetails.slotDate);
    var dateObj = new Date(UserDetails.slotDate); 
    var curDate = new Date();
    curDate.setDate(curDate.getDate());
    console.log(dateObj);
    console.log(curDate);
    if(curDate.getFullYear()==dateObj.getFullYear() && 
        dateObj.getMonth()==curDate.getMonth() && curDate.getDate()==dateObj.getDate())
        isFutureDate = true;
    else if(curDate.getTime()<=dateObj.getTime())
        isFutureDate = true;

      //const isFutureDate = slotDateAndTime >= tomorrow;
    console.log(isFutureDate);
    const shouldShowSubmitButton = isFutureDate;

    return (
        <div style={{marginBottom:'3rem'}}>
            <div className={styles.Navbar}>
                {/* <text>{JSON.stringify(UserDetails.loginType)}</text> */}
                <text className={styles.NavbarText}> Welcome : {LoginDetails.loginName.toUpperCase()}</text>
                <text className={styles.NavbarText}> Last Login : {LoginDetails.lastLogin}</text>
                <div style={{ cursor: 'pointer' }} onClick={() => { handleLogOut() }} ><text className={styles.NavbarText}> Logout </text></div>
            </div>
            <div className={styles.Container}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <text className={styles.DashboardTitleText}>Confirm Registration Details</text>
                    {LoginDetails.loginType && LoginDetails.loginType.toUpperCase() != "USER" &&
                        <div style={{ display: 'flex' }}>
                            {/* <div className={styles.EditButton} onClick={() => { ShiftToLocation("/OfficerUserUpdate") }}><text className={styles.NavbarText}>Edit</text></div> */}
                            {/* <div className={styles.EditButton} onClick={GoBack}><text className={styles.NavbarText}>Back</text></div> */}
                        </div>
                    }
                </div>
                <div style={{width:'100%'}}>
                <div style={{ display: 'flex' }}>
                    <div className={styles.ListComponentContainer}>
                        <text className={styles.TitleText}>Slot Details</text>
                        {/* {DisplayTable("Application Number", UserDetails.appNo)} */}
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
                            <thead className={styles.TitleText} >
                                <tr>
                                    <th>Document Name</th>
                                    <th>View Document</th>
                                </tr>
                            </thead>
                            <tbody>
                                {UserDetails.documents&& UserDetails.documents.map((item: any, index: number) => {
                                    return [
                                        <tr key={index}>
                                            <td>{DisplayLablesForDocs(item.fileName)}</td>
                                            <td><a href="javascript:void(0)" onClick={() => {
                                                downloadFileByNameAndAppNo(item.fileName, UserDetails.appNo,"user");
                                            }} > View</a></td>
                                        </tr>
                                    ];
                                })}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>

            {LoginDetails.loginType && LoginDetails.loginType.toUpperCase() != "USER" ?
                <div style={{ margin: '1rem' }}>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '3rem' }}>
                        <div onClick={() => CallGetFormLink(UserDetails._id)} className={styles.EditButton2}><text className={styles.NavbarText}>Generate Form</text></div>
                    </div>
                    <div className={styles.uploadContainer}>
                        <UploadContainer onCancelUpload={onCancelUpload} accept='image/png, image/jpeg, image/jpg, application/pdf' isUploadDone={UserDetails.doc_final_regForm_upload} label='Upload Signed Registration Form' required={true} uploadKey='doc_final_regForm_upload' onChange={(e: any) => { OnFileSelect(e, 'doc_final_regForm', 'doc_final_regForm_upload') }} />
                    </div>
                    {AllowToSubmit &&
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '3rem' }}>
                            <div className={styles.EditButton2} style={{ backgroundColor: 'red' }} onClick={MakeProcessDone}><text className={styles.NavbarText}>Complete Registration Process</text></div>
                        </div>}
                </div>
                :
                <div style={{ margin: '1rem' }}>
                    {UserDetails.status == "COMPLETED" ?
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '3rem' }}>
                            <div onClick={() => CallGetFormLinkUser(UserDetails.appNo)} className={styles.EditButton2}><text className={styles.NavbarText}>Get Marriage Certificate </text></div>
                        </div> : null}
                </div>
            }
           {!shouldShowSubmitButton && <div style={{ color: 'red',marginBottom:'1rem',textAlign:"center" }} >*Note : Slot date is lessthan future date. So please click on edit to change the slot date.</div>}
            <div className={styles.paymentContainer}>
            <button className={styles.paymentButtton} onClick={GoBackToEdit}>EDIT</button>
            {shouldShowSubmitButton && <button className={styles.paymentButtton} onClick={async()=>{AskConfirmation("Are you sure you want to submit the application ? Please verify all your details. Application once submitted cannot be edited.",["YES","NO"],"submit");}}>SUBMIT</button>}
        </div>
            {/* <pre>{JSON.stringify(localStorage.getItem("Prieview") ,null,2)}</pre> */}
            {/* <pre>{JSON.stringify(UserDetails,null,2)}</pre> */}
        </div>
    )
}

export default ViewUserDetails;