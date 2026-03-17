import React, { useState, useEffect } from 'react';
import TableInputLongText from '../src/components/TableInputLongText';
import TableInputText from '../src/components/TableInputText';
import TableText from '../src/components/TableText';
import SelectUploadContainer from '../src/components/SelectUploadContainer';
import UploadContainer from '../src/components/UploadContainer';
import styles from '../styles/pages/Registrations.module.scss';
import { useRouter } from 'next/router'
import { SaveUser, UploadDoc, removeUploadDoc, GetUserByAppNo,CallTokenInvalidate } from '../src/axios';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import { LoadingAction, PopupAction } from '../src/redux/commonSlice';
import TableInputRadio from '../src/components/TableInputRadio';
import TableSelectDate from '../src/components/TableSelectDate';
import moment from 'moment';
import { handleLogOut } from '../utils';
moment.defaultFormat = "DD-MM-YYYY";

const FeaturesList = {
  Boolean: [{ value: "YES", label: "YES" }, { value: "NO", label: "NO" }],
  country: [{ value: "INDIA", label: "INDIA" }, { value: "OTHER", label: "OTHER" }],
  state: [{ value: "ANDHRA PRADESH", label: "ANDHRA PRADESH" }, { value: "OTHER", label: 'OTHER' }],
  relationship: [{ value: "PARENTS", label: "PARENTS" }, { value: "GUARDIAN", label: "GUARDIAN" }],
  coppies: [{ value: 1, label: 1 }, { value: 2, label: 2 }, { value: 3, label: 3 }, { value: 4, label: 4 }, { value: 5, label: 5 }],
}


const OfficerUserUpdate = () => {
  const dispatch = useAppDispatch();
  let initialLoginDetails = useAppSelector((state) => state.login.loginDetails);
  const [LoginDetails, setLoginDetails] = useState(initialLoginDetails);
  const router = useRouter()
  const [UserDetails, setUserDetails] = useState<any>([]);
  const [FormErrors, setFormErrors] = useState<any>({});

  const ShowAlert = (type, message,redirect) => { dispatch(PopupAction({ enable: true, type: type, message: message,redirect:redirect })); }
  const Loading = (value: boolean) => {dispatch(LoadingAction({enable:value}));}

    useEffect(() => {
    let data: any = localStorage.getItem("loginDetails");
    data = JSON.parse(data);
    if (data && data.token && (data.loginType == "OFFICER" || data.loginType == "officer") && data.role && (data.role === "SRO" || LoginDetails.role === "VR")) {
        GetUserDetails(localStorage.getItem("registrationId")); 
        setLoginDetails(data)
    }
    else {
      handleLogOut()
    }
  }, [])

  const GetUserDetails = async (appNo: any) => {
    Loading(true);
    let data = await GetUserByAppNo(appNo, LoginDetails.loginType);
    Loading(false);
    
    if (data) { 
      let user = data.data;
    if (user.loginEmail) { delete user.loginEmail; }
    if (user.loginPassword) { delete user.loginPassword; }
    if (user.loginRPassword) { delete user.loginRPassword; }
      user.husbandCaste = user.husbandOtherCaste ? user.husbandOtherCaste : user.husbandCaste;
      user.wifeCaste = user.wifeOtherCaste ? user.wifeOtherCaste : user.wifeCaste;
      user.husbandOtherCaste = '';
      user.wifeOtherCaste = '';
      setUserDetails(user); }
  }


  const TableTitle = (label: String) => {
    return (
      <div className={styles.singleTitleColumn}>
        <text className={styles.columnTitleText}>{label}</text>
      </div>
    );
  }

  const ShiftToLocation = (location: string) => {
    router.push({
      pathname: location,
    })
  }

  const OnSubmit = async (e: any) => {
    try {
      e.preventDefault();
      let error = validate(UserDetails)
      setFormErrors(error);
      if (Object.keys(error).length === 0) {

        let user = { ...UserDetails, registrationId: UserDetails._id }
        let husbandMarriageAge = CalculateAge(UserDetails.husbandDateofBirth, UserDetails.marriageDate);
        let wifeMarriageAge = CalculateAge(UserDetails.wifeDateofBirth, UserDetails.marriageDate);
        if (husbandMarriageAge < 7671) { return ShowAlert(false, "Husband age must be 21 years old.", ""); }
        else if (wifeMarriageAge < 6575) { return ShowAlert(false, "Wife age must be 18 years old.", ""); }
        else {
          let husbandAgeInYears = Math.floor(husbandMarriageAge / 365)
          let wifeAgeInYears = Math.floor(wifeMarriageAge / 365)
          user = { ...user, husbandMarriageAge: husbandAgeInYears, wifeMarriageAge: wifeAgeInYears };
        }
        
        for (let i in user) {
          if (typeof user[i] === 'string') {
            user[i] = user[i].toUpperCase();
          }
        }
        await CallSaveUser(user);
      }
      else {
        ShowAlert(false, "Kindly check incorrect fields.","");
      }
    } catch (error) {
      ShowAlert(false, error,"");
    }
  };

  const CalculateAge = (birthDate: any, marriageDate: any) => {
    const date1: any = new Date(birthDate);
    const date2: any = new Date(marriageDate);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  const CallSaveUser = async (user: any) => {
    Loading(true);
    let success = await SaveUser(user, LoginDetails.loginType);
    Loading(false);
    if (success === 'User data saved successfully.') {
       return ShowAlert(true, success,"/ViewUserDetails");
    }
    else{
      return ShowAlert(false, success,"");
    }
  }

  const validate = (values: any) => {
    type errorsType = {
      wifeMobile?: string;
      husbandMobile?: string;
      wifeName_afterMarriage?: string;
    };
    const errorList: errorsType = {}
    if (values.wifeMobile.length != 10) errorList.wifeMobile = "Enter 10 digit valid mobile number.";
    if (values.husbandMobile.length != 10) errorList.husbandMobile = "Enter 10 digit valid mobile number.";
    if (values.change_wifeName_to_afterMarriage == "YES" && values.wifeName_afterMarriage == "") errorList.wifeName_afterMarriage = "Please enter wife name after marriage.";
    return errorList;
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

  const signs = ['>', '<', `'`, `"`, '%'];

  const onChange = (e: any) => {
    let user = UserDetails;
    let addName = e.target.name;
    let addValue = e.target.value == (e.target.value == "SELECT") ? "" : e.target.value;

    signs.forEach(ob => {
      addValue = addValue.replace(ob, "");
    });

    if (addName != "husbandDateofBirth" && addName != "wifeDateofBirth" && addName != "husbandMobile" && addName != "wifeMobile"
      && addName != "husbandAddress" && addName != "wifeAddress" && addName != "marriageDate" && addName != "certificateCopies"
      && addName != "marriageAddress"
      && addName != "isHusbandDivorcee" && addName != "isWifeDivorcee" || addName == "husbandCountry" || addName == "wifeCountry" || addName == "husbandState" || addName == "wifeState"
    ) {
      addValue = addValue.replace(/[^\w\s]/gi, "");
      addValue = addValue.replace(/[0-9]/gi, "");
      addValue = addValue.replace(/_/g, "");
    }

    if (e.target.name == 'change_wifeName_to_afterMarriage') {
      if (e.target.value == "YES") {
        user = { ...user, wifeName_afterMarriage: "" }
      }
    }

    if (addName === "radio_isHusbandDivorcee") {
      if (addValue === 'YES') { user.isHusbandWidower = "NO"; user.isHusbandDivorcee = "";}
      else if (addValue === "NO" && user.ishusbandDivorcee) { user.ishusbandDivorcee = "" }
    }
    else if (addName === "isHusbandWidower") {
      if (addValue === 'YES') { user.radio_isHusbandDivorcee = "NO"; user.isHusbandDivorcee = ""; }
    }
    else if (addName === "radio_isWifeDivorcee") {
      if (addValue === "NO" && user.radio_wifeDivorceDate) { user.isWifeDivorcee = ""; }
      else if (addValue === "YES") { user.isWifeWidow = "NO";user.isWifeDivorcee = ""; }
    }
    else if (addName === "isWifeWidow") {
      if (addValue === 'YES') { user.radio_isWifeDivorcee = "NO"; user.iswifeDivorce = ""; }

    }

    else if (addName == "husbandMobile" || addName == "wifeMobile") {
      addValue = addValue.slice(0, 10);
    }

    if (e.target.name == "marriageAddress") {
      if (e.target.value == "SAME AS HUSBAND LOCATION") addValue = UserDetails.husbandAddress;
      else if (e.target.value == "SAME AS WIFE LOCATION") addValue = UserDetails.wifeAddress;
      else if (e.target.value == "ENTER LOCATION") addValue = "";
    }
    user = { ...user, [addName]: addValue }
    setUserDetails(user);
  }

  // const onChange = (e: any) => {
  //   let user = UserDetails;
  //   let addName = e.target.name;
  //   let addValue = e.target.value;
  //   if (e.target.name == 'change_wifeName_to_afterMarriage') {
  //     if (e.target.value == "false") {
  //       user = { ...user, wifeName_afterMarriage: "" }
  //     }
  //   }
  //   if (e.target.name == "marriageAddress") {
  //     if (e.target.value == "SAME AS HUSBAND LOCATION") addValue = UserDetails.husbandAddress;
  //     else if (e.target.value == "SAME AS WIFE LOCATION") addValue = UserDetails.wifeAddress;
  //     else if (e.target.value == "ENTER LOCATION") addValue = "";
  //   }

  //   user = { ...user, [addName]: addValue.toUpperCase() }
  //   setUserDetails(user);
  // }

  const OnFileSelect = async (event: any, docName: string, uploadName: string) => {
    if(event.target.files.length){
    if (event.target.files[0].size > 1024000) {
      ShowAlert(false, "File size should not exceed 1MB.","");
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
        registrationId: UserDetails._id
      }
      await ForUploadDoc(data, formData, uploadName);
    }
  }
  }
  }

  const ForUploadDoc = async (data: any, formData: any, uploadName: string) => {
    Loading(true);
    let result = await UploadDoc(data, formData, LoginDetails.loginType);
    Loading(false);
    if (result.status) {
      setUserDetails({ ...UserDetails, [uploadName]: "true" });
    }
    else {
      setUserDetails({ ...UserDetails, [uploadName]: "false" });
    }
  }

  const GoBack = () => {
    // let login = { ...LoginDetails, sroOffice: UserDetails.sroOffice }
    ShiftToLocation("/ViewUserDetails");
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

  return (
    <div style={{marginBottom:'3rem'}}>
      <div className={styles.Navbar}>
        <text className={styles.NavbarText}> Welcome : {LoginDetails.loginName.toUpperCase()} </text>
        <text className={styles.NavbarText}> Last Login : {LoginDetails.lastLogin}</text>
        <div style={{ cursor: 'pointer' }} onClick={() => { handleLogOut() }} ><text className={styles.NavbarText}> Logout </text></div>
      </div>
      {/* <text>{JSON.stringify(UserDetails, undefined, 2)}</text> */}
      {/* <text>{JSON.stringify(LoginDetails, undefined, 2)}</text> */}
      <form onSubmit={OnSubmit} className={styles.Container}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1em' }}>
          <text className={styles.TitleText}>User Registration Control Access</text>
          <div className={styles.EditButton} onClick={GoBack}><text className={styles.NavbarText}>Back</text></div>
        </div>
        <div className={styles.tableContainer}>
          {TableTitle('Particulars')}
          {TableTitle('Husband')}
          {TableTitle('Wife')}
        </div>
        {/*name*/}
        <div className={styles.tableContainer}>
          <div className={styles.singleColumn}>
            <TableText label={"1. Full Name"} required={true} LeftSpace={false} />
          </div>
          <div className={styles.singleColumn}>
            <TableInputText name='husbandName' type='text' placeholder='First - Middle - Last' required={true} value={UserDetails.husbandName} onChange={onChange} />
          </div>
          {/* <div className={styles.singleColumn}>
            <TableInputText type='text' placeholder='Before Marriage (First - Middle - Last) ' required={true} name='wifeName_beforeMarriage' value={UserDetails.wifeName_beforeMarriage} onChange={onChange} />
            <TableInputText type='text' placeholder='After Marriage (First - Middle - Last)(optional)' required={false} name='wifeName_afterMarriage' value={UserDetails.wifeName_afterMarriage} onChange={onChange} />
            {UserDetails.change_wifeName_to_afterMarriage == "YES" && <text className={styles.warningText}>{FormErrors.wifeName_afterMarriage}</text>}
          </div> */}
          <div className={styles.singleColumn}>
            <TableInputText type='text' placeholder='Before Marriage (Name - Surname) ' required={true} name='wifeName_beforeMarriage' value={UserDetails.wifeName_beforeMarriage} onChange={onChange} />
            {UserDetails.change_wifeName_to_afterMarriage == "YES" && <TableInputText type='text' placeholder='After Marriage (Name - Surname)' required={false} name='wifeName_afterMarriage' value={UserDetails.wifeName_afterMarriage} onChange={onChange} />}
            {UserDetails.change_wifeName_to_afterMarriage == "YES" && <text className={styles.warningText}>{FormErrors.wifeName_afterMarriage}</text>}
            <div>
              <TableInputRadio label='Do you want to change the surname after marriage?' required={true} name='change_wifeName_to_afterMarriage' defaultValue={UserDetails.change_wifeName_to_afterMarriage} onChange={onChange} options={FeaturesList.Boolean} />
            </div>
          </div>
        </div>
        {/* religion */}
        <div className={styles.tableContainer}>
          <div className={styles.singleColumn}>
            <TableText label='2. Religion' required={true} LeftSpace={false} />
          </div>
          <div className={styles.singleColumn}>
            <TableInputText name={'husbandReligion'} type='text' placeholder='' required={false} value={UserDetails.husbandReligion} onChange={() => { }} />
          </div>
          <div className={styles.singleColumn}>
            <TableInputText name={'wifeReligion'} type='text' placeholder='' required={false} value={UserDetails.wifeReligion} onChange={() => { }} />
          </div>
        </div>

        {/* cast */}
        {/* <div className={styles.tableContainer}>
          <div className={styles.singleColumn}>
            <TableText label='3. Caste Type' required={true} LeftSpace={false} />
          </div>
          <div className={styles.singleColumn}>
            <TableInputText name={'casteType'} type='text' placeholder='' required={true} value={UserDetails.casteType} onChange={onChange} disabled={true}/>
          </div>
          <div className={styles.singleColumn}>

          </div>
        </div> */}

        {/* Caste Name */}
        <div className={styles.tableContainer}>
          <div className={styles.singleColumn}>
            <TableText label='3. Caste Name' required={true} LeftSpace={false} />
          </div>
          <div className={styles.singleColumn}>
            <TableInputText name={'husbandCaste'} type='text' placeholder='Caste Name' required={true} value={UserDetails.husbandCaste} onChange={onChange} />
          </div>
          <div className={styles.singleColumn}>
            <TableInputText name={'wifeCaste'} type='text' placeholder='Caste Name' required={true} value={UserDetails.wifeCaste} onChange={onChange} />
          </div>
        </div>

        {/* Date of Birth */}
        <div className={styles.tableContainer}>
          <div className={styles.singleColumn}>
            <TableText label='4. Date of Birth (As per SSC certificate)' required={true} LeftSpace={false} />
          </div>
          <div className={styles.singleColumn}>
            <TableSelectDate max={LimitYearTo(21)} placeholder='Select Date' required={true} name={'husbandDateofBirth'} value={UserDetails.husbandDateofBirth} onChange={onChange} />
          </div>
          <div className={styles.singleColumn}>
            <TableSelectDate max={LimitYearTo(18)} placeholder='Select Date' required={true} name={'wifeDateofBirth'} value={UserDetails.wifeDateofBirth} onChange={onChange} />
          </div>
        </div>

        {/* Mobile */}
        <div className={styles.tableContainer}>
          <div className={styles.singleColumn}>
            <TableText label='5. Mobile' required={true} LeftSpace={false} />
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
        <div className={styles.tableContainer}>
          <div className={styles.singleColumn}>
            <TableText label='7. Profession' required={true} LeftSpace={false} />
          </div>
          <div className={styles.singleColumn}>
            <TableInputText name={'husbandRankorProfession'} type='text' placeholder='Profession' required={true} value={UserDetails.husbandRankorProfession} onChange={onChange} />
          </div>
          <div className={styles.singleColumn}>
            <TableInputText name={'wifeRankorProfession'} type='text' placeholder='Profession' required={true} value={UserDetails.wifeRankorProfession} onChange={onChange} />
          </div>
        </div> */}

        {/* country */}
        <div className={styles.tableContainer}>
          <div className={styles.singleColumn}>
            <TableText label={"6. Country"} required={true} LeftSpace={false} />
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
        </div>

        {/* state */}
        <div className={styles.tableContainer}>
          <div className={styles.singleColumn}>
            <TableText label={"7. State"} required={true} LeftSpace={false} />
          </div>
          <div className={styles.singleColumn}>
            <div style={{ marginBottom: '5px' }}>
              {UserDetails.radio_husbandCountry == "INDIA" && <TableInputRadio label='' required={true} name='radio_husbandState' defaultValue={UserDetails.radio_husbandState} onChange={onChange} options={FeaturesList.state} />}
            </div>
            {UserDetails.radio_husbandCountry == "INDIA" && UserDetails.radio_husbandState != "ANDHRA PRADESH" && <TableInputText type='text' placeholder='Enter State Name' required={true} name='husbandState' value={UserDetails.husbandState} onChange={onChange} />}
          </div>
          <div className={styles.singleColumn}>
            <div style={{ marginBottom: '5px' }}>
              {UserDetails.radio_wifeCountry == "INDIA" && <TableInputRadio label='' required={true} name='radio_wifeState' defaultValue={UserDetails.radio_wifeState} onChange={onChange} options={FeaturesList.state} />}
            </div>
            {UserDetails.radio_wifeCountry == "INDIA" && UserDetails.radio_wifeState != "ANDHRA PRADESH" && <TableInputText type='text' placeholder='Enter State Name' required={true} name='wifeState' value={UserDetails.wifeState} onChange={onChange} />}
          </div>
        </div>

        {/* permanentplace */}
        <div className={styles.tableContainer}>
          <div className={styles.singleColumn}>
            <TableText label='8. Residence Address' required={true} LeftSpace={false} />
            <TableText label='(Village, Street  Should be Separated by Comma)' required={false} LeftSpace={false} />
          </div>
          <div className={styles.singleColumn}>
            <TableInputLongText placeholder='Enter Complete Address' required={true} name='husbandAddress' value={UserDetails.husbandAddress} onChange={onChange} />
          </div>
          <div className={styles.singleColumn}>
            <TableInputLongText placeholder='Enter Complete Address' required={true} name='wifeAddress' value={UserDetails.wifeAddress} onChange={onChange} />
          </div>
        </div>

        {/* divorce */}
        <div className={styles.tableContainer}>
          <div className={styles.singleColumn}>
            <TableText label={"9. Whether Wife or Husband is a Divorcee?"} required={true} LeftSpace={false} />
          </div>
          <div className={styles.singleColumn}>
            <div style={{ marginBottom: '5px' }}>
              <TableInputRadio label='Date of Divorce' required={true} name='radio_isHusbandDivorcee' defaultValue={UserDetails.radio_isHusbandDivorcee} onChange={onChange} options={FeaturesList.Boolean} />
            </div>
            {UserDetails.radio_isHusbandDivorcee != "NO" &&
              <TableSelectDate max={moment(moment().toDate()).format("YYYY-MM-DD")} placeholder='Select Date' required={true} name='isHusbandDivorcee' value={UserDetails.isHusbandDivorcee} onChange={onChange} />}
            {/* <TableInputText type='text' placeholder='Select Date' required={true} name='isHusbandDivorcee' value={UserDetails.isHusbandDivorcee} onChange={onChange} /> */}
          </div>
          <div className={styles.singleColumn}>
            <div style={{ marginBottom: '5px' }}>
              <TableInputRadio label='Date of Divorce' required={true} name='radio_isWifeDivorcee' defaultValue={UserDetails.radio_isWifeDivorcee} onChange={onChange} options={FeaturesList.Boolean} />
            </div>
            {UserDetails.radio_isWifeDivorcee != "NO" &&
              <TableSelectDate max={moment(moment().toDate()).format("YYYY-MM-DD")} placeholder='Select Date' required={true} name='isWifeDivorcee' value={UserDetails.isWifeDivorcee} onChange={onChange} />}
            {/* <TableInputText type='text' placeholder='Select Date' required={true} name='isWifeDivorcee' value={UserDetails.isWifeDivorcee} onChange={onChange} />} */}
          </div>
        </div>

        {/* widow */}
        <div className={styles.tableContainer}>
          <div className={styles.singleColumn}>
            <TableText label={"10. Wife or Husband Widow / Widower"} required={true} LeftSpace={false} />
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

        {/* Relationship */}
        <div className={styles.tableContainer}>
          <div className={styles.singleColumn}>
            <TableText label='11. Relationship with follwing Member' required={true} LeftSpace={false} />
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
            <TableText label="12. Father Name" required={true} LeftSpace={false} />
          </div>
          <div className={styles.singleColumn}>
            <TableInputText type='text' placeholder="Husband's Father Full Name" required={true} name={'husbandFatherName'} value={UserDetails.husbandFatherName} onChange={onChange} />
          </div>
          <div className={styles.singleColumn}>
            <TableInputText type='text' placeholder="Wife's Father Full Name" required={true} name={'wifeFatherName'} value={UserDetails.wifeFatherName} onChange={onChange} />
          </div>
        </div>

        {/* mother */}
        <div className={styles.tableContainer}>
          <div className={styles.singleColumn}>
            <TableText label="13. Mother Name" required={true} LeftSpace={false} />
          </div>
          <div className={styles.singleColumn}>
            <TableInputText type='text' placeholder="Husband's Mother Name" required={true} name={'husbandMotherName'} value={UserDetails.husbandMotherName} onChange={onChange} />
          </div>
          <div className={styles.singleColumn}>
            <TableInputText type='text' placeholder="Wife's Mother Name" required={true} name={'wifeMotherName'} value={UserDetails.wifeMotherName} onChange={onChange} />
          </div>
        </div>

        {/* date of marriage */}
        <div className={styles.marriageContainer}>
          <div className={styles.leftColumn}>
            <TableText label='14. Date of Marriage' required={true} LeftSpace={false} />
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
            <TableText label='15. Place of marriage' required={true} LeftSpace={false} />
            <TableText label='(Village, Street  Should be Separated by Comma)' required={false} LeftSpace={false} />
          </div>
          <div className={styles.rightColumn}>
            <TableInputLongText placeholder='Enter Complete Address' required={true} name='marriageAddress' value={UserDetails.marriageAddress} onChange={onChange} />
          </div>
        </div>


        {/* certificatecopies
        <div className={styles.marriageContainer}>
          <div className={styles.leftColumn}>
            <TableText label="17. No of Certificate Copies" required={true} LeftSpace={false} />
          </div>
          <div className={styles.rightColumn}>
            <TableInputText type='number' placeholder='' required={true} name={'certificateCopies'} value={UserDetails.certificateCopies} onChange={onChange} />
          </div>
        </div> */}

        {/* certificatecopies */}
        <div className={styles.marriageContainer}>
          <div className={styles.leftColumn}>
            <TableText label="16. Number of Certificate Copies" required={true} LeftSpace={false} />
          </div>
          <div className={styles.rightColumn}>
            <TableInputRadio label='' required={true} name='certificateCopies' defaultValue={UserDetails.certificateCopies} options={FeaturesList.coppies} onChange={onChange} />
            {/* <TableInputText type='number' placeholder='' required={true} name={'certificateCopies'} value={UserDetails.certificateCopies} onChange={onChange} /> */}
          </div>
        </div>


        {/* Fine uploads */}
        <div style={{ backgroundColor: '#F6F6F6', padding: '1em' }}>
          <text className={styles.UploadText}>Document List </text>
          <text className={styles.UploadText} style={{ color: 'red' }} >*Note : Please Upload Only in JPG/JPEG/PNG format and Maximum Size 1 MB. A single image will be allowed in each section.</text>
        </div>
        <div>
          {/* <UploadContainer isUploadDone={UserDetails.doc_husBandPhoto_upload} label='HusBand Photo' required={true} onChange={(e: any) => { OnFileSelect(e, 'doc_husBandPhoto', 'doc_husBandPhoto_upload') }} /> */}
          {/* <UploadContainer isUploadDone={UserDetails.doc_wifePhoto_upload} label='Wife Photo' required={true} onChange={(e: any) => { OnFileSelect(e, 'doc_wifePhoto', 'doc_wifePhoto_upload') }} /> */}
          <SelectUploadContainer onCancelUpload={onCancelUpload} uploadKey='doc_weddingCard_upload' isUploadDone={UserDetails.doc_weddingCard_upload} label='Wedding Card' required={false} onChange={(e: any) => { OnFileSelect(e, 'doc_weddingCard', 'doc_weddingCard_upload') }} />
          <SelectUploadContainer onCancelUpload={onCancelUpload} uploadKey='doc_husbandBirthProof_upload' isUploadDone={UserDetails.doc_husbandBirthProof_upload} label="Birth Certificate / SSC Marks Memo/ Passport / Notary Affidavit (Husband)" required={true} onChange={(e: any) => { OnFileSelect(e, 'doc_husbandBirthProof', 'doc_husbandBirthProof_upload') }} />
          <SelectUploadContainer onCancelUpload={onCancelUpload} uploadKey='doc_wifeBirthProof_upload' isUploadDone={UserDetails.doc_wifeBirthProof_upload} label="Birth Certificate / SSC Marks Memo/ Passport / Notary Affidavit (Wife)" required={true} onChange={(e: any) => { OnFileSelect(e, 'doc_wifeBirthProof', 'doc_wifeBirthProof_upload') }} />
          <SelectUploadContainer onCancelUpload={onCancelUpload} uploadKey='doc_marriagePhoto_upload' isUploadDone={UserDetails.doc_marriagePhoto_upload} label='Marriage Photo (Upload a photo with in wedding attire)' required={false} onChange={(e: any) => { OnFileSelect(e, 'doc_marriagePhoto', 'doc_marriagePhoto_upload') }} />
          <SelectUploadContainer onCancelUpload={onCancelUpload} uploadKey='doc_husbandPhoto_upload' isUploadDone={UserDetails.doc_husbandPhoto_upload} label='Husband Photo' required={true} onChange={(e: any) => { OnFileSelect(e, 'doc_husbandPhoto', 'doc_husbandPhoto_upload') }} />
          <SelectUploadContainer onCancelUpload={onCancelUpload} uploadKey='doc_wifePhoto_upload' isUploadDone={UserDetails.doc_wifePhoto_upload} label='Wife Photo' required={true} onChange={(e: any) => { OnFileSelect(e, 'doc_wifePhoto', 'doc_wifePhoto_upload') }} />
          <SelectUploadContainer onCancelUpload={onCancelUpload} uploadKey='doc_husbandResidenceProof_upload' isUploadDone={UserDetails.doc_husbandResidenceProof_upload} label="Residence Proof (Husband)" required={true} onChange={(e: any) => { OnFileSelect(e, 'doc_husbandResidenceProof', 'doc_husbandResidenceProof_upload') }} />
          <SelectUploadContainer onCancelUpload={onCancelUpload} uploadKey='doc_wifeResidenceProof_upload' isUploadDone={UserDetails.doc_wifeResidenceProof_upload} label="Residence Proof (Wife)" required={true} onChange={(e: any) => { OnFileSelect(e, 'doc_wifeResidenceProof', 'doc_wifeResidenceProof_upload') }} />
          <SelectUploadContainer onCancelUpload={onCancelUpload} uploadKey='doc_marriageRecept_upload' isUploadDone={UserDetails.doc_marriageRecept_upload} label="Marriage Function Hall Receipt (Optional)" required={false} onChange={(e: any) => { OnFileSelect(e, 'doc_marriageRecept', 'doc_marriageRecept_upload') }} />
          {
            UserDetails.radio_isHusbandDivorcee == "YES" &&
            <SelectUploadContainer onCancelUpload={onCancelUpload} uploadKey='doc_isHusbandDivorcee_upload' isUploadDone={UserDetails.doc_isHusbandDivorcee_upload} label='Divorcee Proof/Decree of Court (Husband)' required={true} onChange={(e: any) => { OnFileSelect(e, 'doc_isHusbandDivorcee', 'doc_isHusbandDivorcee_upload') }} />
          }
          {
            UserDetails.isHusbandWidower == "YES" &&
            <SelectUploadContainer onCancelUpload={onCancelUpload} uploadKey='doc_isHusbandWidower_upload' isUploadDone={UserDetails.doc_isHusbandWidower_upload} label='Proof of Death (Deceased Wife)' required={true} onChange={(e: any) => { OnFileSelect(e, 'doc_isHusbandWidower', 'doc_isHusbandWidower_upload') }} />
          }
          {
            UserDetails.radio_isWifeDivorcee == "YES" &&
            <SelectUploadContainer onCancelUpload={onCancelUpload} uploadKey='doc_isWifeDivorcee_upload' isUploadDone={UserDetails.doc_isWifeDivorcee_upload} label='Divorcee Proof / Decree of court (Wife)' required={true} onChange={(e: any) => { OnFileSelect(e, 'doc_isWifeDivorcee', 'doc_isWifeDivorcee_upload') }} />
          }
          {
            UserDetails.isWifeWidow == "YES" &&
            <SelectUploadContainer onCancelUpload={onCancelUpload} uploadKey='doc_isWifeWidow_upload' isUploadDone={UserDetails.doc_isWifeWidow_upload} label='Proof of Death (Deceased Husband)' required={true} onChange={(e: any) => { OnFileSelect(e, 'doc_isWifeWidow', 'doc_isWifeWidow_upload') }} />
          }
        </div>
        {/* <div style={{ backgroundColor: '#F6F6F6', padding: '1em' }}>
          {UserDetails.casteType == "SAME CASTE" && <div>
            <text className={styles.UploadText}>Payment Link : </text>
            <a href='https://www.google.com/' rel="noreferrer" target="_blank" className={styles.UploadText} >Government Payment link</a>
          </div>
          }
          <div>
            <text className={styles.UploadText}>Payment Amount : </text>
            <text className={styles.UploadText} style={{ color: 'red' }} >{UserDetails.casteType == "SAME CASTE" ? " Rs 2000/-" : "NILL"}</text>
          </div>
          {UserDetails.casteType == "SAME CASTE" && <div>
            <text className={styles.UploadText} style={{ color: 'red' }} >*Please make the payment on above link and Upload recept here.</text>
          </div>}
        </div> */}
        {/* {UserDetails.casteType == "SAME CASTE" && <SelectUploadContainer isUploadDone={UserDetails.doc_receipt_upload} label="Payment Receipt" required={false} onChange={(e: any) => { OnFileSelect(e, 'doc_receipt', 'doc_receipt_upload') }} />} */}
        <div className={styles.paymentContainer}>
          <button className={styles.paymentButtton}>SAVE & BACK</button>
        </div>
      </form>
      {/* <pre>{JSON.stringify(UserDetails,null,2)}</pre> */}
    </div>
  )
}

export default OfficerUserUpdate;
