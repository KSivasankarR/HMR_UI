import React, { useState, useEffect } from 'react';
import TableDropdown from '../src/components/TableDropdown';
import TableInputLongText from '../src/components/TableInputLongText';
import TableInputRadio from '../src/components/TableInputRadio';
import TableInputText from '../src/components/TableInputText';
import TableSelectDate from '../src/components/TableSelectDate';
import TableText from '../src/components/TableText';
import UploadContainer from '../src/components/UploadContainer';
import styles from '../styles/pages/Registrations.module.scss';
import { useRouter } from 'next/router';
import { Row, Col } from 'react-bootstrap';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import { ConfirmAction, LoadingAction, PopupAction } from '../src/redux/commonSlice';
import { SaveUser, UploadDoc, removeUploadDoc, GetCaste, GetDistrict, GetMandal, GetOffice, getAadharDetails, getAadharOTP,
  CallCreateNewReg, CallTokenInvalidate } from '../src/axios';
import moment from 'moment';
import SelectUploadContainer from '../src/components/SelectUploadContainer';
import { handleLogOut } from '../utils';
moment.defaultFormat = "DD-MM-YYYY";
import Image from 'next/image';

const FeaturesList = {
  country: [{ value: "INDIA", label: "INDIA" }, { value: "OTHER", label: "OTHER" }],
  state: [{ value: "ANDHRA PRADESH", label: "ANDHRA PRADESH" }, { value: "OTHER", label: 'OTHER' }],
  Boolean: [{ value: "YES", label: "YES" }, { value: "NO", label: "NO" }],
  marriageLocationOptions: [{ label: "ENTER LOCATION" }, { label: "SAME AS HUSBAND LOCATION" }, { label: "SAME AS WIFE LOCATION" }],
  registrationLocationOptions: [{ label: "MARRIAGE PLACE" }, { label: "HUSBAND PLACE" }, { label: "WIFE PLACE" }],
  castOptions: [{ label: "SAME CASTE" }, { label: "DIFFERENT CASTE" }],
  timeslotOptions: [{ label: "10: 30AM" }, { label: "10: 45AM" }, { label: "11: 00AM" }, { label: "11: 15AM" },
  { label: "11: 30AM" }, { label: "11: 45AM" }, { label: "12: 00PM" }, { label: "12: 15PM" },
  { label: "12: 30PM" }, { label: "12: 45PM" }, { label: "01: 00PM" }, { label: "01: 15PM" },
  { label: "02: 00PM" }, { label: "02: 15PM" }, { label: "02: 30PM" }, { label: "02: 45PM" },
  { label: "03: 00PM" },
  ],
  officeOptions: [{ label: "Open" }, { label: "Anantapur" }, { label: "Vijayawada" }],
  relationship: [{ value: "PARENTS", label: "PARENTS" }, { value: "GUARDIAN", label: "GUARDIAN" }],
  paymentOptions: [{ value: "PAY AT SRO", label: "PAY AT SRO" }, { value: "PAY ONLINE", label: "PAY ONLINE" }],
  coppies: [{ value: 1, label: 1 }, { value: 2, label: 2 }, { value: 3, label: 3 }, { value: 4, label: 4 }, { value: 5, label: 5 }],

  ReligionList: [
    { value: "HINDU", label: "HINDU" },
    { value: "SIKH", label: 'SIKH' },
    { value: "BOUDHA", label: "BOUDHA" },
    { value: "JAIN", label: "JAIN" },
    { value: "OTHERS", label: "OTHERS" },
  ]
}

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
  husbandReligion: "HINDU",
  husbandCaste: "",
  husbandOtherCaste: "",
  husbandDateofBirth: "",
  husbandMobile: "",
  husbandMarriageAge: "",
  husbandRankorProfession: "",
  husbandCountry: "INDIA",
  radio_husbandCountry: "INDIA",
  husbandState: "ANDHRA PRADESH",
  radio_husbandState: "ANDHRA PRADESH",
  husbandAddress: "",
  husbandRelationship: "PARENTS",
  husbandFatherName: "",
  husbandMotherName: "",
  isHusbandDivorcee: "",
  radio_isHusbandDivorcee: "NO",
  doc_isHusbandDivorcee_upload: "",
  isHusbandWidower: "NO",
  doc_isHusbandWidower_upload: "",
  wifeName_beforeMarriage: "",
  wifeName_afterMarriage: "",
  change_wifeName_to_afterMarriage: "YES",
  wifeReligion: "HINDU",
  wifeCaste: "",
  wifeOtherCaste: "",
  wifeDateofBirth: "",
  wifeMobile: "",
  wifeMarriageAge: "",
  wifeRankorProfession: "",
  wifeCountry: "INDIA",
  radio_wifeCountry: "INDIA",
  wifeState: "ANDHRA PRADESH",
  radio_wifeState: "ANDHRA PRADESH",
  wifeAddress: "",
  wifeRelationship: "PARENTS",
  wifeFatherName: "",
  wifeMotherName: "",
  isWifeDivorcee: "",
  radio_isWifeDivorcee: "NO",
  doc_isWifeDivorcee_upload: "", //
  isWifeWidow: "NO",
  doc_isWifeWidow_upload: "",  //
  marriageDate: "",
  marriageAddress: "",
  registrationAddress: "",
  regDate: "",
  status: "PENDING",
  sroOffice: "",
  slotDate: moment(moment().toDate()).format("YYYY-MM-DD"),
  slotTime: moment().format("LT"),
  certificateCopies: 2,
  casteType: "SAME CASTE",
  doc_weddingCard_upload: "",
  doc_husbandBirthProof_upload: "",
  doc_wifeBirthProof_upload: "",
  doc_marriagePhoto_upload: "",
  doc_husbandPhoto_upload:"",
  doc_wifePhoto_upload:"",
  doc_husbandResidenceProof_upload: "",
  doc_wifeResidenceProof_upload: "",
  doc_receipt_upload: "",
  paymentType: "PAY AT SRO",
  doc_marriageRecept: "",
  doc_marriageRecept_upload: "",
  isMarriageLocationDifferent: false,
  marriageAddress_action: "",
  villageScretariatCode: "",
  villageScretariatName: "",
  district: ""
}

const SRORegistrations = () => {
  let initialLoginDetails = useAppSelector((state) => state.login.loginDetails);
  const [LoginDetails, setLoginDetails] = useState(initialLoginDetails);
  const ConfirmMemory = useAppSelector((state) => state.common.ConfirmMemory);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [UserDetails, setUserDetails] = useState<any>(initialUserDetails);
  const [FormErrors, setFormErrors] = useState<any>({});
  const [DistrictList, setDistrictList] = useState<any>([]);
  const [MandalList, setMandalList] = useState<any>([]);
  const [CasteList, setCasteList] = useState([]);
  const [CasteListForHusband, setCasteListForHusband] = useState([]);
  const [CasteListForWife, setCasteListForWife] = useState([]);
  const [SelectedDistrict, setSelectedDistrict] = useState<any>("");
  const [SelectedMandal, setSelectedMandal] = useState<any>("");
  const [OfficeList, setOfficeList] = useState<any>([]);
  const [Flag, setFlag] = useState(false);
  const [showHOTP, setShowHOTP] = useState(false);
  const [showWOTP, setShowWOTP] = useState(false);
  const [hideHOTP, sethideHOTP] = useState(false);
  const [hideWOTP, sethideWOTP] = useState(false);
  const [husbandAadhaarDisabled, setHusbandAadharDisabled] = useState(false);
  const [wifeAadhaarDisabled, setWifeAadharDisabled] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [Active, setActive] = useState(false);
  const [OtptransactionNumber, getOtpTransactionNumber] = useState("");
  const [validationError1, setValidationError1] = useState('');
  const [validationError2, setValidationError2] = useState('');
  const [validationError3, setValidationError3] = useState('');
  const [validationError4, setValidationError4] = useState('');
  const [validationError5, setValidationError5] = useState('');


  function handleKeyDown(event) {
    if (event.code === 'Space') {
      event.preventDefault();
    }
  }
  
  const ShowAlert = (type, message, redirect) => { dispatch(PopupAction({ enable: true, type: type, message: message, redirect: redirect })); }
  const Loading = (value: boolean) => {dispatch(LoadingAction({enable:value}));}
  const AskConfirmation =async (message,buttons,operation)=>{dispatch(ConfirmAction({ enable: true,message:message, buttons:buttons, operation:operation}));} 

  useEffect(() => {
    if(ConfirmMemory.enable==false && ConfirmMemory.result !=""){
      if(ConfirmMemory.result =="YES"){
        let user:any = {...ConfirmMemory.operation}; 
          dispatch(ConfirmAction({ enable: false,message:"", buttons:[], operation:"",result:""})) 
          for (let i in user) {
            if (typeof user[i] === 'string') {
              user[i] = user[i].toUpperCase();
            }
          }
          CallSaveUser(user);
      }
      
    }
  });

  useEffect(() => {
    let data: any = localStorage.getItem("loginDetails");
    data = JSON.parse(data);
    if (data && data.token && (data.loginType == "OFFICER" || data.loginType == "officer") && data.role && (data.role === 'SRO' || data.role === 'VR'))
     {
      setLoginDetails(data);
      if (data.loginId) {
        CreateNewReg(data);
      }

      // setUserDetails({ ...UserDetails, createdBy: LoginDetails.loginId }); // needs to verify 
    }
    else {
      handleLogOut()
    }
  }, []);

  const CreateNewReg = async (data: any) => {
    Loading(true);
    let result = await CallCreateNewReg(data.loginId, data.loginType);
    Loading(false);
    if (result.status) {
      setUserDetails({ ...UserDetails, registrationId: result.data.registrationId, appNo:result.data.appNo, district: data.sroDistrict, sroOffice: data.sroOffice });
    }
  }

  useEffect(() => { GetAllDistricts() }, []);
  const GetAllDistricts = async () => {
    Loading(true);
    let result = await GetDistrict();
    Loading(false);
    if (result && result.status) {
      setDistrictList(result.data)
    }
  }

  useEffect(() => { GetAllCastes() }, []);
  const GetAllCastes = async () => {
    Loading(true);
    let result = await GetCaste();
    Loading(false);
    if (result && result.status) {
      setCasteListForHusband(result.data);
      setCasteListForWife(result.data);
      setCasteList(result.data);
    }
  }

  const DateCalculator = (condition) => {
    switch (condition) {
      case 'today':
        let date = new Date();
        let day = date.getDate().toString();
        let month = (date.getMonth() + 1).toString();
        if (month.length == 1) { month = '0' + month; }
        if (day.length == 1) { day = '0' + day; }
        let year = date.getFullYear();
        return `${year}-${month}-${day}`;
      default:
        break;
    }

  }

  const LimitYearTo = (age: number) => {
    let date = new Date();
    date.setFullYear(date.getFullYear()-age);
    date.setDate(date.getDate()-1);
    let day = date.getDate().toString();
    let month = (date.getMonth() + 1).toString();
    if (month.length == 1) { month = '0' + month; }
    if (day.length == 1) { day = '0' + day; }
    let year = date.getFullYear();
    //let limitYear = year - age;
    return `${year}-${month}-${day}`;
  }

  const TableTitle = (label: String) => {
    return (
      <div className={styles.singleTitleColumn}>
        <text className={styles.columnTitleText}>{label}</text>
      </div>
    );
  }
  const ShiftToLocation = (location: string, query: {}) => {
    router.push({
      pathname: location,
      // query: query,
    })
  }

  const CalculateAge = (birthDate: any, marriageDate: any) => {
    const date1: any = new Date(birthDate);
    const date2: any = new Date(marriageDate);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  const CalculateDivorceAge = (divorceDate: any, marriageDate: any) => {
    const date1: any = new Date(divorceDate);
    const date2: any = new Date(marriageDate);
    const diffTime = date2 - date1;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  const DoubleDigitMaker = (value: string) => {
    if (Object.keys(value).length < 2) { return '0' + value; }
    return value;
  }

  const OnSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (Object.keys(validate(UserDetails)).length === 0) {

        let month = new Date().getMonth();
        let day = new Date().getDate();
        let year = new Date().getFullYear();
        let currentDate = year + "-" + DoubleDigitMaker((month + 1).toString()) + "-" + DoubleDigitMaker(day.toString());
        let user = { ...UserDetails, regDate: currentDate };
        let husbandMarriageAge = CalculateAge(UserDetails.husbandDateofBirth, UserDetails.marriageDate);
        let wifeMarriageAge = CalculateAge(UserDetails.wifeDateofBirth, UserDetails.marriageDate);
        if (husbandMarriageAge < 7671) { return ShowAlert(false, "Husband age must be 21 years old.", ""); }
        else if (wifeMarriageAge < 6575) { return ShowAlert(false, "Wife age must be 18 years old.", ""); }
        else {
          let husbandAgeInYears = Math.floor(husbandMarriageAge / 365)
          let wifeAgeInYears = Math.floor(wifeMarriageAge / 365)
          user = { ...user, husbandMarriageAge: husbandAgeInYears, wifeMarriageAge: wifeAgeInYears };
          let differenceInHusbandDivorceAge = CalculateDivorceAge(UserDetails.isHusbandDivorcee, UserDetails.marriageDate);
          if (differenceInHusbandDivorceAge < 7) {
            return ShowAlert(false, "Decree of divorce date should be at least 7 days prior to the date of marriage.", "");
          }
          let differenceInWifeDivorceAge = CalculateDivorceAge(UserDetails.isWifeDivorcee, UserDetails.marriageDate);
          if (differenceInWifeDivorceAge < 7) {
            return ShowAlert(false, "Decree of divorce date should be at least 7 days prior to the date of marriage.", "");
          }
          if (UserDetails.radio_husbandCountry != "INDIA" && UserDetails.radio_wifeCountry != "INDIA"){
            if (UserDetails.husbandPassport === UserDetails.wifePassport){
              setValidationError3('Passport numbers cannot be same');
              return ShowAlert(false, "Passport numbers cannot be same", "");
            }
          }
          AskConfirmation("Are you sure that you want to submit the application? Application once submitted cannot be edited.",["YES","NO"],user);
        }
      }
      else {
        ShowAlert(false, "Please recheck incorrect fields.", "");
      }
    } catch (error) {
      ShowAlert(false, error, "");
    }

  };

  const CallSaveUser = async (user: any) => {
    Loading(true);
    let success = await SaveUser(user, LoginDetails.loginType);
    Loading(false);
    if (success === 'User data saved successfully.') {
      return ShowAlert(true, success, "/OfficeDashboard");
    } else {
      ShowAlert(false, success, '');
    }
  }

  const handlePaymentLinkClick = ()=>{
    let paymentRedirectUrl = process.env.PAYMENT_GATEWAY_URL+"igrsPayment?paymentData=";
    let paymentLink = document.createElement("a");

    let PaymentJSON = {
      "type":"hmr",
      "deptId":UserDetails.appNo,
      "rmName":LoginDetails.loginName,
      "sroNumber":LoginDetails.sroNumber, 
      "rf":200
    }

    let encodedData = Buffer.from(JSON.stringify(PaymentJSON), 'utf8').toString('base64')  
    paymentLink.href = paymentRedirectUrl+encodedData;
    paymentLink.target = "_blank";
    paymentLink.click();
    setTimeout(function(){paymentLink.remove();}, 1000);
  };

  const validate = (values: any) => {
    type errorsType = {
      husbandPassport?:string;
      wifePassport?:string;
      husbandAadhar?: string;
      wifeAadhar?: string;
      husbandAadharOtp?: string;
      wifeAadharOtp?: string;
      wifeMobile?: string;
      husbandMobile?: string;
      wifeName_afterMarriage?: string;
      wifeOtherCaste?: string;
      husbandDOE?: string;
      wifeDOE?: string;
      slotDate?: string
    };
    const errorList: errorsType = {}
    if (UserDetails.radio_husbandCountry != "INDIA") {
       if (values.husbandPassport.length < 6)
         errorList.husbandPassport = "Enter valid husband Passport Number.";
       else if (values.husbandDOE <= values.slotDate) {
          errorList.husbandDOE = "Husband passport expiry date should not be less than and not equal to the slot date.";
        }
     } else {
        if (values.husbandAadhar.length != 12)
          errorList.husbandAadhar = "Enter correct husband Aadhaar Number."; // if (values.husbandAadharOtp.length != 6) errorList.husbandAadharOtp = "Enter correct husband Aadhar OTP.";
        
        if(!husbandAadhaarDisabled)
          errorList.husbandAadhar = "Please verify husband Aadhaar.";
     }

     if (UserDetails.radio_wifeCountry != "INDIA") {
       if (values.wifePassport.length < 6)
         errorList.wifePassport = "Enter valid wife Passport Number.";
       else if (values.wifeDOE <= values.slotDate) {
          errorList.wifeDOE = "Wife passport expiry date should not be less than and not equal to the slot date.";
        }
     } else {
        if (values.wifeAadhar.length != 12)
          errorList.wifeAadhar = "Enter correct wife Aadhaar Number."; // if (values.wifeAadharOtp.length != 6) errorList.wifeAadharOtp = "Enter correct wife Aadhar OTP.";

        if(!wifeAadhaarDisabled)
          errorList.wifeAadhar = "Please verify wife Aadhaar."; 
     }
    //  if (values.husbandMobile != "") {
    //   var regex = /^[6789]\d{9}$/;
    //   if (!regex.test(values.husbandMobile)) errorList.husbandMobile = "Enter husband Valid Mobile Number.";
    // } 
    // if (values.wifeMobile != "") {
    //   var regex = /^[6789]\d{9}$/;
    //   if (!regex.test(values.wifeMobile)) errorList.wifeMobile = "Enter wife Valid Mobile Number.";
    // }
    if (values.husbandMobile.length != 10) errorList.husbandMobile = "Enter 10 digit valid mobile number.";
    if (values.wifeMobile.length != 10) errorList.wifeMobile = "Enter 10 digit valid mobile number.";
    if (values.change_wifeName_to_afterMarriage == "YES" && values.wifeName_afterMarriage == "") errorList.wifeName_afterMarriage = "Please enter wife's name after marriage.";
    if(values.casteType === 'DIFFERENT CASTE' && values.wifeOtherCaste && values.wifeOtherCaste.toLowerCase() === values.husbandOtherCaste.toLowerCase()) errorList.wifeOtherCaste = "Enter a different caste name"
    setFormErrors(errorList);
    return errorList;
  }

  const CountryHandleOther = (addName, addValue, user, radioKey, ActualKey, SecondKey) => {
    if (addName == radioKey) {
      if (addValue == "INDIA") {
        return { ...user, [ActualKey]: "INDIA", [SecondKey]: "" }
      }
      else {
        if(ActualKey === 'husbandCountry'){
          setHusbandAadharDisabled(false);
          sethideHOTP(false);
          setShowHOTP(false);
          setIsActive(false);
          return { ...user, [ActualKey]: "", [SecondKey]: ""}
        } else {
          setWifeAadharDisabled(false);
          sethideWOTP(false);
          setShowWOTP(false);
          setActive(false);
          return {...user, [ActualKey]: "", [SecondKey]: ""}
        }
      }
    }
    return user;
  }

  const StateHandleOther = (addName, addValue, user, radioKey, ActualKey) => {
    if (addName == radioKey) {
      if (addValue == "ANDHRA PRADESH") {
        return { ...user, [ActualKey]: "ANDHRA PRADESH" }
      }
      else {
        if(ActualKey === 'husbandState'){
         
          return { ...user, [ActualKey]: ""}
        } else {
          
          return {...user, [ActualKey]: ""}
        }
      }

    }
    return user;
  }

  const signs = ['>', '<', `'`, `"`, '%'];

  const onChange = (e: any) => {
    let user = UserDetails;
    let addName = e.target.name;
    let addValue = e.target.value == (e.target.value == "SELECT") ? "" : e.target.value;
    user = CountryHandleOther(addName, addValue, user, "radio_husbandCountry", "husbandCountry", "husbandState");
    user = CountryHandleOther(addName, addValue, user, "radio_wifeCountry", "wifeCountry", "wifeState");
    user = StateHandleOther(addName, addValue, user, "radio_husbandState", "husbandState");
    user = StateHandleOther(addName, addValue, user, "radio_wifeState", "wifeState");

    
    signs.forEach(ob => {
      addValue = addValue.replace(ob, "");
    });
  
    if (addName == "husbandAddress" && addValue.length > 150) {
      addValue = UserDetails.husbandAddress;

    } else if (addName == "wifeAddress" && addValue.length > 150) {
      addValue = UserDetails.wifeAddress;
    } else if (addName == "marriageAddress" && addValue.length > 150) {
      addValue = UserDetails.marriageAddress;
    }

    if (addName == "husbandCaste") {
      if (UserDetails.casteType == "DIFFERENT CASTE") {
        let array = CasteList;
        array = array.filter(e => e === 'OTHERS' ? true : e !== addValue );
        setCasteListForWife(array);
      }
      if(addValue !== 'OTHERS'){
        user['husbandOtherCaste'] = ''
      }
    } else if (addName == "wifeCaste") {
      if (UserDetails.casteType == "DIFFERENT CASTE") {
        let array = CasteList;
        array = array.filter(e => e === 'OTHERS' ? true : e !== addValue);
        setCasteListForHusband(array);
      }
      if(addValue !== 'OTHERS'){
        user['wifeOtherCaste'] = ''
      }
    } else if (addName == "casteType") {
      if (addValue == "SAME CASTE") {
        setCasteListForHusband(CasteList);
      }
    }
    else if (addName == "husbandMobile" || addName == "wifeMobile") {
      addValue = addValue.slice(0, 10);
    } else if (addName == "husbandAadhar" || addName == "wifeAadhar") {
      addValue = addValue.slice(0, 12);
    } else if (addName == "husbandAadharOtp" || addName == "wifeAadharOtp") {
      addValue = addValue.slice(0, 6);
    } else if (addName == "husbandPassport" || addName == "wifePassport") {
      addValue = addValue.slice(0, 9);
    }

    if (addName === "radio_isHusbandDivorcee") {
      if (addValue === 'YES') { user.isHusbandWidower = "NO"; user.isHusbandDivorcee = "";}
      else if (addValue === "NO" && user.ishusbandDivorcee) { user.ishusbandDivorcee = "" }
    }
    else if (addName === "isHusbandWidower") {
      if (addValue === 'YES') { user.radio_isHusbandDivorcee = "NO"; user.isHusbandDivorcee = ""; }
    }
    else if (addName === "radio_isWifeDivorcee") {
      if (addValue === "NO" && user.radio_wifeDivorceDate) { user.iswifeDivorcee = ""; }
      else if (addValue === "YES") { user.isWifeWidow = "NO";user.isWifeDivorcee = ""; }
    }
    else if (addName === "isWifeWidow") {
      if (addValue === 'YES') { user.radio_isWifeDivorcee = "NO"; user.iswifeDivorce = ""; }

    }


    if (addName == "husbandName" || addName == "wifeName_beforeMarriage" ||
      addName == "wifeName_afterMarriage" ||  addName == "wifeOtherCaste" ||
      addName == "husbandFatherName" || addName == "wifeFatherName" || addName == "husbandOtherCaste" || addName == "husbandMotherName" || addName == "wifeMotherName" || addName == "husbandCountry" || addName == "wifeCountry" || addName == "husbandState" || addName == "wifeState"
    ) {
      addValue = addValue.replace(/[^\w\s]/gi, "");
      addValue = addValue.replace(/[0-9]/gi, "");
      addValue = addValue.replace(/_/g, "");
    }
    if (e.target.name == 'change_wifeName_to_afterMarriage') {
        user = { ...user, wifeName_afterMarriage: "" }
    }

    if (e.target.name == "marriageAddress_action") {
      if (e.target.value == "SAME AS HUSBAND LOCATION") {
        addName = "marriageAddress";
        addValue = UserDetails.husbandAddress;
        user = { ...user, isMarriageLocationDifferent: false }
      }
      else if (e.target.value == "SAME AS WIFE LOCATION") {
        addName = "marriageAddress";
        addValue = UserDetails.wifeAddress;
        user = { ...user, isMarriageLocationDifferent: false }
      }
      else if (e.target.value === "ENTER LOCATION") {
        addName = "marriageAddress";
        addValue = "";
        user = { ...user, isMarriageLocationDifferent: true }
      }
      else{
        addName = "";
        addValue = "";
        user = { ...user, isMarriageLocationDifferent: false }
      }
      user = { ...user, marriageAddress_action: e.target.value }
    }

    if (e.target.name == "registrationAddress") {
      user = { ...user, "registrationAddress": e.target.value }
    }

    if (e.target.name == "husbandCaste" && UserDetails.casteType == "SAME CASTE") {
      user.wifeCaste = e.target.value.toUpperCase();
    }

    if (e.target.name == 'casteType') {
      user.husbandCaste = '';
        user.wifeCaste = '';
        user.husbandOtherCaste = '';
        user.wifeOtherCaste = '';
    }
    if(e.target.name == 'husbandOtherCaste' && UserDetails.casteType == 'SAME CASTE'){
      user.wifeOtherCaste = addValue;
    }

    if(addName === 'radio_husbandCountry'){
      user.husbandPassport =  "";
      user.husbandDOI = "";
      user.husbandDOE = "";
      user.husbandAadhar =  "";
      user.husbandAadharOtp = "";
      user.husbandName = "";
      user.husbandDateofBirth = "";
      user.husbandAddress = "";
      user.husbandFatherName = "";
      user.husbandState = "";
      user.radio_husbandState = "ANDHRA PRADESH";
    }
    if(addName === 'radio_wifeCountry'){
      user.wifePassport =  "";
      user.wifeDOI = "";
      user.wifeDOE = "";
      user.wifeAadhar =  "";
      user.wifeAadharOtp = "";
      user.wifeName_beforeMarriage = "";
      user.wifeDateofBirth = "";
      user.wifeAddress = "";
      user.husbandFatherName = "";
      user.wifeState = "";
      user.radio_wifeState = "ANDHRA PRADESH";
    }

    // addValue = addValue.toUpperCase();
    user = { ...user, [addName]: addValue }
    setUserDetails(user);
  }

  const OnFileSelect = async (event: any, docName: string, uploadName: string) => {
    if(event.target.files.length){
    if (event.target.files[0].size > 1024000) {
      ShowAlert(false, "File size should not exceed 1MB.", "");
      event.target.value = "";
    }
    else {
      const file = event.target.files[0];
      var pattern = /image-*/;

      if (!file.type.match(pattern)) {
        ShowAlert(false, "Irrelevant file type. Only image can be uploaded.", "");
        event.target.value = "";
      }
      else{
      setUserDetails({ ...UserDetails, [uploadName]: "process" });
      const formData = new FormData();
      formData.append('image', event.target.files[0]);
      let data: any = {
        docName: docName,
        registrationId: UserDetails.registrationId
      }
      await ForUploadDoc(data, formData, uploadName);
    }
  }
}
  }

  const onCancelUpload = async (uploadKey) => {
    Loading(true);
    let fileName = uploadKey.replace("_upload","");
    let result = await removeUploadDoc(fileName, UserDetails.appNo, LoginDetails.loginType);
    console.log(result);
    Loading(false);
    if (result.success) {
      UserDetails[uploadKey] = "";
      ShowAlert(result.success, result.message, "");
      setUserDetails({ ...UserDetails, [uploadKey]: "" });
    }else
    {
      if("Data not found."==result.message){
        UserDetails[uploadKey] = "";
        setUserDetails({ ...UserDetails, [uploadKey]: "" });
      }
      ShowAlert(false, result.message, "");
    }
  }

  const ForUploadDoc = async (data: any, formData: any, uploadName: string) => {
    Loading(true);
    let result = await UploadDoc(data, formData, LoginDetails.loginType);
    Loading(false);
    if (result && result.status) {
      setUserDetails({ ...UserDetails, [uploadName]: "true" });
    }
    else {
      setUserDetails({ ...UserDetails, [uploadName]: "false" });
    }
  }

  const ForSROSelect = async (event: any, location: string) => {
    if (location == "district") {
      setMandalList([]);
      setOfficeList([]);
      setUserDetails({ ...UserDetails, district: event.target.value })
      await CallMandal(event.target.value)
    }
    if (location == "mandal") {
      setOfficeList([]);
      setUserDetails({ ...UserDetails, mandal: event.target.value })
      await CallOffice(event.target.value);
    }
  }

  const CallMandal = async (value) => {
    setSelectedDistrict(value);
    setOfficeList([]);
    Loading(true);
    let result = await GetMandal(value);
    Loading(false);
    if (result.status) { setMandalList(result.data); }
  }

  const CallOffice = async (value) => {
    setSelectedMandal(value);
    Loading(true);
    let result = await GetOffice(SelectedDistrict + '&mandal=' + value);
    Loading(false);
    if (result.status) { setOfficeList(result.data); }
  }

  const sendAadharRequestforHusbandAadhar = async (e: any) => {
    e.preventDefault();
    if (UserDetails.husbandAadhar === '') {
      ShowAlert(false, "Please enter Aadhaar number", "");
      setValidationError4('Please enter Aadhaar number');
    }
    else if (UserDetails.husbandAadhar === UserDetails.wifeAadhar) {
      ShowAlert(false, "Aadhaar numbers cannot be same", "");
      setValidationError1('Aadhaar numbers cannot be same');
    } else {
      console.log('*** sending AadharRequest', UserDetails.husbandAadhar);
      Loading(true);
      const result = await getAadharOTP(UserDetails.husbandAadhar);
      getOtpTransactionNumber(result.transactionNumber)
      Loading(false);
      if (result && result.status) {
        ShowAlert(true, result.message || result.data, "");
        setShowHOTP(true)
        setIsActive(true);
      } else {
        ShowAlert(false, result.message, "");
      }
    }
  }

  const sendAadharRequestforWifeAadhar = async (e: any) => {
    e.preventDefault();
    if (UserDetails.wifeAadhar === '') {
      ShowAlert(false, "Please enter Aadhaar number", "");
      setValidationError5('Please enter Aadhaar number');
    }
    else if (UserDetails.wifeAadhar === UserDetails.husbandAadhar) {
      ShowAlert(false, "Aadhaar numbers cannot be same", "");
      setValidationError2('Aadhaar numbers cannot be same');
    } else {
      console.log('*** sending AadharRequest', UserDetails.wifeAadhar);
      Loading(true);
      const result = await getAadharOTP(UserDetails.wifeAadhar);
      getOtpTransactionNumber(result.transactionNumber)
      Loading(false);
      if (result && result.status) {
        ShowAlert(true, result.message || result.data, "");
        setShowWOTP(true)
        setActive(true)
      } else {
        ShowAlert(false, result.message, "");
      }
    }
  }

  const getHusbandAadharDetailsResponse = async (e: any) => {
    e.preventDefault();
    console.log('Husband Aadhaar OTP', UserDetails.husbandAadharOtp);
    Loading(true);
    let result = await getAadharDetails({
      aadharNumber: Buffer.from(UserDetails.husbandAadhar).toString('base64'),
      transactionNumber: OtptransactionNumber,
      otp: (UserDetails.husbandAadharOtp)
    })
    Loading(false);
    if (result.status) {
      let userDet = { ...UserDetails };
      userDet.husbandAddress = ['house', 'lm','loc', 'street','vtc','dist','state','pc'].reduce((str, item) => { return str + (result.userInfo[item] ? (result.userInfo[item] + ', ') : '') }, '');
      [['name', 'husbandName'], ['state', 'husbandState'], ['dob', 'husbandDateofBirth'], ['country', 'husbandCountry'],['co','husbandFatherName'], ['dist', 'husbandDistrict']].map((item) => {
        if (result.userInfo[item[0]]) {
          if (item[0] === 'dob') {
            let arr = result.userInfo[item[0]].split('-');
            let x = arr[2];
            arr[2] = arr[0];
            arr[0] = x;
            arr = arr.join('-');
            userDet[item[1]] = arr;
          } else {
            userDet[item[1]] = result.userInfo[item[0]].toUpperCase();
          }
        }
      });
      
      if(userDet.husbandState!="ANDHRA PRADESH")
       {
          userDet.radio_husbandState ="OTHER";
          userDet.husbandState = ['state'].reduce((str, item) => { return str + (result.userInfo[item] ? (result.userInfo[item]) : '') }, '');
          userDet.husbandAddress = ['house', 'lm','loc', 'street','vtc','dist','pc'].reduce((str, item) => { return str + (result.userInfo[item] ? (result.userInfo[item] + ', ') : '') }, '');
       }
       else{
        if(userDet.husbandState==="ANDHRA PRADESH")
        userDet.radio_husbandState ="ANDHRA PRADESH";
       }
          
      setUserDetails({ ...userDet });
      sethideHOTP(true)
      setHusbandAadharDisabled(true);
    } else {
      ShowAlert(false, result.message, "");
    }
    console.log(result);
  }

  const getWifeAadharDetailsResponse = async (e: any) => {
    e.preventDefault();
    console.log('Wife Aadhaar OTP', UserDetails.wifeAadharOtp);
    Loading(true);
    let result = await getAadharDetails({
      aadharNumber: Buffer.from(UserDetails.wifeAadhar).toString('base64'),
      transactionNumber: OtptransactionNumber,
      otp: (UserDetails.wifeAadharOtp)
    })
    Loading(false);
    if (result.status) {
      let userDet = { ...UserDetails };
      userDet.wifeAddress = ['house', 'lm','loc', 'street','vtc','dist','state','pc'].reduce((str, item) => { return str + (result.userInfo[item] ? (result.userInfo[item] + ', ') : '') }, '');
      [['name', 'wifeName_beforeMarriage'], ['state', 'wifeState'], ['dob', 'wifeDateofBirth'], ['country', 'wifeCountry'],['co','wifeFatherName'], ['dist', 'wifeDistrict']].map((item) => {
        if (result.userInfo[item[0]]) {
          if (item[0] === 'dob') {
            let arr = result.userInfo[item[0]].split('-');
            let x = arr[2];
            arr[2] = arr[0];
            arr[0] = x;
            arr = arr.join('-');
            userDet[item[1]] = arr;
          } else {
            userDet[item[1]] = result.userInfo[item[0]].toUpperCase();
          }
        }
      });

      if(userDet.wifeState!="ANDHRA PRADESH")
      {
        userDet.radio_wifeState ="OTHER";
        userDet.wifeState = ['state'].reduce((str, item) => { return str + (result.userInfo[item] ? (result.userInfo[item]) : '') }, '');
        userDet.wifeAddress = ['house', 'lm','loc', 'street','vtc','dist','pc'].reduce((str, item) => { return str + (result.userInfo[item] ? (result.userInfo[item] + ', ') : '') }, '');
      }
      else{
        if(userDet.wifeState==="ANDHRA PRADESH")
        userDet.radio_wifeState ="ANDHRA PRADESH";
       }
      
      setUserDetails({ ...userDet })
      sethideWOTP(true)
      setWifeAadharDisabled(true)
    } else {
      ShowAlert(false, result.message, "");
    }
  }

  // useEffect(() => {
  //   const handleKeyPress = (event) => {
  //     if (event.key === 'Enter') {
  //       event.preventDefault();
  //       if (event.target.name === 'husbandAadhar') {
  //         document.getElementById('husbandsendOtpButton').click();
  //       } else if (event.target.name === 'husbandAadharOtp') {
  //         document.getElementById('husbandverifyButton').click();
  //       }else if (event.target.name === 'wifeAadhar') {
  //         document.getElementById('wifesendOtpButton').click();
  //       }else if (event.target.name === 'wifeAadharOtp') {
  //         document.getElementById('wifeverifyButton').click();
  //       }
  //     }
  //   };
  //   document.addEventListener('keypress', handleKeyPress);
  //   return () => {
  //     document.removeEventListener('keypress', handleKeyPress);
  //   };
  // }, []);

  return (
    <div style={{marginBottom:'3rem'}}>
      <div className={styles.Navbar}>
        <text className={styles.NavbarText}> Welcome : {LoginDetails.loginName.toUpperCase()}</text>
        <text className={styles.NavbarText}> Last Login : {LoginDetails.lastLogin}</text>
        <div style={{ cursor: 'pointer' }} onClick={() => { handleLogOut() }} ><text className={styles.NavbarText}> Logout </text></div>
      </div>
      <form onSubmit={OnSubmit} className={styles.Container}>
        <div style={{ marginBottom: '5px' }}>
          <span><Image src="/hmr/images/LeftArrow.svg" height={16} width={14} onClick={() => { router.push(`/OfficeDashboard`); }} />
          <text className={styles.TitleText}>Hindu Marriage Act, 1955 (HMA) Registration</text></span>
       </div>
        <div className={styles.tableContainer}>
          {TableTitle('Particulars')}
          {TableTitle('Husband')}
          {TableTitle('Wife')}
        </div>

        
         {/* Aadhaar / Passport */}
         <div className={styles.tableContainer}>
          <div className={styles.singleColumn}>
            <TableText label={"1. Aadhaar/Passport"} required={true} LeftSpace={false} />
          </div>
          <div className={styles.singleColumn}>
            <div style={{ marginBottom: '5px' }}>
              <TableInputRadio label='' required={true} name='radio_husbandCountry' defaultValue={UserDetails.radio_husbandCountry} onChange={onChange} options={FeaturesList.country} />
            </div>
            {UserDetails.radio_husbandCountry === "INDIA" &&
              <div>
                <Row>
                  <Col lg={8} md={8} ms={8}>
                    <TableInputText name='husbandAadhar' disabled={husbandAadhaarDisabled} type='number' placeholder='Enter Aadhaar Number' required={true} value={UserDetails.husbandAadhar} onChange={onChange} />
                    <text className={styles.warningText}>{FormErrors.husbandAadhar}</text>
                    <text className={styles.warningText}>{validationError1 && <div>{validationError1}</div>}</text>
                    <text className={styles.warningText}>{validationError4 && <p>{validationError4}</p>}</text>
                  </Col>
                  { !hideHOTP &&
                  <Col lg={4} md={4} ms={4}>
                    {!husbandAadhaarDisabled &&
                      // <a href='javascript:void(0)' onClick={sendAadharRequestforHusbandAadhar} rel="noreferrer" >{isActive ? 'Resend OTP' : 'Send OTP'}</a>
                      <button id="husbandsendOtpButton" className={styles.adhaarbtn} onClick={sendAadharRequestforHusbandAadhar}>{isActive ? 'Resend OTP' : 'Send OTP'}</button>
                    }
                  </Col>}
                </Row>
                {showHOTP &&
                   <div>
                   { !hideHOTP &&
                  <Row style={{ marginTop: '10px' }}>
                    <Col lg={8} md={8} ms={8}>
                      <TableInputText name='husbandAadharOtp' type='number' placeholder='Enter OTP' required={true} value={UserDetails.husbandAadharOtp} onChange={onChange} />
                      <text className={styles.warningText}>{FormErrors.husbandAadharOtp}</text>
                    </Col>
                    <Col lg={4} md={4} ms={4}>
                      {/* <a href='javascript:void(0)' onClick={getHusbandAadharDetailsResponse} rel="noreferrer" >Verify</a> */}
                      <button  id="husbandverifyButton" className={styles.adhaarbtn} onClick={getHusbandAadharDetailsResponse}>Verify</button>
                    </Col>
                   </Row>
                   }
                   </div>
                  }
              </div>
            }

            {UserDetails.radio_husbandCountry != "INDIA" &&
              <div>
                <Row >
                  <TableInputText type='text' placeholder='Enter Country Name' required={true} name='husbandCountry' value={UserDetails.husbandCountry} onChange={onChange} />
                </Row>
                <Row style={{ marginTop: '0.5rem' }}>
                  <TableInputText type='text' placeholder='Enter Passport Number' required={true} name='husbandPassport' value={UserDetails.husbandPassport} onChange={onChange} />
                  <text className={styles.warningText}>{FormErrors.husbandPassport}</text>
                  <text className={styles.warningText}>{validationError3 && <div>{validationError3}</div>}</text>
                </Row>
                <Row style={{ marginTop: '0.5rem' }}>
                  <Col>
                    <TableText label={"Date of Issue :"} required={false} LeftSpace={false} />
                    <TableSelectDate max={LimitYearTo(0)} placeholder='Select Date of Issue' required={true} name={'husbandDOI'} value={UserDetails.husbandDOI} onChange={onChange} />
                  </Col>
                  <Col>
                    <TableText label={"Date of Expiry :"} required={false} LeftSpace={false} />
                    <TableSelectDate min={(moment(moment().toDate()).add(0, 'd')).format("YYYY-MM-DD")} placeholder='Select Date of Expiry' required={true} name={'husbandDOE'} value={UserDetails.husbandDOE} onChange={onChange} />
                    <text className={styles.warningText}>{FormErrors.husbandDOE}</text>
                  </Col>
                </Row>
              </div>
            }
          </div>

          <div className={styles.singleColumn}>
            <div style={{ marginBottom: '5px' }}>
              <TableInputRadio label='' required={true} name='radio_wifeCountry' defaultValue={UserDetails.radio_wifeCountry} onChange={onChange} options={FeaturesList.country} />
            </div>
            {UserDetails.radio_wifeCountry === "INDIA" &&
              <div >
                <Row>
                  <Col lg={8} md={8} ms={8}>
                    <TableInputText name='wifeAadhar' disabled={wifeAadhaarDisabled} type='number' placeholder='Enter Aadhaar Number' required={true} value={UserDetails.wifeAadhar} onChange={onChange} />
                    <text className={styles.warningText}>{FormErrors.wifeAadhar}</text>
                    <text className={styles.warningText}>{validationError2 && <div>{validationError2}</div>}</text>
                    <text className={styles.warningText}>{validationError5 && <p>{validationError5}</p>}</text>
                  </Col>
                  { !hideWOTP &&
                  <Col lg={4} md={4} ms={4} style={{ top: '10px' }}>
                    {!wifeAadhaarDisabled &&
                      // <a href='javascript:void(0)' onClick={sendAadharRequestforWifeAadhar} rel="noreferrer" >{Active ? 'Resend OTP' : 'Send OTP'}</a>
                      <button id="wifesendOtpButton" className={styles.adhaarbtn} onClick={sendAadharRequestforWifeAadhar}>{Active ? 'Resend OTP' : 'Send OTP'}</button>
                    }
                  </Col>
                  }
                </Row>
                {showWOTP &&
                <div>
                   { !hideWOTP &&
                  <Row style={{ marginTop: '10px' }}>
                    <Col lg={8} md={8} ms={8}>
                      <TableInputText name='wifeAadharOtp' type='number' placeholder='Enter OTP' required={true} value={UserDetails.wifeAadharOtp} onChange={onChange} />
                      <text className={styles.warningText}>{FormErrors.wifeAadharOtp}</text>
                    </Col>
                    <Col lg={4} md={4} ms={4}>
                      {/* <a href='javascript:void(0)' onClick={getWifeAadharDetailsResponse} rel="noreferrer" >Verify</a> */}
                      <button id="wifeverifyButton" className={styles.adhaarbtn} onClick={getWifeAadharDetailsResponse}>Verify</button>
                    </Col>
                  </Row>
                  }
                  </div>
                  }
              </div>
            }
            {UserDetails.radio_wifeCountry != "INDIA" &&
              <div>
                <Row>
                  <TableInputText type='text' placeholder='Enter Country Name' required={true} name='wifeCountry' value={UserDetails.wifeCountry} onChange={onChange} />
                </Row>
                <Row style={{ marginTop: '0.5rem' }}>
                  <TableInputText type='text' placeholder='Enter Passport Number' required={true} name='wifePassport' value={UserDetails.wifePassport} onChange={onChange} />
                  <text className={styles.warningText}>{FormErrors.wifePassport}</text>
                  <text className={styles.warningText}>{validationError3 && <div>{validationError3}</div>}</text>
                </Row>
                <Row style={{ marginTop: '0.5rem' }}>
                  <Col>
                    <TableText label={"Date of Issue :"} required={false} LeftSpace={false} />
                    <TableSelectDate  max={LimitYearTo(0)} placeholder='Select Date of Issue' required={true} name={'wifeDOI'} value={UserDetails.wifeDOI} onChange={onChange} />
                  </Col>
                  <Col>
                    <TableText label={"Date of Expiry :"} required={false} LeftSpace={false} />
                    <TableSelectDate min={(moment(moment().toDate()).add(0, 'd')).format("YYYY-MM-DD")} placeholder='Select Date of Expiry' required={true} name={'wifeDOE'} value={UserDetails.wifeDOE} onChange={onChange} />
                    <text className={styles.warningText}>{FormErrors.wifeDOE}</text>
                  </Col>
                </Row>
              </div>
            }
          </div>
        </div>



        {/*name*/}
        <div className={styles.tableContainer}>
          <div className={styles.singleColumn}>
            <TableText label={"2. Full Name"} required={true} LeftSpace={false} />
          </div>
          <div className={styles.singleColumn}>
            <TableInputText name='husbandName' type='text' placeholder='Name - Surname' required={true} value={UserDetails.husbandName} onChange={onChange} />
          </div>

          <div className={styles.singleColumn}>
            <div style={{ marginBottom: '5px' }}><TableInputText type='text' placeholder='Before Marriage (Name - Surname) ' required={true} name='wifeName_beforeMarriage' value={UserDetails.wifeName_beforeMarriage} onChange={onChange} /></div>
            {UserDetails.change_wifeName_to_afterMarriage == "YES" && <TableInputText type='text' placeholder='After Marriage (Name - Surname)' required={true} name='wifeName_afterMarriage' value={UserDetails.wifeName_afterMarriage} onChange={onChange} />}
            {UserDetails.change_wifeName_to_afterMarriage == "YES" && <text className={styles.warningText}>{FormErrors.wifeName_afterMarriage}</text>}
            <div>
              <TableInputRadio label='Do you want to change the surname after marriage?' required={true} name='change_wifeName_to_afterMarriage' defaultValue={UserDetails.change_wifeName_to_afterMarriage} onChange={onChange} options={FeaturesList.Boolean} />
            </div>
          </div>
        </div>

         {/* Date of Birth */}
         <div className={styles.tableContainer}>
          <div className={styles.singleColumn}>
            <TableText label='3. Date of Birth (As per SSC certificate)' required={true} LeftSpace={false} />
          </div>
          <div className={styles.singleColumn}>
            <TableSelectDate max={LimitYearTo(21)} placeholder='Select Date' required={true} name={'husbandDateofBirth'} value={UserDetails.husbandDateofBirth} onChange={onChange} />
          </div>
          <div className={styles.singleColumn}>
            <TableSelectDate max={LimitYearTo(18)} placeholder='Select Date' required={true} name={'wifeDateofBirth'} value={UserDetails.wifeDateofBirth} onChange={onChange} />
          </div>
        </div>

          {/* state */}
          <div className={styles.tableContainer}>
          <div className={styles.singleColumn}>
            <TableText label={"4. State"} required={true} LeftSpace={false} />
          </div>
          <div className={styles.singleColumn}>
            <div style={{ marginBottom: '5px' }}>
              {UserDetails.radio_husbandCountry == "INDIA" && <TableInputRadio label='' required={true} name='radio_husbandState' defaultValue={UserDetails.radio_husbandState} onChange={onChange} options={FeaturesList.state} />}
            </div>
            {UserDetails.radio_husbandCountry == "INDIA" && UserDetails.radio_husbandState != "ANDHRA PRADESH" && <TableInputText type='text' placeholder='Enter State Name' required={true} name='husbandState' value={UserDetails.husbandState} onChange={onChange} />}
            {/* {
            UserDetails.radio_husbandCountry == "INDIA" && UserDetails.radio_husbandState === 'ANDHRA PRADESH' && (
              <div className={styles.rightColumn}>
            <div>
              <text>Select District</text>
              <TableDropdown required={true} options={DistrictList} name='husbandDistrict' value={UserDetails.husbandDistrict} sro={true} onChange={(e: any) => {getVillages(e, 'district', 'husband')}} />
            </div>
            <div>
              <text>Select Mandal</text>
              <TableDropdown required={true} options={husbandMandalList} name='husbandMandal' value={UserDetails.husbandMandal} sro={true} onChange={(e: any) => {getVillages(e, 'mandal', 'husband')}} />
            </div>
            <div>
              <text>Select Village</text>
              <TableDropdown required={true} options={husbandVillageList} name='husbandVillageWard' value={UserDetails.husbandVillageWard} sro={true} customized={{'label': 'villageName', 'value': 'revVillageCode'}} onChange={(e: any) => {getVillages(e, 'village', 'husband')}} />
            </div>
          </div>
            )
          } */}
          </div>
          <div className={styles.singleColumn}>
            <div style={{ marginBottom: '5px' }}>
              {UserDetails.radio_wifeCountry == "INDIA" && <TableInputRadio label='' required={true} name='radio_wifeState' defaultValue={UserDetails.radio_wifeState} onChange={onChange} options={FeaturesList.state} />}
            </div>
            {UserDetails.radio_wifeCountry == "INDIA" && UserDetails.radio_wifeState != "ANDHRA PRADESH" && <TableInputText type='text' placeholder='Enter State Name' required={true} name='wifeState' value={UserDetails.wifeState} onChange={onChange} />}
            {/* {
            UserDetails.radio_wifeCountry == "INDIA" && UserDetails.radio_wifeState === 'ANDHRA PRADESH' && (
              <div className={styles.rightColumn}>
            <div>
              <text>Select District</text>
              <TableDropdown required={true} options={DistrictList} name='wifeDistrict' value={UserDetails.wifeDistrict} sro={true} onChange={(e: any) => {getVillages(e, 'district', 'wife')}} />
            </div>
            <div>
              <text>Select Mandal</text>
              <TableDropdown required={true} options={wifeMandalList} name='wifeMandal' value={UserDetails.wifeMandal} sro={true} onChange={(e: any) => {getVillages(e, 'mandal', 'wife')}} />
            </div>
            <div>
              <text>Select Village</text>
              <TableDropdown required={true} options={wifeVillageList} name='wifeVillageWard' value={UserDetails.wifeVillageWard} sro={true} customized={{'label': 'villageName', 'value': 'revVillageCode'}} onChange={(e: any) => {getVillages(e, 'village', 'wife')}} />
            </div>
          </div>
            )
          } */}
          </div>
        </div>

        {/* permanentplace */}
        <div className={styles.tableContainer}>
          <div className={styles.singleColumn}>
            <TableText label='5. Residence Address' required={true} LeftSpace={false} />
            <TableText label='(Village, Street  Should be Separated by Comma)' required={false} LeftSpace={false} />
          </div>
          <div className={styles.singleColumn}>
            <TableInputLongText placeholder='Enter Complete Address' required={true} name='husbandAddress' value={UserDetails.husbandAddress} onChange={onChange} />
          </div>
          <div className={styles.singleColumn}>
            <TableInputLongText placeholder='Enter Complete Address' required={true} name='wifeAddress' value={UserDetails.wifeAddress} onChange={onChange} />
          </div>
        </div>

        {/* Relationship */}
        <div className={styles.tableContainer}>
          <div className={styles.singleColumn}>
            <TableText label='6. Relationship with following Member' required={true} LeftSpace={false} />
          </div>
          <div className={styles.singleColumn}>
            <TableInputRadio label='' required={true} name='husbandRelationship' defaultValue={UserDetails.husbandRelationship} options={FeaturesList.relationship} onChange={onChange} />
          </div>
          <div className={styles.singleColumn}>
            <TableInputRadio label='' required={true} name='wifeRelationship' defaultValue={UserDetails.wifeRelationship} options={FeaturesList.relationship} onChange={onChange} />
          </div>
        </div>

          {/* father */}
          <div className={styles.tableContainer}>
          <div className={styles.singleColumn}>
            <TableText label="7. Father/Guardian Name" required={true} LeftSpace={false} />
          </div>
          <div className={styles.singleColumn}>
            <TableInputText type='text' placeholder="Husband's Father/Guardian Fullname" required={true} name={'husbandFatherName'} value={UserDetails.husbandFatherName} onChange={onChange} />
          </div>
          <div className={styles.singleColumn}>
            <TableInputText type='text' placeholder="Wife's Father/Guardian Fullname" required={true} name={'wifeFatherName'} value={UserDetails.wifeFatherName} onChange={onChange} />
          </div>
        </div>

        {/* mother */}
        <div className={styles.tableContainer}>
          <div className={styles.singleColumn}>
            <TableText label="8. Mother Name" required={true} LeftSpace={false} />
          </div>
          <div className={styles.singleColumn}>
            <TableInputText type='text' placeholder="Husband's Mother Name" required={true} name={'husbandMotherName'} value={UserDetails.husbandMotherName} onChange={onChange} />
          </div>
          <div className={styles.singleColumn}>
            <TableInputText type='text' placeholder="Wife's Mother Name" required={true} name={'wifeMotherName'} value={UserDetails.wifeMotherName} onChange={onChange} />
          </div>
        </div>



        {/* religion */}
        <div className={styles.tableContainer}>
          <div className={styles.singleColumn}>
            <TableText label='9. Religion' required={true} LeftSpace={false} />
          </div>
          <div className={styles.singleColumn}>
            {/* <TableInputText name={'husbandReligion'} type='text' placeholder='...' required={true} value={UserDetails.husbandReligion} onChange={() => { }} /> */}
            <TableDropdown required={true} options={FeaturesList.ReligionList} name={'husbandReligion'} value={UserDetails.husbandReligion} onChange={onChange} />
          </div>
          <div className={styles.singleColumn}>
            <TableDropdown required={true} options={FeaturesList.ReligionList} name={'wifeReligion'} value={UserDetails.wifeReligion} onChange={onChange} />
          </div>
        </div>

        {/* cast */}
        <div className={styles.tableContainer}>
          <div className={styles.singleColumn}>
            <TableText label='10. Caste Type' required={true} LeftSpace={false} />
          </div>
          <div className={styles.singleColumn}>
            <TableDropdown required={true} options={FeaturesList.castOptions} name={'casteType'} value={UserDetails.casteType} onChange={onChange} />
          </div>
          <div className={styles.singleColumn}>
          </div>
        </div>

        {/* Caste Name */}
        <div className={styles.tableContainer}>
          <div className={styles.singleColumn}>
            <TableText label='11. Caste Name' required={true} LeftSpace={false} />
          </div>
          <div className={styles.singleColumn}>
          {UserDetails.casteType == "SAME CASTE" || UserDetails.casteType == "DIFFERENT CASTE" ?
            <TableDropdown required={true} options={CasteListForHusband} name='husbandCaste' value={UserDetails.husbandCaste} sro={true} onChange={onChange} />
            :null}
            {/* <TableInputText name={'husbandCaste'} type='text' placeholder='Caste Name' required={true} value={UserDetails.husbandCaste} onChange={onChange} /> */}
            {UserDetails.husbandCaste == "OTHER MUSLIMS GROUPS" && <text className={styles.warningText}>EXCLUDING SYED, SAIYED, SAYYAD, MUSHAIK, MUGHAL, MOGHAL, PATHANS, IRANI, ARAB, BOHARA, BOHRA, SHIA IMAMI ISMAILI, KHOJA, CUTCHI - MEMON, JAMAYAT, NAVAYAT</text>}
            {UserDetails.husbandCaste === "OTHERS" && <TableInputText type="text" placeholder='Enter Caste Name' required={true} value={UserDetails.husbandOtherCaste} name="husbandOtherCaste" onChange={onChange}/>}
          </div>
          <div className={styles.singleColumn}>
            {UserDetails.casteType == "SAME CASTE" ?
              <TableText label={UserDetails.wifeCaste === 'OTHERS' ? UserDetails.wifeOtherCaste : UserDetails.wifeCaste} required={false} LeftSpace={false} textTransform={'uppercase'}/>
              :
              <div>{UserDetails.casteType == "DIFFERENT CASTE" ?
              <TableDropdown required={true} options={CasteListForWife} name='wifeCaste' value={UserDetails.wifeCaste} sro={true} onChange={onChange} />:null
              }</div>
            }
            {UserDetails.wifeCaste == "OTHER MUSLIMS GROUPS" && <text className={styles.warningText}>EXCLUDING SYED, SAIYED, SAYYAD, MUSHAIK, MUGHAL, MOGHAL, PATHANS, IRANI, ARAB, BOHARA, BOHRA, SHIA IMAMI ISMAILI, KHOJA, CUTCHI - MEMON, JAMAYAT, NAVAYAT</text>}
            {UserDetails.wifeCaste === "OTHERS" && UserDetails.casteType != "SAME CASTE" && <><TableInputText type="text" placeholder='Enter Caste Name' required={true} value={UserDetails.wifeOtherCaste} name="wifeOtherCaste" onChange={onChange}/><text className={styles.warningText}>{FormErrors.wifeOtherCaste}</text></>}
          </div>
        </div>

        {/* Mobile */}
        <div className={styles.tableContainer}>
          <div className={styles.singleColumn}>
            <TableText label='12. Mobile' required={true} LeftSpace={false} />
          </div>
          <div className={styles.singleColumn}>
            <TableInputText  type='number' placeholder='10 Digit Mobile Number' required={true} name='husbandMobile' value={UserDetails.husbandMobile} onChange={onChange}/>
            <text className={styles.warningText}>{FormErrors.husbandMobile}</text>
          </div>
          <div className={styles.singleColumn}>
            <TableInputText type='number' placeholder='10 Digit Mobile Number' required={true} name='wifeMobile' value={UserDetails.wifeMobile} onChange={onChange} />
            <text className={styles.warningText}>{FormErrors.wifeMobile}</text>
          </div>
        </div>


        {/* rankorprofession
        // <div className={styles.tableContainer}>
        //   <div className={styles.singleColumn}>
        //     <TableText label='7. Profession' required={true} LeftSpace={false} />
        //   </div>
        //   <div className={styles.singleColumn}>
        //     <TableInputText name={'husbandRankorProfession'} type='text' placeholder='profession' required={true} value={UserDetails.husbandRankorProfession} onChange={onChange} />
        //   </div>
        //   <div className={styles.singleColumn}>
        //     <TableInputText name={'wifeRankorProfession'} type='text' placeholder='profession' required={true} value={UserDetails.wifeRankorProfession} onChange={onChange} />
        //   </div>
        // </div> */}

        {/* country
        <div className={styles.tableContainer}>
          <div className={styles.singleColumn}>
            <TableText label={"7. Country"} required={true} LeftSpace={false} />
          </div>
          <div className={styles.singleColumn}>
            <div style={{ marginBottom: '5px' }}>
              <TableInputRadio label='' required={true} name='radio_husbandCountry' defaultValue={UserDetails.radio_husbandCountry} onChange={onChange} options={FeaturesList.country} />
            </div>
            {UserDetails.radio_husbandCountry != "INDIA" && <TableInputText type='text' placeholder='Enter Country Name' required={true} name='husbandCountry' value={UserDetails.husbandCountry} onChange={onChange} />}
          </div>
          <div className={styles.singleColumn}>
            <div style={{ marginBottom: '5px' }}>
              <TableInputRadio label='' required={true} name='radio_wifeCountry' defaultValue={UserDetails.radio_wifeCountry} onChange={onChange} options={FeaturesList.country} />
            </div>
            {UserDetails.radio_wifeCountry != "INDIA" && <TableInputText type='text' placeholder='Enter Country Name' required={true} name='wifeCountry' value={UserDetails.wifeCountry} onChange={onChange} />}
          </div>
        </div> */}

      
        {/* divorce */}
        <div className={styles.tableContainer}>
          <div className={styles.singleColumn}>
            <TableText label={"13. Whether Wife or Husband is a Divorcee?"} required={true} LeftSpace={false} />
          </div>
          <div className={styles.singleColumn}>
            <div style={{ marginBottom: '5px' }}>
              <TableInputRadio label='Date of Divorce' required={true} name='radio_isHusbandDivorcee' defaultValue={UserDetails.radio_isHusbandDivorcee} onChange={onChange} options={FeaturesList.Boolean} />
            </div>
            {UserDetails.radio_isHusbandDivorcee != "NO" &&
              <TableSelectDate max={moment(moment().toDate()).format("YYYY-MM-DD")} placeholder='Select Date' required={true} name='isHusbandDivorcee' value={UserDetails.isHusbandDivorcee} onChange={onChange} />}
          </div>
          <div className={styles.singleColumn}>
            <div style={{ marginBottom: '5px' }}>
              <TableInputRadio label='Date of Divorce' required={true} name='radio_isWifeDivorcee' defaultValue={UserDetails.radio_isWifeDivorcee} onChange={onChange} options={FeaturesList.Boolean} />
            </div>
            {UserDetails.radio_isWifeDivorcee != "NO" &&
              <TableSelectDate max={moment(moment().toDate()).format("YYYY-MM-DD")} placeholder='Select Date' required={true} name='isWifeDivorcee' value={UserDetails.isWifeDivorcee} onChange={onChange} />}
          </div>
        </div>

        {/* widow */}
        <div className={styles.tableContainer}>
          <div className={styles.singleColumn}>
            <TableText label={"14. Whether Wife or Husband is a Widow / Widower?"} required={true} LeftSpace={false} />
          </div>
          <div className={styles.singleColumn}>
            <div style={{ marginBottom: '5px' }}>
              <TableInputRadio label='' required={true} name='isHusbandWidower' defaultValue={UserDetails.isHusbandWidower} onChange={onChange} options={FeaturesList.Boolean} />
            </div>
          </div>
          <div className={styles.singleColumn}>
            <div style={{ marginBottom: '5px' }}>
              <TableInputRadio label='' required={true} name='isWifeWidow' defaultValue={UserDetails.isWifeWidow} onChange={onChange} options={FeaturesList.Boolean} />
            </div>
          </div>
        </div>
     
        {/* date of marriage */}
        <div className={styles.marriageContainer}>
          <div className={styles.leftColumn}>
            <TableText label='15. Date of Marriage' required={true} LeftSpace={false} />
          </div>
          <div className={styles.rightColumn}>
            {/* <text>{moment(moment().toDate()).toString()}</text> */}
            <TableSelectDate max={DateCalculator('today')} name='marriageDate' placeholder='Select Date' required={true} value={UserDetails.marriageDate} onChange={onChange} />
          </div>
          {/* <div className={styles.singleColumn}>
          </div> */}
        </div>

        {/* marriage location */}
        <div className={styles.marriageContainer}>
          <div className={styles.leftColumn}>
            <TableText label='16. Place of Marriage' required={true} LeftSpace={false} />
            <TableText label='(Village, Street  Should be Separated by a comma(","))' required={false} LeftSpace={false} />
          </div>
          <div className={styles.rightColumn}>
            <TableDropdown required={true} options={FeaturesList.marriageLocationOptions} name={"marriageAddress_action"} value={UserDetails.marriageAddress_action} onChange={onChange} />
            {/* {
              UserDetails.marriageAddress_action === 'ENTER LOCATION (IN ANDHRA PRADESH)' && (
                <div className={styles.marriageDropDown}>
            <div>
              <text>Select District</text>
              <TableDropdown required={true} options={DistrictList} name='marriageDistrict' value={UserDetails.marriageDistrict} sro={true} onChange={(e: any) => {getVillages(e, 'district', 'marriage')}} />
            </div>
            <div>
              <text>Select Mandal</text>
              <TableDropdown required={true} options={marriageMandalList} name='marriageMandal' value={UserDetails.marriageMandal} sro={true} onChange={(e: any) => {getVillages(e, 'mandal', 'marriage')}} />
            </div>
            <div>
              <text>Select Village</text>
              <TableDropdown required={true} options={marriageVillageList} name='marriageVillageWard' value={UserDetails.marriageVillageWard} sro={true} customized={{'label': 'villageName', 'value': 'revVillageCode'}} onChange={(e: any) => {getVillages(e, 'village', 'marriage')}} />
            </div>
          </div>
              )
            } */}
            {UserDetails.isMarriageLocationDifferent && <TableInputLongText placeholder='Enter Complete Address' required={true} name='marriageAddress' value={UserDetails.marriageAddress} onChange={onChange} />}
          </div>
        </div>


         {/* place of registration */}
         {LoginDetails.role === 'VR' &&
         <div className={styles.marriageContainer}>
          <div className={styles.leftColumn}>
            <TableText label='17. Place of Registration' required={true} LeftSpace={false} />
          </div>
          <div className={styles.rightColumn}>
            <TableDropdown required={true} options={FeaturesList.registrationLocationOptions} name={"registrationAddress"} value={UserDetails.registrationAddress} onChange={onChange} />
          </div>
        </div>
          } 

        {/* office */}
        {/* <div className={styles.marriageContainer}>
          <div className={styles.leftColumn}>
            <TableText label='17. Choose SRO Office' required={true} LeftSpace={false} />
          </div>
          <div className={styles.rightColumn}>
            <div>
              <text>Select District</text>
              <TableDropdown required={true} options={DistrictList} name='district' value={UserDetails.district} sro={true} onChange={(e: any) => ForSROSelect(e, "district")} />
            </div>
            <div>
              <text>Select Mandal</text>
              <TableDropdown required={true} options={MandalList} name='mandal' value={UserDetails.mandal} sro={true} onChange={(e: any) => ForSROSelect(e, "mandal")} />
            </div>
            <div>
              <text>Select SRO Office</text>
              <TableDropdown required={true} options={OfficeList} name='sroOffice' value={UserDetails.sroOffice} sro={true} onChange={onChange} />
            </div>
          </div>
        </div> */}

        {/* certificatecopies */}
        <div className={styles.marriageContainer}>
          <div className={styles.leftColumn}>
             {LoginDetails.role === 'VR' ?
            <TableText label="18. Number of Certificate Copies" required={true} LeftSpace={false} />:
            <TableText label="17. Number of Certificate Copies" required={true} LeftSpace={false} />
            }
          </div> 
       
          <div className={styles.rightColumn}>
            <TableInputRadio label='' required={true} name='certificateCopies' defaultValue={UserDetails.certificateCopies} options={FeaturesList.coppies} onChange={onChange} />
            {/* <TableInputText type='number' placeholder='' required={true} name={'certificateCopies'} value={UserDetails.certificateCopies} onChange={onChange} /> */}
          </div>
        </div>

        {/* timeslot */}
        {/* <div className={styles.tableContainer}>
          <div className={styles.singleColumn}>
            <TableText label=' 19. Slot Booking for Registration' required={true} LeftSpace={false} />
          </div>
          <div className={styles.singleColumn}>
            <TableSelectDate min={(moment(moment().toDate()).add(1, 'd')).format("YYYY-MM-DD")} max={(moment(moment().toDate()).add(3, 'M')).format("YYYY-MM-DD")} placeholder='Select Slot Date' required={true} name={'slotDate'} value={UserDetails.slotDate} onChange={onChange} />
          </div>
          <div className={styles.singleColumn}>
            <TableDropdown required={true} options={FeaturesList.timeslotOptions} name={'slotTime'} value={UserDetails.slotTime} onChange={onChange} />
          </div>
        </div> */}


        {/* Fine uploads */}
        <div style={{ backgroundColor: '#F6F6F6', padding: '1em' }}>
          <text className={styles.UploadText} style={{ fontWeight: 'bold' }}>Document List </text>
          <div className={styles.UploadText} style={{ color: 'red' }} >*Note: Please upload the documents in JPG/JPEG/PNG formats only and size should not exceed 1MB. Only a single image is allowed in each section.</div>
        </div>
        <div>
          <UploadContainer onCancelUpload={onCancelUpload} isUploadDone={UserDetails.doc_weddingCard_upload} label='Wedding Card' required={false} uploadKey={'doc_weddingCard_upload'} onChange={(e: any) => { OnFileSelect(e, 'doc_weddingCard', 'doc_weddingCard_upload') }} showOnlyImage={true}/>
          <UploadContainer onCancelUpload={onCancelUpload} isUploadDone={UserDetails.doc_husbandBirthProof_upload} label="Birth Certificate/SSC Marks Memo/Passport/Notary Affidavit (Husband)" uploadKey={'doc_husbandBirthProof_upload'} required={true} onChange={(e: any) => { OnFileSelect(e, 'doc_husbandBirthProof', 'doc_husbandBirthProof_upload') }} showOnlyImage={true}/>
          <UploadContainer onCancelUpload={onCancelUpload} isUploadDone={UserDetails.doc_wifeBirthProof_upload} label="Birth Certificate/SSC Marks Memo/Passport/Notary Affidavit (Wife)" required={true} uploadKey={'doc_wifeBirthProof_upload'} onChange={(e: any) => { OnFileSelect(e, 'doc_wifeBirthProof', 'doc_wifeBirthProof_upload') }} showOnlyImage={true}/>
          <UploadContainer onCancelUpload={onCancelUpload} isUploadDone={UserDetails.doc_marriagePhoto_upload} label='Marriage Photo (Upload a photo with in wedding attire)' required={false} uploadKey={'doc_marriagePhoto_upload'} onChange={(e: any) => { OnFileSelect(e, 'doc_marriagePhoto', 'doc_marriagePhoto_upload') }} showOnlyImage={true} />
          <UploadContainer onCancelUpload={onCancelUpload} isUploadDone={UserDetails.doc_husbandPhoto_upload} label='Husband Photo' required={true} uploadKey={'doc_husbandPhoto_upload'} onChange={(e: any) => { OnFileSelect(e, 'doc_husbandPhoto', 'doc_husbandPhoto_upload') }} showOnlyImage={true} />
          <UploadContainer onCancelUpload={onCancelUpload} isUploadDone={UserDetails.doc_wifePhoto_upload} label='Wife Photo' required={true} uploadKey={'doc_wifePhoto_upload'} onChange={(e: any) => { OnFileSelect(e, 'doc_wifePhoto', 'doc_wifePhoto_upload') }} showOnlyImage={true} />
          <UploadContainer onCancelUpload={onCancelUpload} isUploadDone={UserDetails.doc_husbandResidenceProof_upload} label="Residence Proof (Husband)" required={true} uploadKey={'doc_husbandResidenceProof_upload'} onChange={(e: any) => { OnFileSelect(e, 'doc_husbandResidenceProof', 'doc_husbandResidenceProof_upload') }} showOnlyImage={true}/>
          <UploadContainer onCancelUpload={onCancelUpload} isUploadDone={UserDetails.doc_wifeResidenceProof_upload} label="Residence Proof (Wife)" required={true} uploadKey={'doc_wifeResidenceProof_upload'} onChange={(e: any) => { OnFileSelect(e, 'doc_wifeResidenceProof', 'doc_wifeResidenceProof_upload') }} showOnlyImage={true}/>
          <UploadContainer onCancelUpload={onCancelUpload} isUploadDone={UserDetails.doc_marriageRecept_upload} label="Marriage Function Hall Receipt (Optional)" required={false} uploadKey={'doc_marriageRecept_upload'} onChange={(e: any) => { OnFileSelect(e, 'doc_marriageRecept', 'doc_marriageRecept_upload') }} showOnlyImage={true} />
          {
            UserDetails.radio_isHusbandDivorcee == "YES" &&
            <UploadContainer onCancelUpload={onCancelUpload} isUploadDone={UserDetails.doc_isHusbandDivorcee_upload} label='Divorcee Proof/Decree of Court (Husband)' required={true} uploadKey='doc_isHusbandDivorcee_upload' onChange={(e: any) => { OnFileSelect(e, 'doc_isHusbandDivorcee', 'doc_isHusbandDivorcee_upload') }} showOnlyImage={true}/>
          }
          {
            UserDetails.isHusbandWidower == "YES" &&
            <UploadContainer onCancelUpload={onCancelUpload} isUploadDone={UserDetails.doc_isHusbandWidower_upload} label='Proof of Death (Deceased Wife)' required={true} uploadKey='doc_isHusbandWidower_upload' onChange={(e: any) => { OnFileSelect(e, 'doc_isHusbandWidower', 'doc_isHusbandWidower_upload') }} showOnlyImage={true}/>
          }
          {
            UserDetails.radio_isWifeDivorcee == "YES" &&
            <UploadContainer onCancelUpload={onCancelUpload} isUploadDone={UserDetails.doc_isWifeDivorcee_upload} label='Divorcee Proof/Decree of Court (Wife)' required={true} uploadKey='doc_isWifeDivorcee_upload' onChange={(e: any) => { OnFileSelect(e, 'doc_isWifeDivorcee', 'doc_isWifeDivorcee_upload') }} showOnlyImage={true}/>
          }
          {
            UserDetails.isWifeWidow == "YES" &&
            <UploadContainer onCancelUpload={onCancelUpload} isUploadDone={UserDetails.doc_isWifeWidow_upload} label='Proof of Death (Deceased Husband)' required={true} uploadKey='doc_isWifeDivorcee_upload' onChange={(e: any) => { OnFileSelect(e, 'doc_isWifeWidow', 'doc_isWifeWidow_upload') }} showOnlyImage={true}/>
          }
        </div>
        {/* <div style={{ backgroundColor: '#F6F6F6', padding: '1em' }}>
          <text className={styles.UploadText}>Amount Payable: </text>
          <text className={styles.UploadText} style={{ color: 'red', fontWeight: 'bold' }} >{UserDetails.casteType == "SAME CASTE" ? " Rs 200/-" : "Rs 0"}</text>
          {UserDetails.casteType == "SAME CASTE" ?
            <div>
              <div style={{ display: 'flex', gap: '5px' }}>
                <TableText label='Select Payment Mode :' required={false} LeftSpace={false} />
                <TableInputRadio label='' required={true} name="paymentType" defaultValue={UserDetails.paymentType} options={FeaturesList.paymentOptions} onChange={onChange} />
              </div>
              {UserDetails.paymentType == "PAY ONLINE" ?
                <div>
                  <text className={styles.UploadText} style={{ fontWeight: 'bold' }}>Payment Link : </text>
                  <a 
                  // href='javascript:void(0)' onClick={() => handlePaymentLinkClick()} 
                  href="https://cfms.ap.gov.in//"
                  target={"_blank"}
                  rel="noreferrer" className={styles.UploadText} >Click here to Pay</a>
                  <div>
                    <text className={styles.UploadText} style={{ fontWeight: 'bold' }}>Guidelines for payment: </text>
                    <a href='https://drive.google.com/file/d/1tUGzbUDrErXABENRBSQXlzrYgTj0v10D/view?usp=sharing' target="_blank" rel="noreferrer" className={styles.UploadText} >View Payment Instructions</a>
                  </div>
                  <div>
                    <text className={styles.UploadText} style={{ color: 'red' }} >*Please make the payment by clicking on the payment Link and upload receipt here.</text>
                  </div>
                  <div className={styles.tableContainer}>
                    <div className={styles.singleColumn}>
                      <TableText label="Dept. Transaction ID" required={true} LeftSpace={false} />
                    </div>
                    <div className={styles.singleColumn} style={{ width: '70%' }}>
                      <TableInputText type='text' placeholder="" required={true} name={'transactionId'} value={UserDetails.transactionId} onChange={onChange} />
                    </div>
                  </div>
                  <div className={styles.tableContainer}>
                    <div className={styles.singleColumn}>
                      <TableText label="Amount Paid" required={true} LeftSpace={false} />
                    </div>
                    <div className={styles.singleColumn} style={{ width: '70%' }}>
                      <TableInputText type='number' placeholder="" required={true} name={'paidAmount'} value={UserDetails.paidAmount} onChange={onChange} />
                    </div>
                  </div>
                  <UploadContainer onCancelUpload={onCancelUpload} isUploadDone={UserDetails.doc_receipt_upload} label="Payment Receipt" required={true} uploadKey='doc_receipt_upload' onChange={(e: any) => { OnFileSelect(e, 'doc_receipt', 'doc_receipt_upload') }} showOnlyImage={true}/>
                </div>
                :
                <div>
                  <text className={styles.UploadText} style={{ color: 'red' }} > The Applicant is allowed to pay at SRO at the time of verification.</text>
                </div>
              }
            </div>
            :
            <div>
              <text className={styles.UploadText} style={{ color: 'red' }} > Note: No fee payable for Inter-Caste Marriages as per G.O.- Ms.-No:1175, Home, General A, Department dated 05-10-1976.</text>
            </div>
          }
        </div> */}
        <div className={styles.paymentContainer}>
          <button className={styles.paymentButtton}>SUBMIT</button>
        </div>
      </form>
      {/* <pre>{JSON.stringify(UserDetails, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(LoginDetails, null, 2)}</pre>  */}
    </div>
  )
}

export default SRORegistrations;
