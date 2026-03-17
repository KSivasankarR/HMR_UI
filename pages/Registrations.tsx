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
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import { LoadingAction, PopupAction } from '../src/redux/commonSlice';
import {
  SaveUser, UploadDoc, removeUploadDoc, GetCaste, GetDistrict, GetMandal, GetOffice, getAadharDetails, getAadharOTP,
  CallCreateNewReg, GetUserByAppNo, getVillageData, getSroOfficesByVC, CallTokenInvalidate, GetPaymentStatus, registeredDraftSavedAPI,
  GetChallanData,
} from '../src/axios';
import { Row, Col } from 'react-bootstrap'
import moment from 'moment';
import SelectUploadContainer from '../src/components/SelectUploadContainer';
import { handleLogOut } from '../utils';
moment.defaultFormat = "DD-MM-YYYY";
import Image from 'next/image';

const FeaturesList = {
  office: [{ value: "SRO", label: "SRO" }, { value: "VSWS", label: "VSWS" }],
  country: [{ value: "INDIA", label: "INDIA" }, { value: "OTHER", label: "OTHER" }],
  state: [{ value: "ANDHRA PRADESH", label: "ANDHRA PRADESH" }, { value: "OTHER", label: 'OTHER' }],
  Boolean: [{ value: "YES", label: "YES" }, { value: "NO", label: "NO" }],
  marriageLocationOptions: [
    // {label: "TIRUMALA"}, 
    { label: "ENTER LOCATION" }, { label: 'ENTER LOCATION (IN ANDHRA PRADESH)' }, { label: "SAME AS HUSBAND LOCATION" }, { label: "SAME AS WIFE LOCATION" }],
  castOptions: [{ label: "SAME CASTE" }, { label: "DIFFERENT CASTE" }],
  timeslotOptions: [{ label: "10:30 AM" }, { label: "10:45 AM" }, { label: "11:00 AM" }, { label: "11:15 AM" },
  { label: "11:30 AM" }, { label: "11:45 AM" }, { label: "12:00 PM" }, { label: "12:15 PM" },
  { label: "12:30 PM" }, { label: "12:45 PM" }, { label: "01:00 PM" }, { label: "01:15 PM" },
  { label: "02:00 PM" }, { label: "02:15 PM" }, { label: "02:30 PM" }, { label: "02:45 PM" },
  { label: "03:00 PM" },
  ],
  officeOptions: [{ label: "Open" }, { label: "Anantapur" }, { label: "Vijayawada" }],
  relationship: [{ value: "PARENTS", label: "PARENTS" }, { value: "GUARDIAN", label: "GUARDIAN" }],
  paymentOptions: [{ value: "PAY ONLINE", label: "PAY ONLINE" }],
  vswsPaymentOptions: [ { value: "PAY ONLINE", label: "PAY ONLINE" }],
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
  radio_office:"SRO",
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
  regDate: "",
  status: "PENDING",
  sroOffice: "",
  villageScretariatName:"",
  villageScretariatCode:"",
  slotDate: "",
  slotTime: "",
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
  paymentType: "PAY ONLINE",
  doc_marriageRecept: "",
  doc_marriageRecept_upload: "",
  isMarriageLocationDifferent: false,
  marriageAddress_action: "",
  district: "",
  mandal: "",
  husbandDistrict: "",
  husbandMandal: "",
  husbandVillageWard: "",
  wifeDistrict: "",
  wifeMandal: "",
  wifeVillageWard: "",
  marriageDistrict: "",
  marriageMandal: "",
  marriageVillageWard: "",
  isThirumala:false
}

const Registrations = () => {
  let initialLoginDetails = useAppSelector((state) => state.login.loginDetails);
  const [LoginDetails, setLoginDetails] = useState(initialLoginDetails)
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
  const [VswsList, setVswsList] = useState<any>([]);
  const [Flag, setFlag] = useState(false);
  const [husbandMandalList, setHusbandMandalList] = useState([]);
  const [husbandVillageList, setHusbandVillageList] = useState([]);
  const [wifeMandalList, setWifeMandalList] = useState([]);
  const [wifeVillageList, setWifeVillageList] = useState([]);
  const [marriageMandalList, setMarriageMandalList] = useState([]);
  const [marriageVillageList, setMarriageVillageList] = useState([]);
  const [payData, setPayData] = useState<any>({})
  const [showHOTP, setShowHOTP] = useState(false);
  const [showWOTP, setShowWOTP] = useState(false);
  const [hideHOTP, sethideHOTP] = useState(false);
  const [hideWOTP, sethideWOTP] = useState(false);
  const [showInputs, setShowInputs] = useState(false);
  const [husbandAadhaarDisabled, setHusbandAadharDisabled] = useState(false);
  const [wifeAadhaarDisabled, setWifeAadharDisabled] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [Active, setActive] = useState(false);
  const [wifeOtptransactionNumber, getWifeOtpTransactionNumber] = useState("")
  const [husbandOtptransactionNumber, getHusbandOtpTransactionNumber] = useState("")
  const [isTirumalaSelected, setIsTirumalaSelected] = useState(false);
  const [validationError1, setValidationError1] = useState('');
  const [validationError2, setValidationError2] = useState('');
  const [validationError3, setValidationError3] = useState('');
  const [validationError4, setValidationError4] = useState('');
  const [validationError5, setValidationError5] = useState('');
  const ShowAlert = (type, message, redirect) => { dispatch(PopupAction({ enable: true, type: type, message: message, redirect })); }
  const Loading = (value: boolean) => { dispatch(LoadingAction({ enable: value })); }
  const [selectedPaymentMode, setSelectedPaymentMode] = useState('IGRS');
  const [challanData, setChallanData] = useState({challanNumber: ''});
  const payModeOptions = [{ label: 'IGRS', value: 'IGRS' },{ label: 'CFMS', value: 'CFMS' }];
  const [isDraftSaved, setIsDraftSaved] = useState(false);

  useEffect(() => { getAllDistrict() }, []);
  const getAllDistrict = async () => {
    Loading(true);
    let result = await GetDistrict();
    Loading(false);
    if (result && result.status) {
      setDistrictList(result.data)
    }
  }

  const loadRegistrationDetails = async () => {  
    Loading(true);   
    let data: any = localStorage.getItem("loginDetails");
    data = JSON.parse(data);
    if (data && data.token && (data.loginType == "USER" || data.loginType == "user")) {
      setLoginDetails(data);
      let location = localStorage.getItem("redirectFrom");
      if (location == "Registrations")
      {
        let regitsrtaionIDVal = localStorage.getItem("registrationId");
        let data2 = await GetUserByAppNo(regitsrtaionIDVal, LoginDetails.loginType);
        console.log(data2);
        if (data2 && data2.data) {
          let userData = data2.data;
          userData["registrationId"]=regitsrtaionIDVal;
          localStorage.setItem("Prieview", JSON.stringify(data2.data));
        }
      }
    
      if (location == "Registrations" || location == "ViewUserDetails" || location == "PreViewUserDetails") {
        let localData = JSON.parse(localStorage.getItem("Prieview"));
        if(localData.villageScretariatName)
        {
          localData.radio_office="VSWS";
          if(localData.casteType == "SAME CASTE")
            localData.paymentType = "PAY ONLINE";
        }
        else
          localData.radio_office="SRO";

          if(localData.husbandAadhar && localData.husbandAadhar.trim().length)
            setHusbandAadharDisabled(true);
          if(localData.wifeAadhar && localData.wifeAadhar.trim().length)
            setWifeAadharDisabled(true);

        // CallMandal(localData.district);
        // CallOffice(localData.mandal, localData.district);

        // setTimeout(() => {
        (async () => {
          localData.husbandDistrict && await getVillages({ 'target': { 'value': localData.husbandDistrict } }, 'district', 'husband', localData)

          localData.husbandMandal && await getVillages({ 'target': { 'value': localData.husbandMandal } }, 'mandal', 'husband', localData)

          localData.wifeDistrict && await getVillages({ 'target': { 'value': localData.wifeDistrict } }, 'district', 'wife', localData)

          localData.wifeMandal && await getVillages({ 'target': { 'value': localData.wifeMandal } }, 'mandal', 'wife', localData)

          localData.marriageDistrict && await getVillages({ 'target': { 'value': localData.marriageDistrict } }, 'district', 'marriage', localData)

          localData.marriageMandal && await getVillages({ 'target': { 'value': localData.marriageMandal } }, 'mandal', 'marriage', localData)
          setFlag(true);

          if (['husbandDistrict', 'husbandMandal', 'wifeDistrict', 'wifeMandal', 'marriageDistrict', 'marriageMandal'].filter(o => localData[o] ? true : false).length === 0) {
            setUserDetails({ ...localData })
          }
          // setTimeout(() => {
          //   setUserDetails({...localData, sroOffice: localData.sroOffice, district: localData.district})
          // }, 0)
        })()
        // }, 0)
        // }, 100);


      }
      else if (data.loginId) {
        CreateNewReg(data.loginId, data.loginType);
        setFlag(true)
        localStorage.setItem("redirectFrom", "")
      }

      // setUserDetails({ ...UserDetails, createdBy: LoginDetails.loginId }); // needs to verify 
    }
    else {
      handleLogOut()
    }
    Loading(false);   
  }

  useEffect(() => { loadRegistrationDetails() }, []);

  
  useEffect(() => { GetAllCaste() }, []);
  const GetAllCaste = async () => {
    Loading(true);
    let result = await GetCaste();
    Loading(false);
    if (result && result.status) {
      setCasteListForHusband(result.data);
      setCasteListForWife(result.data);
      setCasteList(result.data);
    }
  }

  useEffect(() => {
    setIsTirumalaSelected(UserDetails.isThirumala)
    const arr = [UserDetails.husbandVillageWard, UserDetails.wifeVillageWard, UserDetails.marriageVillageWard];
    const query = arr.filter((item,
      index) => arr.indexOf(item) === index).filter(a => !!a).join(',');
    
    console.log("Flag :::::::::::::::::::::::::");
    console.log(Flag);
    console.log("query :::::::::::::::::::::::::");
    console.log(query);
    if (Flag && query!=null && query.length>0) {   
      
      (async () => {
        //setOfficeList([]);
        //setVswsList([]);
  
        Loading(true);
        const rs = await getSroOfficesByVC(query);
        console.log("rs1 :::::::::::::::::::::::::::::::::::::: ");
        console.log(rs);
        
        if (rs && rs.status) {
          let vswsArray = [];
          let sroList = [];
          console.log("rs1 :::::::::::::::::::::::::::::::::::::: ");
          console.log(rs);
          if(rs.data)
          {
            if(rs.data.sroList)
              sroList = rs.data.sroList;
          
            if(rs.data.vswsList)
              vswsArray = rs.data.vswsList;
          }
          console.log("sroList response :::::::::::::::::::::::::::::::::::::: ");
          console.log(sroList);

          console.log("vswsList response :::::::::::::::::::::::::::::::::::::: ");
          console.log(vswsArray);
          setOfficeList(sroList.map(o => { return { 'label': o.sroOffice, 'sroNumber': o.sroNumber, 'district': o.sroDistrict } }));
          setVswsList(vswsArray.map(o => { return { 'label': o.villageScretariatName, 'villageScretariatCode': o.villageScretariatCode, 'sroNumber': o.sroNumber, 'sroOffice': o.srOffice , 'district': o.sroDistrict} }));
          
          console.log("OfficeList 123 :::::::::::::::::::::::::::::::::::::: ");
          console.log(OfficeList);

          console.log("VswsList :::::::::::::::::::::::::::::::::::::: ");
          console.log(VswsList);
        }
        Loading(false);
      })();
    }
  }, [UserDetails.husbandVillageWard, UserDetails.wifeVillageWard, UserDetails.marriageVillageWard, Flag])

  const CreateNewReg = async (loginId: any, loginType: any) => {
    Loading(true);
    let Prieview = localStorage.getItem("Prieview");
    console.log("Prieview 123:::: ");
    console.log(Prieview);
    if(Prieview!=undefined && Prieview!=null)
    {
      let data = JSON.parse(Prieview);
      let data2 = await GetUserByAppNo(data.registrationId, loginType)
      if (data2 && data2.data) {           
        if(data2.data.status==="DRAFT")
        {
          if(data2.data.villageScretariatName)
            data2.data.radio_office="VSWS";
          else
            data2.data.radio_office="SRO";
          data2["registrationId"] = data.registrationId;
          setUserDetails({...data2.data});
        } 
        else
        {
          console.log("data :::::::::::::::: ");
          console.log(data);
          setUserDetails({...data,documents:data2.data.documents});
        }          
        console.log(" UserDetails ::::: 123 ");
        console.log(UserDetails);
      }
      Loading(false);
    }
    else
    {
      let result = await CallCreateNewReg(loginId, loginType);
      if (result && result.status) {
        setUserDetails({ ...UserDetails, registrationId: result.data.registrationId, appNo: result.data.appNo });
      }
      Loading(false);
    }
  }

  const GetTransactionStatus = async (applicationNumber: any) => {
    Loading(true);
    let result = await GetPaymentStatus(applicationNumber);
    Loading(false);
    if (result && result.status) {
      setShowInputs(true);
      setPayData([{ ...result.data }]);
    } else {
      ShowAlert(false, result.message, "");
      setShowInputs(false);
    }
  }

  const getChallanDetails = async () => {
    if (!challanData.challanNumber?.trim()) {
      ShowAlert(false, "Please enter a challan number", "");
      return;
    }
    Loading(true);
    const encodedChallan = btoa(challanData.challanNumber.trim());
    let result = await GetChallanData(encodedChallan, UserDetails.appNo);
    Loading(false);
    if (result && result.status) {
      setShowInputs(true)
      setPayData([{
        ...result.data
      }]);
    } else {
      ShowAlert(false, result?.message, "");
      setPayData([]);
      setShowInputs(false)
    }
  }

  const handlePayModeChange = (e: any) => {
    const selected = e.target.value;
    setSelectedPaymentMode(selected);

    if (selected === "IGRS") {
      setChallanData({ challanNumber: '' });
      setPayData([]);
      setShowInputs(false);
    }

    if (selected === "CFMS") {
      setPayData([]);
      setChallanData({ challanNumber: '' });
      setShowInputs(false);
    }
  };



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
    date.setFullYear(date.getFullYear() - age);
    date.setDate(date.getDate() - 1);
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

  const handlePaymentLinkClick = () => {
    let paymentRedirectUrl = process.env.PAYMENT_GATEWAY_URL + "igrsPayment?paymentData=";
    let paymentLink = document.createElement("a");
    
    let sroOffice = UserDetails.sroOffice;
    let sroDistrict = UserDetails.district;
    let srNumber;

    let husbandMarriageAge = CalculateAge(UserDetails.husbandDateofBirth, UserDetails.marriageDate);
    let wifeMarriageAge = CalculateAge(UserDetails.wifeDateofBirth, UserDetails.marriageDate);
    if (husbandMarriageAge < 7671) { return ShowAlert(false, "Husband age must be 21 years old.", ""); }
    else if (wifeMarriageAge < 6575) { return ShowAlert(false, "Wife age must be 18 years old.", ""); }
    
    if(sroOffice=='TIRUMALA')
      srNumber = 7777;
    else
    {
      for (var i = 0; i < OfficeList.length; i++) {
        if (OfficeList[i].label == sroOffice && OfficeList[i].district == sroDistrict)
          srNumber = OfficeList[i].sroNumber;
      }
    }
    
    if (srNumber != undefined && srNumber != null) {
      let PaymentJSON = {
        "type": "hmr",
        "source": "HMR",
        "deptId": UserDetails.appNo,
        "rmName": LoginDetails.loginName,
        "sroNumber": srNumber,
        "rf": 500
      }

      let encodedData = Buffer.from(JSON.stringify(PaymentJSON), 'utf8').toString('base64')
      paymentLink.href = paymentRedirectUrl + encodedData;
      paymentLink.target = "_blank";
      paymentLink.click();
      setTimeout(function () { paymentLink.remove(); }, 1000);
    }
    else {
      ShowAlert(false, "SRO selection should be mandatory to proceed with payment process.", "");
    }
  };

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

  const transactionId = Array.isArray(payData)
    ? payData[0]?.deptTransID || payData[0]?.departmentTransactionId || ''
    : payData?.deptTransID || payData?.departmentTransactionId || '';

  const paidAmount = Array.isArray(payData)
    ? payData[0]?.amount || payData[0]?.totalAmount || 0
    : payData?.amount || payData?.totalAmount || 0;

  const OnSubmit = async (e: any) => {
    e.preventDefault();
    try {
      let errs = validate(UserDetails);
      if (Object.keys(errs).length === 0) {

        let month = new Date().getMonth();
        let day = new Date().getDate();
        let year = new Date().getFullYear();
        let currentDate = year + "-" + DoubleDigitMaker((month + 1).toString()) + "-" + DoubleDigitMaker(day.toString());
        let user = {
          ...UserDetails, regDate: currentDate,
          // sroOffice: UserDetails.sroOffice,
          sroOffice:UserDetails.marriageAddress_action == "TIRUMALA" ? "TIRUMALA" : UserDetails.sroOffice,  
          // district: UserDetails.district,
          district:UserDetails.marriageAddress_action == "TIRUMALA" ? "TIRUPATI" : UserDetails.district
        };
        if(UserDetails._id!=undefined)
          user["registrationId"]=UserDetails._id;

        let selectedSlotDate = UserDetails.slotDate;
        let dayName = new Date(selectedSlotDate).toLocaleString('en-us', {weekday:'long'});
        if(dayName && dayName.toUpperCase()==="SUNDAY")
        {
          return ShowAlert(false, "Slots are not available on Sunday.", "")
        }

        let husbandMarriageAge = CalculateAge(UserDetails.husbandDateofBirth, UserDetails.marriageDate);
        let wifeMarriageAge = CalculateAge(UserDetails.wifeDateofBirth, UserDetails.marriageDate);
        if (husbandMarriageAge < 7671) { return ShowAlert(false, "Husband age must be 21 years old.", ""); }
        else if (wifeMarriageAge < 6575) { return ShowAlert(false, "Wife age must be 18 years old.", ""); }
        else if (!user.sroOffice && UserDetails.radio_office === "SRO") {
          return ShowAlert(false, "SRO Office should be selected.", "")
        }
        else if (!user.villageScretariatName && UserDetails.radio_office === "VSWS") {
          return ShowAlert(false, "VSWS should be selected.", "")
        }
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
          let registrationId = user.registrationId
          for (let i in user) {
            if (typeof user[i] === 'string') {
              user[i] = user[i].toUpperCase();
            }
          }
          let action = localStorage.getItem("action");
          if(action == "proceed")
          {
            user = { ...user, registrationId, transactionId, paidAmount };
            localStorage.setItem("Prieview", JSON.stringify(user));
            localStorage.setItem("redirectFrom", "/Registrations");
            localStorage.setItem("isFromDashboard", "No");
            router.push("PreViewUserDetails");
          // await CallSaveUser(user);
          }else{
            await registrationDraftSave(user);
          }
        }
      }
      else {
        const arr = Object.keys(errs);
        ShowAlert(false, errs[arr[0]], "");
      }
    } catch (error) {
      ShowAlert(false, error, "");
    }

  };

  const registrationDraftSave = async (UserDetails: any) => {
    UserDetails = { ...UserDetails }
    Loading(true);
    let result: any = await registeredDraftSavedAPI(UserDetails);
    Loading(false);
    if (result.status) {
      let jsonData = result.data;
      setUserDetails({ ...UserDetails, appNo:jsonData.appNo  })
      setIsDraftSaved(true);
      //"HM"+UserDetails.sroNumber
      return ShowAlert(true, jsonData.statusMessage, "");
    }
    else {
      ShowAlert(false, result, "");
    }
  }

  const CallSaveUser = async (user: any) => {
    user = { ...user, sentMail: true, mailMessage: "Marriage Registration Application Number is " + user.appNo + " . Please carry all the documents uploaded for verification purpose. Thank you." }
    Loading(true);
    let result: any = await SaveUser(user, LoginDetails.loginType);
    Loading(false);
    if (result == "User data saved successfully.") {
      return ShowAlert(true, result + " Please be available with three witnesses on selected slot date. Thank You.", "/");
    }
    else {
      return ShowAlert(false, result, "");
    }
  }

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
      sroOffice?: string;
      villageScretariatName?: string;
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
        errorList.husbandAadhar = "Enter correct husband Aadhaar Number."; 

      if(!husbandAadhaarDisabled)
        errorList.husbandAadhar = "Please verify husband Aadhaar.";
        // if (values.husbandAadharOtp.length != 6) errorList.husbandAadharOtp = "Enter correct husband Aadhar OTP.";
    }

    if (UserDetails.radio_wifeCountry != "INDIA") {
      if (values.wifePassport.length < 6)
        errorList.wifePassport = "Enter valid wife Passport Number.";
      else if (values.wifeDOE <= values.slotDate) {
        errorList.wifeDOE = "Wife passport expiry date should not be less than and not equal to the slot date.";
      }
    } else {
      if (values.wifeAadhar.length != 12)
        errorList.wifeAadhar = "Enter correct wife Aadhaar Number.";
        
      if(!wifeAadhaarDisabled)
        errorList.wifeAadhar = "Please verify wife Aadhaar."; 
        // if (values.wifeAadharOtp.length != 6) errorList.wifeAadharOtp = "Enter correct wife Aadhar OTP.";
    }

    // if (values.husbandMobile != "") {
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
    if (values.casteType === 'DIFFERENT CASTE' && values.wifeOtherCaste && values.wifeOtherCaste.toLowerCase() === values.husbandOtherCaste.toLowerCase()) errorList.wifeOtherCaste = "Enter a different caste name"
    if ( !isTirumalaSelected && 
      values.marriageAddress_action !== "TIRUMALA" && (
      !values.husbandVillageWard && !values.wifeVillageWard && !values.marriageVillageWard
      )
    ) errorList.sroOffice = "Please choose Sub-Registrar Office"
    setFormErrors(errorList);
    return errorList;
  }

  const CountryHandleOther = (addName, addValue, user, radioKey, ActualKey, SecondKey) => {
    if (addName == radioKey) {
      if (addValue == "INDIA") {
        return { ...user, [ActualKey]: "INDIA", [SecondKey]: "" }
      }
      else {
        if (ActualKey === 'husbandCountry') {
          setHusbandAadharDisabled(false);
          sethideHOTP(false);
          setShowHOTP(false);
          setIsActive(false);
          setHusbandMandalList([]);
          setHusbandVillageList([]);
          return { ...user, [ActualKey]: "", [SecondKey]: "", husbandDistrict: "", husbandMandal: "", husbandVillageWard: "" }
        } else {
          setWifeAadharDisabled(false);
          sethideWOTP(false);
          setShowWOTP(false);
          setActive(false);
          setWifeMandalList([]);
          setWifeVillageList([]);
          return { ...user, [ActualKey]: "", [SecondKey]: "", wifeDistrict: "", wifeMandal: "", wifeVillageWard: "" }
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
        if (ActualKey === 'husbandState') {
          setHusbandMandalList([]);
          setHusbandVillageList([]);
          return { ...user, [ActualKey]: "", husbandDistrict: "", husbandMandal: "", husbandVillageWard: "" }
        } else {
          setWifeMandalList([]);
          setWifeVillageList([]);
          return { ...user, [ActualKey]: "", wifeDistrict: "", wifeMandal: "", wifeVillageWard: "" }
        }
      }

    }
    return user;
  }

  const getFilteredTimeSlots = () => {
    const currentMoment = moment();
    const selectedDate = moment(UserDetails.slotDate);
  
    if (selectedDate.isSame(currentMoment, 'day')) {
      // Filter only future slots if date is today
      const filteredSlots = FeaturesList.timeslotOptions.filter(slot => {
        const slotTime = moment(slot.label, "hh:mm A");
        return slotTime.isAfter(currentMoment);
      });
      if (filteredSlots.length === 0) {
        ShowAlert(false, "Slot times are not available today, please change the slot date.", "");
      }
      return filteredSlots;
    }
  
    return FeaturesList.timeslotOptions; // All slots for future days
  };
  

  const OfficeHandleOther = (addName, addValue, user, radioKey, ActualKey) => {
    if (addName == radioKey) {
      if (addValue == "SRO") {
        return { ...user, [ActualKey]: "SRO" }
      }
      else {
        if (ActualKey === 'radio_office') {
          return { ...user, [ActualKey]: "", sroOffice: "" }
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
    user = OfficeHandleOther(addName, addValue, user, "radio_SRO", "SRO");

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

    if (addName === 'slotDate') {
      const currentMoment = moment();
      const selectedDate = moment(addValue);
      const futureSlots = FeaturesList.timeslotOptions.filter(slot => {
        const slotTime = moment(slot.label, "hh:mm A");
        return slotTime.isAfter(currentMoment);
      });
    
      if (selectedDate.isSame(currentMoment, 'day') && futureSlots.length === 0) {
        const nextDay = moment().add(1, 'day').format("YYYY-MM-DD");
        user.slotDate = nextDay;
      }
    }

    if (addName == "husbandCaste") {
      if (UserDetails.casteType == "DIFFERENT CASTE") {
        let array = CasteList;
        array = array.filter(e => e === 'OTHERS' ? true : e !== addValue);
        setCasteListForWife(array);
      }
      if (addValue !== 'OTHERS') {
        user['husbandOtherCaste'] = ''
      }
    } else if (addName == "wifeCaste") {
      if (UserDetails.casteType == "DIFFERENT CASTE") {
        let array = CasteList;
        array = array.filter(e => e === 'OTHERS' ? true : e !== addValue);
        setCasteListForHusband(array);
      }
      if (addValue !== 'OTHERS') {
        user['wifeOtherCaste'] = ''
      }
    } else if (addName == "casteType") {
      if (addValue == "SAME CASTE") {
        setCasteListForHusband(CasteList);
      }
    } else if (addName == "husbandMobile" || addName == "wifeMobile") {
      addValue = addValue.slice(0, 10);
      addValue = addValue.replace(/[a-z]/gi, "");
    } else if (addName == "husbandAadhar" || addName == "wifeAadhar") {
      addValue = addValue.slice(0, 12);
    } else if (addName == "husbandAadharOtp" || addName == "wifeAadharOtp") {
      addValue = addValue.slice(0, 6);
    } else if (addName == "husbandPassport" || addName == "wifePassport") {
      addValue = addValue.slice(0, 9);
    }

    if (addName === "radio_isHusbandDivorcee") {
      if (addValue === 'YES') { user.isHusbandWidower = "NO"; user.isHusbandDivorcee = ""; }
      else if (addValue === "NO" && user.ishusbandDivorcee) { user.ishusbandDivorcee = "" }
    }
    else if (addName === "isHusbandWidower") {
      if (addValue === 'YES') { user.radio_isHusbandDivorcee = "NO"; user.isHusbandDivorcee = ""; }
    }
    else if (addName === "radio_isWifeDivorcee") {
      if (addValue === "NO" && user.radio_wifeDivorceDate) { user.isWifeDivorcee = ""; }
      else if (addValue === "YES") { user.isWifeWidow = "NO"; user.isWifeDivorcee = ""; }
    }
    else if (addName === "isWifeWidow") {
      if (addValue === 'YES') { user.radio_isWifeDivorcee = "NO"; user.iswifeDivorce = ""; }

    }

    if (addName == "husbandName" || addName == "wifeName_beforeMarriage" ||
      addName == "wifeName_afterMarriage" || addName == "wifeOtherCaste" ||
      addName == "husbandFatherName" || addName == "wifeFatherName" || addName == "husbandMotherName" || addName == "wifeMotherName" || addName == "husbandCountry" || addName == "husbandOtherCaste" || addName == "wifeCountry" || addName == "husbandState" || addName == "wifeState"
    ) {
      addValue = addValue.replace(/[^\w\s]/gi, "");
      addValue = addValue.replace(/[0-9]/gi, "");
      addValue = addValue.replace(/_/g, "");
    }
    if (e.target.name == 'change_wifeName_to_afterMarriage') {
      user = { ...user, wifeName_afterMarriage: "" }
    }

    if (e.target.name == "marriageAddress_action") {
      if (e.target.value !== 'ENTER LOCATION (IN ANDHRA PRADESH)') {
        user = { ...user, marriageDistrict: '', marriageMandal: "", marriageVillageWard: "" }
        if (marriageMandalList.length) {
          setMarriageMandalList([])
        }
        if (marriageVillageList.length) {
          setMarriageVillageList([])
        }
      }
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
      else if(e.target.value == "TIRUMALA"){
        addName = "marriageAddress";
        addValue = "TIRUMALA";
        user = {...user, isMarriageLocationDifferent: false}
      }
      else if (e.target.value == "ENTER LOCATION" || e.target.value == "ENTER LOCATION (IN ANDHRA PRADESH)") {
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

    if (e.target.name == "husbandCaste" && UserDetails.casteType == "SAME CASTE") {
      user.wifeCaste = e.target.value.toUpperCase();
    }

    if (e.target.name == 'casteType') {
      user.husbandCaste = '';
      user.wifeCaste = '';
      user.husbandOtherCaste = '';
      user.wifeOtherCaste = '';
    }

    if (e.target.name == 'husbandOtherCaste' && UserDetails.casteType == 'SAME CASTE') {
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
      user.wifeFatherName = "";
      user.wifeState = "";
      user.radio_wifeState = "ANDHRA PRADESH";
    }
    if(addName === 'radio_office'){
      UserDetails.sroOffice =  "";
      UserDetails.villageScretariatName = "";
      if(e.target.value=="VSWS" && UserDetails.casteType == "SAME CASTE")
        user.paymentType = "PAY ONLINE";
      else
        user.paymentType = "PAY AT SRO";
    }

    // addValue = addValue.toUpperCase();
    user = { ...user, [addName]: addValue }
    setUserDetails(user);
  }

  const OnFileSelect = async (event: any, docName: string, uploadName: string) => {
    console.log(UserDetails);
    if (event.target!=undefined && event.target.files!=undefined && event.target.files.length) {
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
        else {
          UserDetails[docName]="TRUE";
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
      await CallOffice(event.target.value, SelectedDistrict);
    }
    if (location == "sroOffice") {
      setUserDetails({ ...UserDetails, sroOffice: event.target.value })
    }
  }

  const getVillages = async (event: any, location: string, type: string, localData?: any) => {
    const UserDetails1 = localData ? { ...localData } : { ...UserDetails };
    if (location === "district") {
      if (type === 'husband') {
        setHusbandMandalList([]);
        setHusbandVillageList([]);
        setUserDetails({ ...UserDetails1, husbandDistrict: event.target.value, husbandMandal: '', husbandVillageWard: "" })
      } else if (type === 'wife') {
        setWifeMandalList([]);
        setWifeVillageList([]);
        setUserDetails({ ...UserDetails1, wifeDistrict: event.target.value, wifeMandal: '', wifeVillageWard: "" })
      } else {
        setMarriageMandalList([]);
        setMarriageVillageList([]);
        setUserDetails({ ...UserDetails1, marriageDistrict: event.target.value, marriageMandal: "", marriageVillageWard: "" })
      }
      if(event.target.value != ""){
      Loading(true)
      await getMandalList(event.target.value, type)
      Loading(false)
      }
    }
    if (location === 'mandal') {
      if (type === 'husband') {
        setHusbandVillageList([]);
        setUserDetails({ ...UserDetails1, husbandMandal: event.target.value, husbandVillageWard: "" })
      }
      else if (type === 'wife') {
        setWifeVillageList([]);
        setUserDetails({ ...UserDetails1, wifeMandal: event.target.value, wifeVillageWard: localData ? localData.wifeVillageWard : "" })
      } else {
        setMarriageVillageList([]);
        setUserDetails({ ...UserDetails1, marriageMandal: event.target.value, marriageVillageWard: localData ? localData.marriageVillageWard : "" })
      }
      if(event.target.value != ""){
      Loading(true);
      await getVillageList(event.target.value, type, localData);
      Loading(false);
      }
    }
    if (location === 'village') {
      setOfficeList([]);
      setVswsList([]);
      if (type === 'husband') {
        setUserDetails({ ...UserDetails1, husbandVillageWard: event.target.value, sroOffice: "", district: "", villageScretariatName:"", villageScretariatCode:"" })
      } else if (type === 'wife') {
        setUserDetails({ ...UserDetails1, wifeVillageWard: event.target.value, sroOffice: "", district: "", villageScretariatName:"", villageScretariatCode:"" })
      } else {
        setUserDetails({ ...UserDetails1, marriageVillageWard: event.target.value, sroOffice: "", district: "", villageScretariatName:"", villageScretariatCode:"" })
      }
    }
  }

  const getMandalList = async (value, type) => {
    let result = await GetMandal(value);
    if (result && result.status) {
      if (type === 'husband') {
        setHusbandMandalList(result.data)
      } else if (type === 'wife') {
        setWifeMandalList(result.data)
      } else {
        setMarriageMandalList(result.data)
      }
    }
  }

  const getVillageList = async (value, type, localData) => {
    let UserDetails1 = localData ? { ...localData } : { ...UserDetails }
    let result = await getVillageData((type === 'husband' ? UserDetails1.husbandDistrict : type === 'wife' ? UserDetails1.wifeDistrict : UserDetails1.marriageDistrict) + '&mandalName=' + value)
    if (result && result.status) {
      if (type === 'husband') {
        setHusbandVillageList(result.data)
      } else if (type === 'wife') {
        setWifeVillageList(result.data)
      } else {
        setMarriageVillageList(result.data)
      }
    }
  }

  function onchangeTirumalaSelection(e)
  {
    UserDetails.isThirumala = e.target.checked;
    setIsTirumalaSelected(e.target.checked);
    if(e.target.checked)
    {
      UserDetails.marriageAddress='TIRUMALA';
      UserDetails.sroOffice='TIRUMALA';
      UserDetails.district='TIRUPATI';
    }
    else
    {
      UserDetails.marriageAddress='';
      UserDetails.sroOffice='';
      UserDetails.district='';
    }
  }

  const CallMandal = async (value) => {
    setSelectedDistrict(value);
    setOfficeList([]);
    setVswsList([]);
    Loading(true);
    let result = await GetMandal(value);
    Loading(false);
    if (result.status) { setMandalList(result.data); }
  }

  const CallOffice = async (value, District) => {
    setSelectedMandal(value);
    Loading(true);
    let result = await GetOffice(District + '&mandal=' + value);
    Loading(false);
    if (result.status) { setOfficeList(result.data); }
  }

  const sendAadharRequestforHusbandAadhar = async (e: any) => {
    e.preventDefault();
    if (UserDetails.husbandAadhar === '') {
      ShowAlert(false, "Please enter Aadhaar number", "");
      setValidationError4('Please enter Aadhaar number');
    }
    else if (UserDetails.husbandAadhar === UserDetails.wifeAadhar ) {
      ShowAlert(false, "Aadhaar numbers cannot be same", "");
      setValidationError1('Aadhaar numbers cannot be same');
    } else {
    console.log('*** sending AadharRequest', UserDetails.husbandAadhar);
    Loading(true);
    const result = await getAadharOTP(UserDetails.husbandAadhar);
    getHusbandOtpTransactionNumber(result.transactionNumber)
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
    getWifeOtpTransactionNumber(result.transactionNumber)
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
      transactionNumber: husbandOtptransactionNumber,
      otp: (UserDetails.husbandAadharOtp)
    })
    Loading(false);
    if (result.status) {
      let userDet = { ...UserDetails };
      if(isTirumalaSelected){
        userDet.husbandAddress = ['house', 'lm','loc', 'street','vtc','dist','pc'].reduce((str, item) => { return str + (result.userInfo[item] ? (result.userInfo[item] + ', ') : '') }, '');
      }else{
      userDet.husbandAddress = ['house', 'lm', 'loc','street','vtc','pc'].reduce((str, item) => { return str + (result.userInfo[item] ? (result.userInfo[item] + ', ') : '') }, '');}
      [['name', 'husbandName'], ['state', 'husbandState'], ['dob', 'husbandDateofBirth'], ['country', 'husbandCountry'], ['co','husbandFatherName'], ['dist', 'husbandDistrict']].map((item) => {
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
      if(userDet.husbandState=="ANDHRA PRADESH" && !isTirumalaSelected){
        userDet.husbandDistrict && await getVillages({ 'target': { 'value': userDet.husbandDistrict } }, 'district', 'husband', userDet);
        userDet.radio_husbandState ="ANDHRA PRADESH";
      }else{
        if(userDet.husbandState!="ANDHRA PRADESH" ){
          userDet.husbandDistrict="";
          userDet.radio_husbandState ="OTHER";
          userDet.husbandState = ['state'].reduce((str, item) => { return str + (result.userInfo[item] ? (result.userInfo[item]) : '') }, '');
          userDet.husbandAddress = ['house', 'lm','loc', 'street','vtc','dist','pc'].reduce((str, item) => { return str + (result.userInfo[item] ? (result.userInfo[item] + ', ') : '') }, '');
        }
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
      transactionNumber: wifeOtptransactionNumber,
      otp: (UserDetails.wifeAadharOtp)
    })
    Loading(false);
    if (result.status) {
      let userDet = { ...UserDetails };
      if(isTirumalaSelected){
        userDet.wifeAddress = ['house', 'lm','loc', 'street','vtc','dist','pc'].reduce((str, item) => { return str + (result.userInfo[item] ? (result.userInfo[item] + ', ') : '') }, '');
      }else{
      userDet.wifeAddress = ['house', 'lm', 'loc','street','vtc','pc'].reduce((str, item) => { return str + (result.userInfo[item] ? (result.userInfo[item] + ', ') : '') }, '');}
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
      if(userDet.wifeState=="ANDHRA PRADESH" && !isTirumalaSelected){
        userDet.wifeDistrict && await getVillages({ 'target': { 'value': userDet.wifeDistrict } }, 'district', 'wife', userDet);
        userDet.radio_wifeState ="ANDHRA PRADESH";
      }else{
        if(userDet.wifeState!="ANDHRA PRADESH" ){
        userDet.wifeDistrict="";
        userDet.radio_wifeState ="OTHER";
        userDet.wifeState = ['state'].reduce((str, item) => { return str + (result.userInfo[item] ? (result.userInfo[item]) : '') }, '');
        userDet.wifeAddress = ['house', 'lm','loc', 'street','vtc','dist','pc'].reduce((str, item) => { return str + (result.userInfo[item] ? (result.userInfo[item] + ', ') : '') }, '');
        }
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
    <div style={{ marginBottom: '3rem' }}>
      <div className={styles.Navbar}>
        <text className={styles.NavbarText}> Welcome : {LoginDetails.loginName.toUpperCase()} </text>
        <text className={styles.NavbarText}> Last Login : {LoginDetails.lastLogin}</text>
        <div style={{ cursor: 'pointer' }} onClick={() => {
         handleLogOut()
        }} ><text className={styles.NavbarText}> Logout </text></div>
      </div>
      <form onSubmit={OnSubmit} className={styles.Container}>
        <div style={{ marginBottom: '5px' }}><span>
          <Image src="/hmr/images/LeftArrow.svg" height={16} width={14} onClick={() => {router.push(`/UserDashboard`);}} />
          <text className={styles.TitleText}>Hindu Marriage Act, 1955 (HMA) Registration</text>
        </span></div>

        <div style={{textAlign:'center', paddingTop:'1rem', paddingBottom:'1rem'}} >
            <text className={styles.tirumalLabel}>For Marriages solemnized in Tirumala, please select here</text>
            {UserDetails.isThirumala &&
                <input required={false} className={styles.checkBox} type="checkbox" checked name='isThirumala' onChange={onchangeTirumalaSelection}/>
            }
            {!UserDetails.isThirumala &&
                <input required={false} className={styles.checkBox} type="checkbox" name='isThirumala' onChange={onchangeTirumalaSelection}/>
            }
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
                      <button id="husbandverifyButton" className={styles.adhaarbtn} onClick={getHusbandAadharDetailsResponse}>Verify</button>
                    </Col>
                   </Row>
                   }
                   </div>
                  }
              </div>
            }
            {UserDetails.radio_husbandCountry != "INDIA" &&
              <div>
                <Row>
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
                    <TableSelectDate max={LimitYearTo(0)} placeholder='Select Date of Issue' required={true} name={'wifeDOI'} value={UserDetails.wifeDOI} onChange={onChange} />
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
            <TableText label='3. Date of Birth (As per SSC Certificate)' required={true} LeftSpace={false} />
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
            {
              !isTirumalaSelected && UserDetails.radio_husbandCountry == "INDIA" && UserDetails.radio_husbandState === 'ANDHRA PRADESH' && (
                <div className={styles.rightColumn}>
                  <div>
                    <text>Select District</text>
                    <TableDropdown required={true} options={DistrictList} name='husbandDistrict' value={UserDetails.husbandDistrict} sro={true} onChange={(e: any) => { getVillages(e, 'district', 'husband') }} />
                  </div>
                  <div>
                    <text>Select Mandal</text>
                    <TableDropdown required={true} options={husbandMandalList} name='husbandMandal' value={UserDetails.husbandMandal} sro={true} onChange={(e: any) => { getVillages(e, 'mandal', 'husband') }} />
                  </div>
                  <div>
                    <text>Select Village</text>
                    <TableDropdown required={true} options={husbandVillageList} name='husbandVillageWard' value={UserDetails.husbandVillageWard} sro={true} customized={{ 'label': 'villageName', 'value': 'revVillageCode' }} onChange={(e: any) => { getVillages(e, 'village', 'husband') }} />
                  </div>
                </div>
              )
            }
          </div>
          <div className={styles.singleColumn}>
            <div style={{ marginBottom: '5px' }}>
              {UserDetails.radio_wifeCountry == "INDIA" && <TableInputRadio label='' required={true} name='radio_wifeState' defaultValue={UserDetails.radio_wifeState} onChange={onChange} options={FeaturesList.state} />}
            </div>
            {UserDetails.radio_wifeCountry == "INDIA" && UserDetails.radio_wifeState != "ANDHRA PRADESH" && <TableInputText type='text' placeholder='Enter State Name' required={true} name='wifeState' value={UserDetails.wifeState} onChange={onChange} />}
            {
              !isTirumalaSelected && UserDetails.radio_wifeCountry == "INDIA" && UserDetails.radio_wifeState === 'ANDHRA PRADESH' && (
                <div className={styles.rightColumn}>
                  <div>
                    <text>Select District</text>
                    <TableDropdown required={true} options={DistrictList} name='wifeDistrict' value={UserDetails.wifeDistrict} sro={true} onChange={(e: any) => { getVillages(e, 'district', 'wife') }} />
                  </div>
                  <div>
                    <text>Select Mandal</text>
                    <TableDropdown required={true} options={wifeMandalList} name='wifeMandal' value={UserDetails.wifeMandal} sro={true} onChange={(e: any) => { getVillages(e, 'mandal', 'wife') }} />
                  </div>
                  <div>
                    <text>Select Village</text>
                    <TableDropdown required={true} options={wifeVillageList} name='wifeVillageWard' value={UserDetails.wifeVillageWard} sro={true} customized={{ 'label': 'villageName', 'value': 'revVillageCode' }} onChange={(e: any) => { getVillages(e, 'village', 'wife') }} />
                  </div>
                </div>
              )
            }
          </div>
        </div>

         {/* permanentplace */}
         <div className={styles.tableContainer}>
          <div className={styles.singleColumn}>
            <TableText label='5. Residence Address' required={true} LeftSpace={false} />
            <TableText label='(Village, Street  Should be Separated by a comma(","))' required={false} LeftSpace={false} />
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
            {UserDetails.casteType == "SAME CASTE" || UserDetails.casteType == "DIFFERENT CASTE"?
            <TableDropdown required={true} options={CasteListForHusband} name='husbandCaste' value={UserDetails.husbandCaste} sro={true} onChange={onChange} />
            :null}
            {/* <TableInputText name={'husbandCaste'} type='text' placeholder='Caste Name' required={true} value={UserDetails.husbandCaste} onChange={onChange} /> */}
            {UserDetails.husbandCaste == "OTHER MUSLIMS GROUPS" && <text className={styles.warningText}>EXCLUDING SYED, SAIYED, SAYYAD, MUSHAIK, MUGHAL, MOGHAL, PATHANS, IRANI, ARAB, BOHARA, BOHRA, SHIA IMAMI ISMAILI, KHOJA, CUTCHI - MEMON, JAMAYAT, NAVAYAT</text>}
            {UserDetails.husbandCaste === "OTHERS" && <TableInputText type="text" placeholder='Enter Caste Name' required={true} value={UserDetails.husbandOtherCaste} name="husbandOtherCaste" onChange={onChange} />}
          </div>
          <div className={styles.singleColumn}>
            {UserDetails.casteType == "SAME CASTE" ?
              <TableText label={UserDetails.wifeCaste === 'OTHERS' ? UserDetails.wifeOtherCaste : UserDetails.wifeCaste} required={false} LeftSpace={false} textTransform={'uppercase'} />
              :
              <div>{UserDetails.casteType == "DIFFERENT CASTE"?
              <TableDropdown required={true} options={CasteListForWife} name='wifeCaste' value={UserDetails.wifeCaste} sro={true} onChange={onChange} />
              :null
              }</div>
            }
            {UserDetails.wifeCaste == "OTHER MUSLIMS GROUPS" && <text className={styles.warningText}>EXCLUDING SYED, SAIYED, SAYYAD, MUSHAIK, MUGHAL, MOGHAL, PATHANS, IRANI, ARAB, BOHARA, BOHRA, SHIA IMAMI ISMAILI, KHOJA, CUTCHI - MEMON, JAMAYAT, NAVAYAT</text>}
            {UserDetails.wifeCaste === "OTHERS" && UserDetails.casteType != "SAME CASTE" && <><TableInputText type="text" placeholder='Enter Caste Name' required={true} value={UserDetails.wifeOtherCaste} name="wifeOtherCaste" onChange={onChange} /><text className={styles.warningText}>{FormErrors.wifeOtherCaste}</text></>}
          </div>
        </div>

        {/* Mobile */}
        <div className={styles.tableContainer}>
          <div className={styles.singleColumn}>
            <TableText label='12. Mobile' required={true} LeftSpace={false} />
          </div>
          <div className={styles.singleColumn}>
            <TableInputText type='number' placeholder='10 Digit Mobile Number' required={true} name='husbandMobile' value={UserDetails.husbandMobile} onChange={onChange} />
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
            <TableText label={"14. Whether Wife or Husband is a Widow/Widower?"} required={true} LeftSpace={false} />
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
            <TableText label='(Village, Street  Should be Separated by a comma (","))' required={false} LeftSpace={false} />
          </div>
          { isTirumalaSelected ?
            <div className={styles.rightColumn}>
            <TableInputLongText placeholder='Enter Complete Address' value="TIRUMALA" required={true} name='marriageAddress' onChange={()=>{}} disabled={true}/>
          </div>:
            <div className={styles.rightColumn}>
              <TableDropdown required={true} options={FeaturesList.marriageLocationOptions} name={"marriageAddress_action"} value={UserDetails.marriageAddress_action} onChange={onChange} />
              {
                UserDetails.marriageAddress_action === 'ENTER LOCATION (IN ANDHRA PRADESH)' && (
                  <div className={styles.marriageDropDown}>
                    <div>
                      <text>Select District</text>
                      <TableDropdown required={true} options={DistrictList} name='marriageDistrict' value={UserDetails.marriageDistrict} sro={true} onChange={(e: any) => { getVillages(e, 'district', 'marriage') }} />
                    </div>
                    <div>
                      <text>Select Mandal</text>
                      <TableDropdown required={true} options={marriageMandalList} name='marriageMandal' value={UserDetails.marriageMandal} sro={true} onChange={(e: any) => { getVillages(e, 'mandal', 'marriage') }} />
                    </div>
                    <div>
                      <text>Select Village</text>
                      <TableDropdown required={true} options={marriageVillageList} name='marriageVillageWard' value={UserDetails.marriageVillageWard} sro={true} customized={{ 'label': 'villageName', 'value': 'revVillageCode' }} onChange={(e: any) => { getVillages(e, 'village', 'marriage') }} />
                    </div>
                  </div>
                )
              }
              {UserDetails.isMarriageLocationDifferent && <TableInputLongText placeholder='Enter Complete Address' required={true} name='marriageAddress' value={UserDetails.marriageAddress} onChange={onChange} />}
            </div>
          }
        </div>

        {/* office */}
        <div className={styles.marriageContainer}>
          <div className={styles.leftColumn}>
            <TableText label='17. Choose Sub-Registrar Office' required={true} LeftSpace={false} />
          </div>

          <div className={styles.singleColumn}>
            {/* {!isTirumalaSelected && (UserDetails.husbandVillageWard || UserDetails.wifeVillageWard || UserDetails.marriageVillageWard) &&
              <div style={{ marginBottom: '5px' }}>
                <TableInputRadio label='' required={true} name='radio_office' defaultValue={UserDetails.radio_office} onChange={onChange} options={FeaturesList.office} />
              </div>} */}
            {UserDetails.radio_office === "SRO" &&
              // <div>
              //   <Row>
              //       <TableInputText name='husbandAadhar' disabled={husbandAadhaarDisabled} type='number' placeholder='Enter Aadhaar Number' required={true} value={UserDetails.husbandAadhar} onChange={onChange} />
              //   </Row>
              // </div>
              <div>
                {/* <div>
              <text>Select District</text>
              <TableDropdown required={true} options={DistrictList} name='district' value={UserDetails.district} sro={true} onChange={(e: any) => ForSROSelect(e, "district")} />
            </div>
            <div>
              <text>Select Mandal</text>
              <TableDropdown required={true} options={MandalList} name='mandal' value={UserDetails.mandal} sro={true} onChange={(e: any) => ForSROSelect(e, "mandal")} />
            </div> */}
                {
                  isTirumalaSelected ?
                    <div className={styles.rightColumn}>
                      <TableInputText value="TIRUMALA" name="sroOffice" type='text' required={false} placeholder="" onChange={() => { }} disabled={true} />
                    </div> :
                    UserDetails.marriageAddress_action === "TIRUMALA" ?
                      <TableInputText value="TIRUMALA" name="sroOffice" type='text' required={false} placeholder="" onChange={() => { }} disabled={true} />
                      :
                      UserDetails.husbandVillageWard || UserDetails.wifeVillageWard || UserDetails.marriageVillageWard ? (
                        <div>
                          <text>Select SRO</text>
                          <TableDropdown required={true} options={OfficeList} name='sroOffice' value={UserDetails.sroOffice} onChange={(e) => {
                            setUserDetails({ ...UserDetails, sroOffice: e.target.value, district: e.target.value ? OfficeList.filter(i => i.label === e.target.value)[0].district : '' })
                          }} />
                        </div>
                      )
                        :
                        <div className={styles.MarriageConditions}>Any one of these conditions should be met:
                          <span>(a) Husband from Andhra Pradesh</span>
                          <span>(b) Wife from Andhra Pradesh</span>
                          <span>(c) Place of Marriage in Andhra Pradesh</span>
                        </div>
                }
              </div>
            }
            {UserDetails.radio_office != "SRO" &&
              <div>
                {
                  isTirumalaSelected ?
                    <div className={styles.rightColumn}>
                      <TableInputText value="TIRUMALA" name="villageScretariatName" type='text' required={false} placeholder="" onChange={() => { }} disabled={true} />
                    </div> :
                    UserDetails.marriageAddress_action === "TIRUMALA" ?
                      <TableInputText value="TIRUMALA" name="villageScretariatName" type='text' required={false} placeholder="" onChange={() => { }} disabled={true} />
                      :
                      UserDetails.husbandVillageWard || UserDetails.wifeVillageWard || UserDetails.marriageVillageWard ? (
                        <div>
                          <text>Select VSWS</text>
                          <TableDropdown required={true} options={VswsList} name='villageScretariatName' value={UserDetails.villageScretariatName} onChange={(e) => {
                            setUserDetails({ ...UserDetails, villageScretariatName: e.target.value, sroOffice: e.target.value ? VswsList.filter(i => i.label === e.target.value)[0].sroOffice : '', district: e.target.value ? VswsList.filter(i => i.label === e.target.value)[0].district : '', villageScretariatCode: e.target.value ? VswsList.filter(i => i.label === e.target.value)[0].villageScretariatCode : '' })
                          }} />
                        </div> 
                      )
                      :
                        <div className={styles.MarriageConditions}>Any one of these conditions should be met:
                          <span>(a) Husband from Andhra Pradesh</span>
                          <span>(b) Wife from Andhra Pradesh</span>
                          <span>(c) Place of Marriage in Andhra Pradesh</span>
                        </div>
                }
              </div>
            }
          </div>
        </div>

        {/* certificatecopies */}
        <div className={styles.marriageContainer}>
          <div className={styles.leftColumn}>
            <TableText label="19. Number of Certificate Copies" required={true} LeftSpace={false} />
          </div>
          <div className={styles.rightColumn}>
            <TableInputRadio label='' required={true} name='certificateCopies' defaultValue={UserDetails.certificateCopies} options={FeaturesList.coppies} onChange={onChange} />
            {/* <TableInputText type='number' placeholder='' required={true} name={'certificateCopies'} value={UserDetails.certificateCopies} onChange={onChange} /> */}
          </div>
        </div>

        {/* timeslot */}
        <div className={styles.tableContainer}>
          <div className={styles.singleColumn}>
            <TableText label=' 19. Slot Booking for Registration' required={true} LeftSpace={false} />
          </div>
          <div className={styles.singleColumn}>
            <TableSelectDate min={moment().format("YYYY-MM-DD")} max={(moment(moment().toDate()).add(3, 'M')).format("YYYY-MM-DD")} placeholder='Select Slot Date' required={true} name={'slotDate'} value={UserDetails.slotDate} onChange={onChange} />
            {/* <TableSelectDate min={(moment(moment().toDate()).add(1, 'd')).format("YYYY-MM-DD")} max={(moment(moment().toDate()).add(3, 'M')).format("YYYY-MM-DD")} placeholder='Select Slot Date' required={true} name={'slotDate'} value={UserDetails.slotDate} onChange={onChange} /> */}
          </div>
          <div className={styles.singleColumn}>
            <TableDropdown required={true} options={getFilteredTimeSlots()} name={'slotTime'} value={UserDetails.slotTime} onChange={onChange} />
            {/* <TableDropdown required={true} options={FeaturesList.timeslotOptions} name={'slotTime'} value={UserDetails.slotTime} onChange={onChange} /> */}
          </div>
        </div>

        {/* Fine uploads */}
        <div style={{ backgroundColor: '#F6F6F6', padding: '1em' }}>
          <text className={styles.UploadText} style={{ fontWeight: 'bold' }}>Document List </text>
          <div className={styles.UploadText} style={{ color: 'red' }} >*Note: Please upload the document in JPG/JPEG/PNG formats only and the size should not exceed 1MB. A single image is allowed in each section.</div>
        </div>
        <div>
          <UploadContainer onCancelUpload={onCancelUpload} isUploadDone={UserDetails.doc_weddingCard_upload} label='Wedding Card' required={false} uploadKey={'doc_weddingCard_upload'} onChange={(e: any) => { OnFileSelect(e, 'doc_weddingCard', 'doc_weddingCard_upload') }} showOnlyImage={true} />
          <UploadContainer onCancelUpload={onCancelUpload} isUploadDone={UserDetails.doc_husbandBirthProof_upload} label="Birth Certificate/SSC Marks Memo/Passport/Notary Affidavit (Husband)" uploadKey={'doc_husbandBirthProof_upload'} required={true} onChange={(e: any) => { OnFileSelect(e, 'doc_husbandBirthProof', 'doc_husbandBirthProof_upload') }} showOnlyImage={true} />
          <UploadContainer onCancelUpload={onCancelUpload} isUploadDone={UserDetails.doc_wifeBirthProof_upload} label="Birth Certificate/SSC Marks Memo/Passport/Notary Affidavit (Wife)" required={true} uploadKey={'doc_wifeBirthProof_upload'} onChange={(e: any) => { OnFileSelect(e, 'doc_wifeBirthProof', 'doc_wifeBirthProof_upload') }} showOnlyImage={true} />
          <UploadContainer onCancelUpload={onCancelUpload} isUploadDone={UserDetails.doc_marriagePhoto_upload} label='Marriage Photo (Upload a photo with in wedding attire)' required={false} uploadKey={'doc_marriagePhoto_upload'} onChange={(e: any) => { OnFileSelect(e, 'doc_marriagePhoto', 'doc_marriagePhoto_upload') }} showOnlyImage={true} />
          <UploadContainer onCancelUpload={onCancelUpload} isUploadDone={UserDetails.doc_husbandPhoto_upload} label='Husband Photo' required={true} uploadKey={'doc_husbandPhoto_upload'} onChange={(e: any) => { OnFileSelect(e, 'doc_husbandPhoto', 'doc_husbandPhoto_upload') }} showOnlyImage={true} />
          <UploadContainer onCancelUpload={onCancelUpload} isUploadDone={UserDetails.doc_wifePhoto_upload} label='Wife Photo' required={true} uploadKey={'doc_wifePhoto_upload'} onChange={(e: any) => { OnFileSelect(e, 'doc_wifePhoto', 'doc_wifePhoto_upload') }} showOnlyImage={true} />
          <UploadContainer onCancelUpload={onCancelUpload} isUploadDone={UserDetails.doc_husbandResidenceProof_upload} label="Residence Proof (Husband)" required={true} uploadKey={'doc_husbandResidenceProof_upload'} onChange={(e: any) => { OnFileSelect(e, 'doc_husbandResidenceProof', 'doc_husbandResidenceProof_upload') }} showOnlyImage={true} />
          <UploadContainer onCancelUpload={onCancelUpload} isUploadDone={UserDetails.doc_wifeResidenceProof_upload} label="Residence Proof (Wife)" required={true} uploadKey={'doc_wifeResidenceProof_upload'} onChange={(e: any) => { OnFileSelect(e, 'doc_wifeResidenceProof', 'doc_wifeResidenceProof_upload') }} showOnlyImage={true} />
          <UploadContainer onCancelUpload={onCancelUpload} isUploadDone={UserDetails.doc_marriageRecept_upload} label="Marriage Function Hall Receipt (Optional)" required={false} uploadKey={'doc_marriageRecept_upload'} onChange={(e: any) => { OnFileSelect(e, 'doc_marriageRecept', 'doc_marriageRecept_upload') }} showOnlyImage={true} />
          {
            UserDetails.radio_isHusbandDivorcee == "YES" &&
            <UploadContainer onCancelUpload={onCancelUpload} isUploadDone={UserDetails.doc_isHusbandDivorcee_upload} label='Divorcee Proof/Decree of Court (Husband)' required={true} uploadKey='doc_isHusbandDivorcee_upload' onChange={(e: any) => { OnFileSelect(e, 'doc_isHusbandDivorcee', 'doc_isHusbandDivorcee_upload') }} showOnlyImage={true} />
          }
          {
            UserDetails.isHusbandWidower == "YES" &&
            <UploadContainer onCancelUpload={onCancelUpload} isUploadDone={UserDetails.doc_isHusbandWidower_upload} label='Proof of Death (Deceased Wife)' required={true} uploadKey='doc_isHusbandWidower_upload' onChange={(e: any) => { OnFileSelect(e, 'doc_isHusbandWidower', 'doc_isHusbandWidower_upload') }} showOnlyImage={true} />
          }
          {
            UserDetails.radio_isWifeDivorcee == "YES" &&
            <UploadContainer onCancelUpload={onCancelUpload} isUploadDone={UserDetails.doc_isWifeDivorcee_upload} label='Divorcee Proof/Decree of Court (Wife)' required={true} uploadKey='doc_isWifeDivorcee_upload' onChange={(e: any) => { OnFileSelect(e, 'doc_isWifeDivorcee', 'doc_isWifeDivorcee_upload') }} showOnlyImage={true} />
          }
          {
            UserDetails.isWifeWidow == "YES" &&
            <UploadContainer onCancelUpload={onCancelUpload} isUploadDone={UserDetails.doc_isWifeWidow_upload} label='Proof of Death (Deceased Husband)' required={true} uploadKey='doc_isWifeWidow_upload' onChange={(e: any) => { OnFileSelect(e, 'doc_isWifeWidow', 'doc_isWifeWidow_upload') }} showOnlyImage={true} />
          }
        </div>
        <div className={styles.draftContainer}>
          <button className={styles.draftButtton} onClick={()=>{localStorage.setItem("action","draftSave")}}>SAVE AS DRAFT</button>
        </div>
        {isDraftSaved && (       
        <div style={{ backgroundColor: '#F6F6F6', padding: '1em' }}>
          <text className={`${styles.UploadText} mt-2}`}>Amount Payable : </text>
          <text className={styles.UploadText} style={{ color: 'red', fontWeight: 'bold', justifyContent: "center" }} >{UserDetails.casteType == "SAME CASTE" ? " Rs 500/-" : "Rs 0"}</text>
          {UserDetails.casteType == "SAME CASTE" ?
            <div>
              <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
                <TableText label='Payment Mode :' required={false} LeftSpace={false} />
                {UserDetails.radio_office != "SRO" && !isTirumalaSelected ?
                  <TableInputRadio label='' required={true} name="paymentType" defaultValue={UserDetails.paymentType} options={FeaturesList.vswsPaymentOptions} onChange={onChange} />
                  : <TableInputRadio label='' required={true} name="paymentType" defaultValue={UserDetails.paymentType} options={FeaturesList.paymentOptions} onChange={onChange} />
                }
              </div>
              {UserDetails.paymentType === "PAY ONLINE" ? (
                <div>
                  <div className='mt-2'>
                    <text className={styles.UploadText} style={{ color: 'red' }} >
                      <h6>Note :
                        <ul>
                          <li>Please make the payment using the <strong>IGRS</strong> option by clicking on the Payment Link, and then click on Verify Payment Status to proceed.</li>
                          <li>If you have already made the payment, select the <strong>CFMS</strong> option to verify the challan details.</li>
                        </ul>
                      </h6>
                    </text>
                  </div>
                  <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                    <TableText label='Select Payment Method :' required={false} LeftSpace={false} />
                    <TableInputRadio label="" required={true} name="payType" defaultValue={selectedPaymentMode} options={payModeOptions} onChange={handlePayModeChange} />
                  </div>
                  {selectedPaymentMode === "IGRS" && (
                    <div>
                      <div>
                        <text className={styles.UploadText} style={{ fontWeight: 'bold' }}>Payment Guidelines: </text>
                        <a href='https://drive.google.com/file/d/1tUGzbUDrErXABENRBSQXlzrYgTj0v10D/view?usp=sharing' target="_blank" rel="noreferrer" className={styles.UploadText} >View Payment Instructions</a>
                      </div>
                      <text className={styles.UploadText} style={{ fontWeight: 'bold' }}>Payment Link : </text>
                      <a href='javascript:void(0)' onClick={() => handlePaymentLinkClick()} rel="noreferrer" className={styles.UploadText} >Click here to Pay</a>
                      <div>
                        <text className={styles.UploadText} style={{ fontWeight: 'bold' }}>Verify Payment Status: </text>
                        <a href='javascript:void(0)' onClick={(e) => { GetTransactionStatus(UserDetails.appNo) }} rel="noreferrer" className={styles.UploadText}  >Click Here to Verify</a>
                      </div>
                    </div>
                  )}
                  {selectedPaymentMode === "CFMS" && (
                    <div>
                      <div className={`${styles.challanCon} mt-3`}>
                        <Row className={styles.challanInfo}>
                          <Col lg={8} md={6} xs={12}>
                            <Row>
                              <div className={styles.formInfo}>
                                <Col lg={3} md={5} xs={12}><TableText label="Challan Number :" required={false} LeftSpace={false} /></Col>
                                <Col lg={6} md={5} xs={12}><TableInputText type='number' placeholder='Enter challan number' required={true} name={'challan'} value={challanData.challanNumber}  onChange={(e) => {const value = e.target.value; if (value.length <= 14) {setChallanData({ ...challanData, challanNumber: value })}}} /></Col>
                                <Col lg={3} md={5} xs={12}><div onClick={(e) => { getChallanDetails() }} className={styles.challanBtn}>Get Challan Details</div></Col>
                              </div>
                            </Row>
                          </Col>
                          <Col lg={4} md={6} xs={12}></Col>
                        </Row>
                      </div>
                    </div>
                  )}
                  {showInputs && payData.length > 0 && (
                    <div>
                      <div className={styles.challanCon}>
                        <Row className={styles.challanInfo}>
                          <Col lg={8} md={6} xs={12}>
                            <Row className='mt-3'>
                              <div className={styles.formInfo}>
                                <Col lg={3} md={5} xs={12}><TableText label="Dept. Transaction ID" required={false} LeftSpace={false} /></Col>
                                <Col lg={6} md={5} xs={12}><TableInputText disabled={true} type='text' placeholder="" required={true} name={'deptTransID'} value={transactionId} onChange={() => { }} /></Col>
                                <Col lg={3} md={5} xs={12}></Col>
                              </div>
                            </Row>
                            <Row className='mt-3'>
                              <div className={styles.formInfo}>
                                <Col lg={3} md={5} xs={12}><TableText label="Amount Paid" required={false} LeftSpace={false} /></Col>
                                <Col lg={6} md={5} xs={12}><TableInputText disabled={true} type='number' placeholder="" required={true} name={'amount'} value={paidAmount} onChange={() => { }} /></Col>
                                <Col lg={3} md={5} xs={12}></Col>
                              </div>
                            </Row>
                          </Col>
                          <Col lg={4} md={6} xs={12}></Col>
                        </Row>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <text className={styles.UploadText} style={{ color: "red" }}>The Applicant is allowed to pay at SRO at the time of verification.</text>
                </div>
              )}

            </div>
            :
            <div>
              <text className={styles.UploadText} style={{ color: 'red' }} > Note: No fee payable for Inter-Caste Marriages as per G.O.- Ms.-No:1175, Home, General A, Department dated 05-10-1976.</text>
            </div>
          }
        </div>
        )}
        {isDraftSaved && ((UserDetails.paymentType == "PAY ONLINE" && showInputs) || UserDetails.casteType != "SAME CASTE") ?
          <div className={styles.paymentContainer}>
           <button className={styles.paymentButtton} onClick={()=>{localStorage.setItem("action","proceed")}}>PROCEED</button>
          </div> : null
        }
      </form>

      {/* <pre>{JSON.stringify(UserDetails, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(LoginDetails, null, 2)}</pre> */}
    </div>
  )
}

export default Registrations;
