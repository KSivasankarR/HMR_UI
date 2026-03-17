import instance from "./redux/api";
import { store } from "./redux/store";
import { ConfirmAction, LoadingAction, PopupAction } from '../src/redux/commonSlice';

const ShowAlert = (type, message,redirect) => { store.dispatch(PopupAction({ enable: true, type: type, message: message, redirect:redirect })); }

export const SaveUser = async (UserDetails: any, loginType:string) => {
    let url;
    if(loginType=="officer")
        url = "/officer/saveUser";
    else
        url = "/users/saveUser";
    return await instance.post( url, UserDetails)
        .then((res) => {return 'User data saved successfully.';})
        .catch((e) => { return e && e.response && e.response.data && e.response.data.message ? e.response.data.message : 'Data save failed';});
}


export const GetUserRegistrations = async () => {
    return await instance.get( "/users/getUserRegistrations")
        .then((res) => {return res.data;})
        .catch((e) => {return "Data not found."});
}

export const Esigncoordinates = async (data: any) => {
    console.log("🔍 Checking API Data Before Sending:", data);
    let encodeData = encodeURIComponent(btoa(data.aadhar+":::"+data.aadharname));
    return await instance.get(`/mrgCertificate/EsignCoordinates?registrationNumber=${data.registrationNumber}&data=${encodeData}&search=${data.searchText}&flag=${data.flag}`)
        .then((res) => { return res.data})
        .catch(e => {
            return {
                status: false,
                message: e.response.data && e.response.data
            }
        });
}

export const PendingEsign = async (data: any) => {
    return await instance.get(`/mrgCertificate/pendingEsign?registrationNumber=${data.registrationNumber}&esignstatus=${data.esignstatus}`)
        .then((res) => { return res.data})
        .catch(e => {
            return {
                status: false,
                message: e.response.data && e.response.data
            }
        });
}

export const GetUserList = async (status: string, search: string, pageNum: number, limit: number, year: string | null) => {
    let url = "/users/getUserList?status=" + status + "&search=" + search + "&page=" + pageNum + "&limit=" + limit;
    if (year) {
        url += "&year=" + year;
    }
    return await instance.get(url)
        .then((res) => {return res.data;})
        .catch((e) => {return "Data not found."});
}
/*
export const GetReportUserList = async (noOfDays:any) => {
    return await instance.get( "/statistics/" + noOfDays)
        .then((res) => {return res.data;})
        .catch((e) => {});
    
}
*/

export const UpdateCertificateRequest = async (id:any) => {   
    return await instance.put( `/users/UpdateCertitificateRequestDatabySRO/${id}`)
    .then((res) => {return res.data;})
    .catch((e) => {return "Data not found."});
}

export const GetReportDataListByFilter = async (noOfDays:any, page:number, searchValue:string, limit:number, fromDate?: string, toDate?: string, role?: string) => {    
    let reportsData = {};
    // Only include noOfDays if not SRO in reports tab
    if (role !== 'SRO' && role !== 'DR') {
        reportsData["noOfDays"] = noOfDays;
    }
    reportsData["search"] = searchValue;
    reportsData["page"] = page;
    reportsData["limit"] = limit;
    if (fromDate) {
        reportsData["fromDate"] = fromDate;
    }
    if (toDate) {
        reportsData["toDate"] = toDate;
    }
    return await instance.post("/users/officerStatistics", reportsData)
        .then((res) => { return res.data; })
        .catch((e) => {});
}

export const GetDistrictReports = async (page:number, searchValue:string, limit:number, fromDate?: string, toDate?: string) => { 
    let reportsData = {};
    reportsData["search"]= searchValue;
    reportsData["page"]=page;
    reportsData["limit"]=limit;   
    if (fromDate) {
        reportsData["fromDate"] = fromDate;
    }
    if (toDate) {
        reportsData["toDate"] = toDate;
    }
    return await instance.post( "/users/officerStatisticsdistrictdata",reportsData)
    .then((res) => {return res.data;})
    .catch((e) => {});
}

export const GetMandalReports = async ( district:string, page:number, searchValue:string, limit:number) => { 
    let reportsData = {};
    reportsData["district"]=district
    reportsData["search"]= searchValue;
    reportsData["page"]=page;
    reportsData["limit"]=limit;   
    return await instance.post( "/users/officerStatisticsMandaldata",reportsData)
    .then((res) => {return res.data;})
    .catch((e) => {});
}

export const GetVillageReports = async ( district:string,mandal:string,page:number, searchValue:string, limit:number) => { 
    let reportsData = {};
    reportsData["district"]=district;
    reportsData["mandal"]=mandal;
    reportsData["search"]= searchValue;
    reportsData["page"]=page;
    reportsData["limit"]=limit;   
    return await instance.post( "/users/officerStatisticsvillagedata",reportsData)
    .then((res) => {return res.data;})
    .catch((e) => {});
}
export const GetReportUserViewList = async (sroNumber:any, status:any, noOfDays:any, fromDate?: any, toDate?: any) => {
    let dataObj = {"sroNumber":sroNumber,"status":status};
    if (fromDate) {
        dataObj["fromDate"] = fromDate;
    }
    if (toDate) {
        dataObj["toDate"] = toDate;
    }
    return await instance.post( "/users/getRegistrationByDate", dataObj)
        .then((res) => {return res.data;})
        .catch((e) => {});
}

export const GetDistrictwiseViewList = async (district:any, status:any, fromDate?: any, toDate?: any) => {
    let dataObj = {"district":district,"status":status};
    if (fromDate) {
        dataObj["fromDate"] = fromDate;
    }
    if (toDate) {
        dataObj["toDate"] = toDate;
    }
    return await instance.post( "/users/getRegistrationsByStatisticValues", dataObj)  //url check cheyali
        .then((res) => {return res.data;})
        .catch((e) => {});
}

export const GetMandalwiseViewList = async (district:any,mandal:any, status:any, fromDate?: any, toDate?: any) => {
    let dataObj = {"district":district,"mandal":mandal,"status":status};
    if (fromDate) {
        dataObj["fromDate"] = fromDate;
    }
    if (toDate) {
        dataObj["toDate"] = toDate;
    }
    return await instance.post( "/users/getRegistrationsByStatisticValues", dataObj)
        .then((res) => {return res.data;})
        .catch((e) => {});
}

export const GetVillagewiseViewList = async (district:any,mandal:any,villageWard:any,status:any, fromDate?: any, toDate?: any) => {
    let dataObj = {"district":district,"mandal":mandal,"villageWard":villageWard,"status":status};
    if (fromDate) {
        dataObj["fromDate"] = fromDate;
    }
    if (toDate) {
        dataObj["toDate"] = toDate;
    }
    return await instance.post( "/users/getRegistrationsByStatisticValues", dataObj)
        .then((res) => {return res.data;})
        .catch((e) => {});
}


export const GetUserById = async (id: any) => {
    return await instance.get( "/users/userById/" + id)
        .then((res) => {return res.data;})
        .catch((e) => {});
}

export const CompleteSingup = async (data: any) => {
    return await instance.post( "/users/signup", data)
        .then((res) => {return res.data;})
        .catch((e) => {})
}

export const UserLogin = async (data: any) => {
    return await instance.post( "/users/login", data)
        .then((res) => {return res.data;})
        .catch((e) =>{return e && e.response && e.response.data ? e.response.data : {'message': 'something went wrong'}})
}

export const OfficerLogin = async (data: any) => {
    return await instance.post( "/officer/login", data)
        .then((res) => {return res.data;})
        .catch((e) => {return e && e.response && e.response.data ? e.response.data : {'message': 'something went wrong'}})
}

export const CallTokenInvalidate = async () => {
    return await instance.get( "/users/tokenInvalidate")
        .then((res) => {return res.data;})
        .catch((e) => {return e && e.response && e.response.data ? e.response.data : {'message': 'something went wrong'}});   
}

export const UsePasswordByOfficer = async (data: any) => {
    return await instance.put( "/officer/resetPassword", data)
        .then((res) => {return res.data;})
        .catch((e) => {})
}
export const UploadDoc = async (data: any, formData: any, loginType:string) => {
    let url;
    if(loginType=="USER")
        url = "/users/fileUpload/" + data.registrationId + "/" + data.docName;
    else
        url = "/officer/fileUpload/" + data.registrationId + "/" + data.docName;
    return await instance.post( url, formData)
        .then((res) => {return res.data;})
        .catch((e) => {})
}

export const removeUploadDoc = async (fileName:string, appNumber:string, loginType: string) => {
    let url;
    if(loginType=="USER")
        url = "/users/removeFileUpload/" + appNumber + "/" + fileName;
    else
        url = "/officer/removeFileUpload/" + appNumber + "/" + fileName;
    return await instance.delete( url )
        .then((res) => {return res.data;})
        .catch((e) => {})
}


export const GetUserByAppNo = async (id: any, loginType: any) => {
    let url;
    if(loginType=="USER")
        url = "/users/userbyAppNo/" + id;
    else
        url = "/officer/userbyAppNo/" + id
    return await instance.get(url)
        .then((res) => {return res.data;})
        .catch((e) => {});
}

export const UseGetReceipt = async (id: any) => {
    return await instance.put( "/mrgCertificate/printACK/acknowledgement/" + id)
        .then((res) => {
            downlaodFileFromResposne(res);
            return res.data;
        })
        .catch((e) => {
            let mssg = e && e.response && e.response.data && e.response.data.message ?
            e.response.data.message : 'Internal Server Error.';
            ShowAlert(false, mssg, "");
        });
}

export const GetDistrict = async () => {
    return await instance.get( "/masterData/categories?state=AP")
        .then((res) => {return res.data;})
        .catch((e) => {});
}

export const GetCaste = async () => {
    return await instance.get( "/cast/subCastDetails")
        .then((res) => {return res.data;})
        .catch((e) => {});
}


export const GetMandal = async (district: string) => {
    return await instance.get( "/masterData/categories?state=AP&district=" + district)
        .then((res) => { return res.data; })
        .catch((e) => {  });
}

export const CallCreateNewReg = async (loginId : string, loginType: string) => {
    let url;
    if(loginType=="USER")
        url = "/users/sampleRegistration";
    else
        url = "/officer/sampleRegistration";
    return await instance.get( url )
        .then((res) => { return res.data; })
        .catch((e) => { return {} });
}

export const GetOffice = async (district_mandal: string) => {
    return await instance.get( "/masterData/categories?state=AP&district=" + district_mandal)
        .then((res) => { return res.data; })
        .catch((e) => {  });
}

export const GetFormLink = async (data: any) => {
    let myURL =  "/mrgCertificate/pdf/"+data.sroNumber+"/" + data.appNo;
    return await instance.get(myURL).then((res) => { 
        downlaodFileFromResposne(res);
        return res.data; 
    }).catch((e) => {  
        let mssg = e && e.response && e.response.data && e.response.data.message ?
        e.response.data.message : 'Something went wrong.';
        ShowAlert(false, mssg, "");
    });
}

export const GetFormLinkUser = async (appNo: string) => {
    return await instance.get( "mrgCertificate/pdf/" + appNo + "?q=docs")
        .then((res) => { return res.data; })
        .catch((e) => {  });
}

export const RequestOTPForForgetPswd = async (body: any) => {
    return await instance.post( "/users/forgotPassword",body)
        .then((res) => { return res.data; })
        .catch((e) => {  });
}

export const ResetPasswordByMail = async (body: any) => {
    return await instance.post( "/users/resetPasswordByMail",body)
        .then((res) => { return res.data; })
        .catch((e) => {  });
}


export const RequestOTPForEmail = async (body: any) => {
    return await instance.post( "/users/emailVerification",body)
        .then((res) => { return res.data; })
        .catch((e) => {  });
}

export const VerifyOTPForEmail = async (email: string,code:string, type: string) => {
    let bodyData = {"loginEmail":email, "otp":code};
    return await instance.post( `/users/${type}/otpValidation`, bodyData)
        .then((res) => { return res.data; })
        .catch((e) => {  });
}

export const CallUpdateSRO = async (data:any) => {
    return await instance.post( "/officer/updateSro/"+data.loginId,data)
        .then((res) => { return res.data; })
        .catch((e) => {  });
}

export const getVillageData = async (params: string) => {
    return await instance.get('/masterData/vgCats?district='+ params)
                    .then(res => res.data)
}

// api to get sro offices by village codes
export const getSroOfficesByVC = async (query: string) => {
    return await instance.get('/masterData/vgCats?villageCode=' + query)
                        .then(res => res.data)
}

export const downloadFileByNameAndAppNo = async(filename: any, appNo: any, loginType: any) => {
    let url;
    if(loginType=="officer")
        url = `/mrgCertificate/officerDownloadDocument/${filename}/${appNo}`;
    else
        url = `/mrgCertificate/downloadDocument/${filename}/${appNo}`;
    return await instance.get(url).then(res => {
        downlaodFileFromResposne(res);
        return "";
    }).catch((e) => {
        let mssg = e && e.response && e.response.data && e.response.data.message ?
         e.response.data.message : 'Something went wrong.';
        ShowAlert(false, mssg, "");
      });
}


export const downloadFileByAppNoForView = async(appNo: any) => {
    let url = `/mrgCertificate/downloadFileByAppNoForView/doc_final_regForm/${appNo}`;
    return await instance.get(url).then(res => {
       return res.data;
    }).catch((e) => {
        let mssg = e && e.response && e.response.data && e.response.data.message ?
         e.response.data.message : 'Something went wrong.';
        ShowAlert(false, mssg, "");
      });
}

export const GetPaymentStatus = async (applicationNumber:any) =>{
    return await instance.get( "/payment/verifyPayment/"+ applicationNumber )
        .then((res) => {return res.data;})
        .catch((e) => {return e.response.data});
}


export const GetVerificationStatus = async (deptTransID:any) =>{
    return await instance.post( "/payment/verifyTransactionStatus",{"deptTransID":deptTransID})
        .then((res) => {return res.data;})
        .catch((e) => {return e.response.data});
}


export const DefaceStatus = async (deptTransID:any) =>{
    return await instance.get( "/payment/defaceTransaction/"+ deptTransID)
        .then((res) => {return res.data;})
        .catch((e) => {return e.response.data});
}

export const GetSearchCompleted = async (husbandName:string,wifeName:string,documentNumber:string) => {
    return await instance.get( `/officer/getSearchList?husbandName=${husbandName}&wifeName=${wifeName}&documentNumber=${documentNumber}`)
        .then((res) => {return res.data;})
        .catch((e) => {return e.response.data});
}

export const GetChallanData = async (challanNumber:string,appNo:string) => {
    return await instance.get( `/payment/getchallan?challanNumber=${challanNumber}&appNo=${appNo}`)
        .then((res) => {return res.data;})
        .catch((e) => {return e.response.data});
}

export const DefaceCFMSChallan = async (deptTransID:any) =>{
    return await instance.get( "/payment/defaceCFMSChallan/"+ deptTransID)
        .then((res) => {return res.data;})
        .catch((e) => {return e.response.data});
}

export const getAadharOTP = async (data: any) => {
    console.log(data);
    return await instance.post(process.env.PAYMENT_GATEWAY_URL+"generateOTPByAadharNumber", { "aadharNumber": Buffer.from(data).toString('base64') })
        .then((res) => { return res.data && res.data.status === 'Failure' ? { ...res.data, status: false } : { ...res.data, status: true } })
        .catch(e => {
            return { 'status': false, 'message': e && e.response && e.response.data && e.response.data.message ? e.response.data.message : "Aadhaar api failed" }
        });

}
export const getAadharDetails = async (data: any) => {
    return await instance.post(process.env.PAYMENT_GATEWAY_URL+`aadharEKYCWithOTP`, data)
        .then((res) => { return res.data && res.data.status === 'Failure' ? { ...res.data, status: false } : { ...res.data, status: true } })
        .catch(e => {
            return { 'status': false, 'message': e && e.response && e.response.data && e.response.data.message ? e.response.data.message : "Aadhaar api failed" }
        });
}

export const registeredDraftSavedAPI = async (UserDetails: any) => {
    let url;
    url = "/users/registrationDraftSave";
    return await instance.post(url, UserDetails)
        .then((res) => { return res.data })
        .catch((e) => { return e && e.response && e.response.data && e.response.data.message ? e.response.data.message : 'Data save failed'; });
}


function downlaodFileFromResposne(res)
{
    let responseData = res.data;
    if(responseData.Success)
    {
        let imageResp = responseData.dataBase64;
        let contentType;
        if(responseData.fileName.endsWith(".pdf"))
        contentType = "application/pdf";
        else
        {
            let type = (responseData.fileName).split(".")[1];
            if(type=="jpg")
                type = "jpeg";
            contentType = 'image/'+type;
        }
        const linkSource = 'data:'+contentType+';base64,'+imageResp;
        let downloadLink = document.createElement("a");

        downloadLink.href = linkSource;
        downloadLink.target = "_blank";
        downloadLink.download = responseData.fileName;
        downloadLink.click();
        sleep(1000);
        downloadLink.remove();
    }
    else
        ShowAlert(false, res.data.message, "");
}

export const GetAllCertificateRequestsbySRO = async (status:string) => {
    return await instance.get( `sso/getSROCertificateRequests?status=${status}`)
        .then((res) => {return res.data;})
        .catch((e) => {return "Data not found."});
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}