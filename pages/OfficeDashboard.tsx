import React, { Fragment, useEffect, useState, useRef } from 'react'
import styles from '../styles/pages/OfficeDashboard.module.scss';
import { useRouter } from 'next/router';
import {
    GetUserList, GetReportUserViewList, GetReportDataListByFilter,
    GetDistrictwiseViewList, GetMandalwiseViewList, GetVillagewiseViewList, CallTokenInvalidate, GetSearchCompleted, GetDistrictReports, GetMandalReports, GetVillageReports, GetAllCertificateRequestsbySRO
} from '../src/axios';
import { FaRegEdit } from 'react-icons/fa';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { LoadingAction, PopupAction } from '../src/redux/commonSlice';
import { Row, Col } from 'react-bootstrap'
import TableInputText from '../src/components/TableInputText';
import TableText from '../src/components/TableText';
import TableInputRadio from '../src/components/TableInputRadio';
import loginSlice from '../src/redux/loginSlice';
import { handleLogOut } from '../utils';
// import TableSelectDate from '../src/components/TableSelectDate';

const pageSize = 50;
const datagridSx = {
    borderRadius: 2,
    "& .MuiDataGrid-main": { borderRadius: 2, marginTop: "-1%" },
    "& .MuiDataGrid-columnHeaders": {
        color: "#FFFFFF",
        fontStyle: "bold",
        fontSize: 16,
        background: "linear-gradient(90deg, #394C91 0.86%, #27D3E0 100%)",
        minHeight: "11% !important",
        maxHeight: "11% !important",
        marginTop: "1%"
    },
};

const columns: GridColDef[] = [
    { field: 'appNo', headerName: 'Application No.', flex: 2 },
    { field: 'husbandName', headerName: 'Husband Name', flex: 2 },
    { field: 'wifeName_beforeMarriage', headerName: 'Wife Name', flex: 2 },
    { field: 'assignedTo', headerName: 'Assigned To', flex: 1.8 },
    { field: 'regDate', headerName: 'App. Date', flex: 1.2 },
    // { field: 'status', headerName: 'Status', flex: 1 },
    { field: 'slotDate', headerName: 'Slot Date', flex: 1 },
    { field: 'slotTime', headerName: 'Slot Time', flex: 1 },
];

const completedcolumns: GridColDef[] = [
    { field: 'appNo', headerName: 'Application No.', flex: 2 },
    { field: 'documentNumber', headerName: 'Reg. No.', flex: 1.2 },
    { field: 'husbandName', headerName: 'Husband Name', flex: 2 },
    { field: 'wifeName_beforeMarriage', headerName: 'Wife Name', flex: 2 },
    { field: 'assignedTo', headerName: 'Assigned To', flex: 1.55 },
    { field: 'regDate', headerName: 'App. Date', flex: 1 },
    { field: 'updatedAt', headerName: 'Reg. Date', flex: 1 },
    // { field: 'status', headerName: 'Status', flex: 1.25 },

]

const reportcolumns: GridColDef[] = [
    { field: 'district', headerName: 'District Name', flex: 1 },
    { field: 'sroName', headerName: 'SRO', flex: 1 },
    { field: 'sroNumber', headerName: 'SRO Code', flex: 1 },
    { field: 'created', headerName: 'Applications Received', flex: 1 },
    { field: 'completed', headerName: 'Marriages Registered', flex: 1 },
    { field: 'pending', headerName: 'Marriages Due for Registration', flex: 1.2 },

]

const Reportcolumnsdata: GridColDef[] = [
    { field: 'appNo', headerName: 'Application No.', flex: 2 },
    { field: 'husbandName', headerName: 'Husband Name', flex: 2 },
    { field: 'wifeName_beforeMarriage', headerName: 'Wife Name', flex: 2 },
    { field: 'assignedTo', headerName: 'Assigned To', flex: 1.8 },
    { field: 'regDate', headerName: 'App. Date', flex: 1.2 },
    { field: 'status', headerName: 'Status', flex: 1 },
    { field: 'slotDate', headerName: 'Slot Date', flex: 1 },
    { field: 'slotTime', headerName: 'Slot Time', flex: 1 },
];

const districtcolumns: GridColDef[] = [
    { field: 'district', headerName: 'District Name', flex: 1 },
    { field: 'created', headerName: 'Applications Received', flex: 1 },
    { field: 'completed', headerName: 'Marriages Registered', flex: 1 },
    { field: 'pending', headerName: 'Marriages Due for Registration', flex: 1 },
]
const mandalcolumns: GridColDef[] = [
    { field: 'district', headerName: 'District Name', flex: 1 },
    { field: 'mandal', headerName: 'Mandal Name', flex: 1 },
    { field: 'created', headerName: 'Applications Received', flex: 1 },
    { field: 'completed', headerName: 'Marriages Registered', flex: 1 },
    { field: 'pending', headerName: 'Marriages Due for Registration', flex: 1 },
]
const villagecolumns: GridColDef[] = [
    { field: 'district', headerName: 'District Name', flex: 1 },
    { field: 'mandal', headerName: 'Mandal Name', flex: 1 },
    { field: 'village', headerName: 'Village Name', flex: 1 },
    { field: 'created', headerName: 'Applications Received', flex: 1 },
    { field: 'completed', headerName: 'Marriages Registered', flex: 1 },
    { field: 'pending', headerName: 'Marriages Due for Registration', flex: 1 },
]

const DMVcolumnsdata: GridColDef[] = [
    { field: 'appNo', headerName: 'Application No.', flex: 2 },
    { field: 'husbandName', headerName: 'Husband Name', flex: 2 },
    { field: 'wifeName_beforeMarriage', headerName: 'Wife Name', flex: 2 },
    { field: 'assignedTo', headerName: 'Assigned To', flex: 1.8 },
    { field: 'regDate', headerName: 'App. Date', flex: 1.2 },
    { field: 'status', headerName: 'Status', flex: 1 },
    { field: 'slotDate', headerName: 'Slot Date', flex: 1 },
    { field: 'slotTime', headerName: 'Slot Time', flex: 1 },
]

const certificatecolumns: GridColDef[] = [
    { field: 'appNumber', headerName: 'Application Number', flex: 1 },
    { field: 'docNumber', headerName: 'Document Number', flex: 1 },
    { field: 'docYear', headerName: 'Document Year', flex: 1 },
    { field: 'source', headerName: 'Request From', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    { field: 'createdAt', headerName: 'Request Date', flex: 1 },
]

const FeaturesList = {
    Reports: [{ value: "DIST/SRO", label: "DIST/SRO" }, { value: "DIST/MANDAL/VILLAGE", label: "DIST/MANDAL/VILLAGE" }]
}
const initialUserDetails = {
    reports: "DIST/SRO",
    radio_reports: "DIST/SRO",
}


const OfficeDashboard = () => {

    const pagesNextCursor = useRef({ "current": [] });
    const [page, setPage] = useState(0);
    const [noOfRows, setNoOfRows] = useState(0);
    const [globalSearch, setGlobalSearch] = useState("");

    const dispatch = useAppDispatch()
    let initialLoginDetails = useAppSelector((state) => state.login.loginDetails);
    const [LoginDetails, setLoginDetails] = useState(initialLoginDetails);
    const router = useRouter();
    let [UsersList, setUsersList] = useState<any>([]);
    const ShowAlert = (type, message, redirect) => { dispatch(PopupAction({ enable: true, type: type, message: message, redirect: redirect })); }
    const [searchData, setSearchData] = useState({
        husbandName: "",
        wifeName_beforeMarriage: "",
        documentNumber: "",
    })
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [activeTab, setActiveTab] = useState(0)
    const [SelectedNoDay, setSelectedNoDay] = useState("7")
    const [Selectedstatus, setSelectedStatus] = useState("PENDING")
    const [IsReportsDetailsVisible, setIsReportsDetailsVisible] = useState(false)
    const [MandalsVisible, setMandalsVisible] = useState(false)
    const [VillagesVisible, setVillagesVisible] = useState(false)
    const [VillageDataVisible, setVillageDataVisible] = useState(false)
    const [UserDetails, setUserDetails] = useState<any>(initialUserDetails)
    const [tableHeight, settableHeight] = useState(200)
    const [seleteddistrict, setseleteddistrict] = useState("")
    const [seletedmandal, setseletedmandal] = useState("")
    const [seletede, setseletede] = useState("")
    const [selectedYear, setselectedYear] = useState("");
    const [yearRange, setYearRange] = useState<number[]>([]);

    const today = new Date().toISOString().split("T")[0];

    const Loading = (value: boolean) => { dispatch(LoadingAction({ enable: value })); }

    // useEffect(() => {
    //     const loginDetails = JSON.parse(localStorage.getItem('loginDetails'));
    //     if (loginDetails && loginDetails.loginId) {
    //         Loading(false);
    //     } else {
    //         Loading(true);
    //     }
    // })

    const handlePageChange = async (newPage) => {
        let pageCount = (newPage + 1 * pageSize)
        if (((newPage === 0) || (pageCount <= noOfRows))) {
            setPage(newPage);
            if (activeTab === 3) {
                Loading(true)
                GetOfficerReportsData(globalSearch, newPage, fromDate, toDate);
            } else {
                let statusVal = "NEW";
                if (activeTab === 1)
                    statusVal = "PENDING";
                else if (activeTab === 2)
                    statusVal = "COMPLETED";
                CallGetUserList(statusVal, globalSearch, newPage);
            }
        }

    };
    const signs = ['>', '<', `'`, `"`, '%'];
    const onChange = (e: any) => {
        let user = { ...UserDetails };
        let addName = e.target.name;
        // let addValue = e.target.value;
        let addValue = e.target.value == (e.target.value == "SELECT") ? "" : e.target.value;
        user = ReportsHandleOther(addName, addValue, user, "reports", "radio_reports");
        signs.forEach(ob => {
            addValue = addValue.replace(ob, "");
        });
        setUserDetails({ ...user, [addName]: addValue })
    }

    const ReportsHandleOther = (addName, addValue, user, radioKey, ActualKey) => {
        if (addName == radioKey) {
            if (addValue == "DIST/SRO") {
                // handleclickreports()
                setIsReportsDetailsVisible(false)
                return { ...user, [ActualKey]: "DIST/SRO" }
            }
            else {
                // handledistrictreports(fromDate, toDate)
                setMandalsVisible(false)
                setVillagesVisible(false)
                setVillageDataVisible(false)
                if (ActualKey === 'reports') {
                    return { ...user, [ActualKey]: "", reports: "" }
                }
            }

        }
        return user;
    }


    const GetOfficerReportsData = async (search, pageNum, fromDateFormatted = null, toDateFormatted = null) => {

        if (fromDateFormatted && toDateFormatted) {
            fromDateFormatted = fromDateFormatted ? ChangeDateFormat(fromDateFormatted) : null;
            toDateFormatted = toDateFormatted ? ChangeDateFormat(toDateFormatted) : null;
            let result = await GetReportDataListByFilter(SelectedNoDay, pageNum, search, pageSize, fromDateFormatted, toDateFormatted, LoginDetails?.role || '');
            if (result && result.status) {
                Loading(false);
                if (result.data.length > 0) {
                    setNoOfRows(result.data[0].totalRecords);
                    setUsersList(result.data.map((o, i) => {
                        return { ...o, id: i }
                    }));
                }
                else {
                    setPage(0);
                    setNoOfRows(0);
                    setUsersList(result.data);
                }

            }
        } else {
            setPage(0);
            setNoOfRows(0);
            setUsersList([]);
            Loading(false);
        }
    }

    useEffect(() => {
        let data: any = localStorage.getItem("loginDetails");
        data = JSON.parse(data);
        if (data && data.token && (data.loginType == "OFFICER" || data.loginType == "officer")) {
            setLoginDetails(data);
            if (data && (data.role === 'VR')) {
                let statusVal = "NEW";
                if (activeTab === 1)
                    statusVal = "PENDING";
                else if (activeTab === 2)
                    statusVal = "COMPLETED";
                setPage(0);
                setGlobalSearch("");
                CallGetUserList(statusVal, globalSearch, page);
            } else {
                if (data?.role !== 'DR') {
                    setActiveTab(0);
                    handleclickreports()
                }
            }
        }
        else {
            onLogout()
        }
    }, [])

    const onLogout = () => {
        handleLogOut()
    }
    const ChangeDateFormat = (Date: string) => {
        if (Date) {
            let Arry = Date.split('-');
            return (Arry[2] + "-" + Arry[1] + "-" + Arry[0])
        }
        return Date;
    }
    const ListDataByStatus = (status: string) => {
        let data: any = localStorage.getItem("loginDetails");
        data = JSON.parse(data);
        setPage(0);
        setGlobalSearch("");
        CallGetUserList(status, globalSearch, page)
    }

    const handleclickreports = () => {
        Loading(true)
        setGlobalSearch("");
        setPage(0);
        GetOfficerReportsData(globalSearch, page, fromDate, toDate);
    }

    const handledistrictreports = (fromDate, toDate) => {
        Loading(true)
        setGlobalSearch("");
        setPage(0);
        getDistrictDetails(globalSearch, page, fromDate, toDate);
    }

    const handlemandalreports = (district, e) => {
        let countVal = e.value;
        let myStatus = e.field.toUpperCase();
        if (myStatus == 'CREATED' || myStatus == 'COMPLETED' || myStatus == 'PENDING' || countVal == 0) {
            return
        }
        Loading(true)
        setGlobalSearch("");
        setPage(0);
        setseleteddistrict(district)
        setseletede(e)
        getMandalDetails(district, globalSearch, page);
    }

    const handlevillagereports = (district, mandal, e) => {
        let countVal = e.value;
        let myStatus = e.field.toUpperCase();
        if (myStatus == 'CREATED' || myStatus == 'COMPLETED' || myStatus == 'PENDING' || myStatus == 'DISTRICT' || countVal == 0) {
            return
        }
        Loading(true)
        setGlobalSearch("");
        setPage(0);
        setseleteddistrict(district);
        setseletedmandal(mandal)
        setseletede(e)
        getVillageDetails(district, mandal, globalSearch, page);
    }

    const getReportDetails = async (e) => {
        let countVal = e.value;
        let myStatus = e.field.toUpperCase();
        if (myStatus == 'SRONAME' || myStatus == 'DISTRICT' || myStatus == 'SRONUMBER' || countVal == 0) {
            return
        }
        Loading(true)
        let districtVal = e.row.district;
        let sroOfiice = e.row.sroName;
        let sroNumber;
        for (var i = 0; i < UsersList.length; i++) {
            let regObject = UsersList[i];
            if (regObject.sroName == sroOfiice && regObject.district == districtVal) {
                sroNumber = regObject.sroNumber;
                break;
            }
        }

        let result = await GetReportUserViewList(sroNumber, myStatus, SelectedNoDay, fromDate, toDate);
        Loading(false);
        if (result && result.status) {
            setIsReportsDetailsVisible(true)
            setUsersList(result.data)
        }
    }

    const getDistrictReportViewDetails = async (e) => {
        let countVal = e.value;
        let district = e.row.district
        let myStatus = e.field.toUpperCase();
        if (myStatus == 'DISTRICT' || countVal == 0) {
            return
        }
        Loading(true)
        let result = await GetDistrictwiseViewList(district, myStatus, fromDate, toDate);
        Loading(false);
        if (result && result.status) {
            setUsersList(result.data)
            setMandalsVisible(true)
        }
    }
    const getMandalReportViewDetails = async (e) => {
        let countVal = e.value;
        let district = e.row.district;
        let mandal = e.row.mandal;
        let myStatus = e.field.toUpperCase();
        if (myStatus == 'DISTRICT' || myStatus == 'MANDAL' || countVal == 0) {
            return
        }
        Loading(true)
        let result = await GetMandalwiseViewList(district, mandal, myStatus, fromDate, toDate);
        Loading(false);
        if (result && result.status) {
            setUsersList(result.data)
            setVillagesVisible(true)
        }
    }

    const getVillageReportViewDetails = async (e) => {
        let countVal = e.value;
        let district = e.row.district;
        let mandal = e.row.mandal;
        let village = e.row.village;
        let villageWard;
        for (var i = 0; i < UsersList.length; i++) {
            let regObject = UsersList[i];
            if (regObject.village != undefined && village != undefined &&
                regObject.village.toUpperCase() === village.toUpperCase()
                && regObject.district.toUpperCase() === district.toUpperCase()
                && regObject.mandal.toUpperCase() === mandal.toUpperCase()) {
                villageWard = regObject.villageWard;
                break;
            }
        }

        let myStatus = e.field.toUpperCase();
        if (villageWard == undefined || myStatus == 'DISTRICT' || myStatus == 'MANDAL' || myStatus == "VILLAGE" || countVal == 0) {
            return
        }
        Loading(true)

        let result = await GetVillagewiseViewList(district, mandal, villageWard, myStatus, fromDate, toDate);
        Loading(false);
        if (result && result.status) {
            setUsersList(result.data)
            setVillageDataVisible(true)
        }
    }

    const getDistrictDetails = async (search: string, pageNum: number, fromDate?: string, toDate?: string) => {
        const formattedFromDate = fromDate ? new Date(fromDate).toISOString().split('T')[0] : null;
        const formattedToDate = toDate ? new Date(toDate).toISOString().split('T')[0] : null;
        let result = await GetDistrictReports(pageNum, search, pageSize, formattedFromDate, formattedToDate);
        Loading(false)
        if (result && result.status) {
            if (result.data.length > 0) {
                setNoOfRows(result.data[0].totalRecords);
                setUsersList(result.data.map((o, i) => {
                    return { ...o, id: i }
                }));
            }
            else {
                setPage(0);
                setNoOfRows(0);
                setUsersList(result.data);
            }
        }
    }

    const getMandalDetails = async (district: string, search: string, pageNum: number) => {
        Loading(true)
        let result = await GetMandalReports(district, pageNum, search, pageSize);
        Loading(false);
        setMandalsVisible(true)
        if (result && result.status) {
            if (result.data.length > 0) {
                setNoOfRows(result.data[0].totalRecords);
                setUsersList(result.data.map((o, i) => {
                    return { ...o, id: i }
                }));
            }
            else {
                setPage(0);
                setNoOfRows(0);
                setUsersList(result.data);
            }
        }
    }

    const getVillageDetails = async (district: string, mandal: string, search: string, pageNum: number) => {
        Loading(true)
        let result = await GetVillageReports(district, mandal, pageNum, search, pageSize);
        Loading(false);
        setVillagesVisible(true)
        if (result && result.status) {
            if (result.data.length > 0) {
                setNoOfRows(result.data[0].totalRecords);
                setUsersList(result.data.map((o, i) => {
                    return { ...o, id: i }
                }));
            }
            else {
                setPage(0);
                setNoOfRows(0);
                setUsersList(result.data);
            }
        }
    }

    const viewDetails = (id: any) => {
        localStorage.setItem("registrationId", id);
        router.push({
            pathname: '/ViewUserDetails',
        })
    }

    const CertificateRequestsdetails = (id: any) => {
        localStorage.setItem("registrationId", id);
        router.push({
            pathname: '/SSOCertificateRequestsDetails',
        })
    }

    const CallGetUserList = async (status: string, search: string, pageNum: number) => {
        let data: any = localStorage.getItem("loginDetails");
        data = JSON.parse(data);
        if (data && (data.role === 'SRO' || data.role === 'VR')) {
            Loading(true);
            let result = await GetUserList(status, search, pageNum, pageSize, selectedYear);
            Loading(false);
            if (result && result.status) {
                let data = result.data;
                let newData = []
                data && data.map((a) => {
                    let newJson = { ...a, slotDate: ChangeDateFormat(a.slotDate) }
                    newData.push(newJson);
                })
                if (newData.length > 0) {
                    setNoOfRows(newData[0].totalRecords);
                    setUsersList(newData);
                }
                else {
                    setPage(0);
                    setNoOfRows(0);
                    setUsersList(newData);
                }
            }
        }
    }

    const getCompletedUserData = async (husbandName: string, wifeName: string, documentNumber: string) => {
        Loading(true);
        let result = await GetSearchCompleted(husbandName, wifeName, documentNumber);
        Loading(false);
        if (result && result.status) {
            setUsersList(result.data.map((o, i) => {
                return { ...o, id: i }
            }))
        } else {
            return ShowAlert(false, result && result.message, "");
        }
    }

    const redirectToPage = (location: string, query: {}) => {
        router.push({
            pathname: location,
            // query: query,
        })
    }

    useEffect(() => {
        if ((activeTab === 0) && (LoginDetails && LoginDetails?.loginId && (LoginDetails?.role !== "VR" && LoginDetails?.role !== "DR") )) {
            handleclickreports()
        }
    }, [SelectedNoDay])

    // useEffect(() => {
    //     if (UserDetails.reports != 'DIST/SRO' && LoginDetails.role != 'SRO') {
    //         handledistrictreports(fromDate, toDate)
    //     }
    // }, [SelectedNoDay])


    useEffect(() => {
        let rowCount = Object.keys(UsersList).length;
        if (rowCount > 10 && rowCount <= 20) {
            settableHeight((250 + (10 * rowCount)))
        }
        else if (rowCount > 20) {
            settableHeight((10 * 50) + 150)
        }
        // else if (rowCount > 50) { 
        //     settableHeight((10 * 50)+150) 
        // }
        else { settableHeight(300) }
    }, [UsersList])

    // const DateCalculator = (condition) => {
    //     switch (condition) {
    //       case 'today':
    //         let date = new Date();
    //         let day = date.getDate().toString();
    //         let month = (date.getMonth() + 1).toString();
    //         if (month.length == 1) { month = '0' + month; }
    //         if (day.length == 1) { day = '0' + day; }
    //         let year = date.getFullYear();
    //         return `${year}-${month}-${day}`;
    //       default:
    //         break;
    //     }
    //   }


    // const handleChange = (e) => {
    //     const { name, value } = e.target
    //     setDate({ ...date, [name]: value });
    // };

    //DEBOUNCE CODE
    useEffect(() => {
        if (globalSearch.length > 4 || globalSearch.length == 0) {
            // Only call GetOfficerReportsData for non-SRO roles on REPORTS tab
            if ((activeTab === 0) && (LoginDetails && LoginDetails?.LoginId && LoginDetails?.role !== "VR" && LoginDetails?.role !== "SRO")) {
                Loading(true)
                const timer = setTimeout(() => {
                    setPage(0);
                    GetOfficerReportsData(globalSearch, page, fromDate, toDate);
                }, 200);
                return () => {
                    clearTimeout(timer)
                }
            }
            // Only call GetUserList for non-REPORTS tabs (activeTab > 0) or for SRO/VR on non-REPORTS tabs
            else if (activeTab > 0) {
                let statusVal = "NEW";
                if (activeTab === 1)
                    statusVal = "PENDING";
                else if (activeTab === 2)
                    statusVal = "COMPLETED";
                let data: any = localStorage.getItem("loginDetails");
                data = JSON.parse(data);
                const timer = setTimeout(() => {
                    setPage(0);
                    CallGetUserList(statusVal, globalSearch, page);
                }, 200);
                return () => {
                    clearTimeout(timer)
                }
            }
        }
    }, [globalSearch, LoginDetails])

    // Call API every time year changes
    useEffect(() => {
        // let data = localStorage.getItem("loginDetails");
        // data = data ? JSON.parse(data) : {};
        // console.log(data);
        if (!selectedYear) return;

        // SRO: tabs: 0-REPORTS, 1-NEW, 2-PENDING, 3-COMPLETED, 4-SEARCH, 5-CERTIFICATE REQUESTS
        if (LoginDetails && LoginDetails.LoginId && LoginDetails?.role === 'SRO') {
            // Only call API for NEW, PENDING, COMPLETED tabs (1,2,3)
            if (activeTab === 1 || activeTab === 2 || activeTab === 3) {
                let statusVal = '';
                if (activeTab === 1) statusVal = 'NEW';
                else if (activeTab === 2) statusVal = 'PENDING';
                else if (activeTab === 3) statusVal = 'COMPLETED';
                CallGetUserList(statusVal, globalSearch, page);
            }
        }
        // VR: tabs: 0-NEW, 1-PENDING, 2-COMPLETED, 3-SEARCH
        else if (LoginDetails && LoginDetails?.LoginId && LoginDetails?.role === 'VR') {
            // Only call API for NEW, PENDING, COMPLETED tabs (0,1,2)
            if (activeTab === 0 || activeTab === 1 || activeTab === 2) {
                let statusVal = '';
                if (activeTab === 0) statusVal = 'NEW';
                else if (activeTab === 1) statusVal = 'PENDING';
                else if (activeTab === 2) statusVal = 'COMPLETED';
                CallGetUserList(statusVal, globalSearch, page);
            }
        }
        // DR or other roles: implement as needed (example: only call for activeTab > 0)
        else {
            if (activeTab > 0) {
                let statusVal = '';
                if (activeTab === 1) statusVal = 'NEW';
                else if (activeTab === 2) statusVal = 'PENDING';
                else if (activeTab === 3) statusVal = 'COMPLETED';
                else statusVal = 'NEW';
                CallGetUserList(statusVal, globalSearch, page);
            }
        }
    }, [selectedYear, activeTab]);

    // Call officerStatistics API when switching to REPORTS tab (activeTab === 0) for SRO/DR
    useEffect(() => {
        let data = localStorage.getItem("loginDetails");
        data = data ? JSON.parse(data) : {};
        if ((LoginDetails && LoginDetails?.LoginId && (LoginDetails?.role === 'SRO')) && activeTab === 0) {
            if (typeof GetOfficerReportsData === 'function') {
                Loading(true);
                GetOfficerReportsData(globalSearch, page, fromDate, toDate);
            }
        }
    }, [activeTab]);

    const validateDates = (fromDate: string, toDate: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!fromDate || !toDate) return true; // skip if empty

        const from = new Date(fromDate);
        const to = new Date(toDate);

        // Year must be 4 digits
        const fromYear = fromDate.split("-")[0];
        const toYear = toDate.split("-")[0];

        if (fromYear.length !== 4 || toYear.length !== 4) {
            ShowAlert(false, "Invalid year format. Year must be 4 digits.", "");
            return false;
        }

        // No future dates
        // if (from > today || to > today) {
        //     ShowAlert(false, "Future dates are not allowed.", "");
        //     return false;
        // }

        // fromDate must not be greater than toDate
        if (from > to) {
            ShowAlert(false, "From Date cannot be greater than To Date.", "");
            return false;
        }

        return true;
    };


    useEffect(() => {
        let data: any = localStorage.getItem("loginDetails");
        data = JSON.parse(data);

        if (!fromDate || !toDate) return;

        if (!validateDates(fromDate, toDate)) return;
        if (fromDate && toDate) {
            Loading(true);
            let fromDateFormatted = ChangeDateFormat(fromDate);
            let toDateFormatted = ChangeDateFormat(toDate);

            if (UserDetails.reports === 'DIST/MANDAL/VILLAGE') {
                handledistrictreports(fromDate, toDate);
                return;
            }
            
            GetOfficerReportsData(globalSearch, page, fromDate, toDate);
            // if (data?.role === 'SRO' || data?.role === 'DR') {
            //     GetOfficerReportsData(globalSearch, page, fromDateFormatted, toDateFormatted);
            // } else if (UserDetails.reports != 'DIST/SRO' && data?.role !== 'SRO') {
            //     handledistrictreports(fromDate, toDate);
            // }
        }
    }, [fromDate, toDate, UserDetails]);

    // const handleFilterResult = () => {
    //     if (!fromDate || !toDate) {
    //         ShowAlert(false, "Please select both From Date and To Date to apply date filter.", "");
    //         return;
    //     }
    //     if (!validateDates(fromDate, toDate)) return;
    //     Loading(true);
    //     if (UserDetails.reports === 'DIST/MANDAL/VILLAGE') {
    //         handledistrictreports(fromDate, toDate);
            
    //         return;
    //     }
    //     GetOfficerReportsData(globalSearch, page, fromDate, toDate);
    // }

        
    const CallGetUserListbysro = async (status: string) => {
        Loading(true);
        let result = await GetAllCertificateRequestsbySRO(status);
        Loading(false);
        if (result && result.status) {
            if (result.data.length > 0) {
                setUsersList(result.data.map((o, i) => {
                    return { ...o, id: i }
                }));
            } else {
                setUsersList([]);
            }
        } else {
            setUsersList([]);
        }
    };

    useEffect(() => {
        if (LoginDetails && LoginDetails?.loginId && LoginDetails?.role !== "VR" && activeTab === 5) {
            CallGetUserListbysro(Selectedstatus);
        }
    }, [Selectedstatus]);

    const getYearRange = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let year = currentYear; year >= 2023; year--) {
            years.push(year);
        }
        return years;
    }

    useEffect(() => {
        if (LoginDetails && LoginDetails?.loginId) {
            const yearRange = getYearRange();
            setYearRange(yearRange);
        }
    }, [])

    const handleClearFilters = () => {
        setFromDate('');
        setToDate('');
        setGlobalSearch('');
        setUsersList([]);
    }

    return (
        <div style={{ marginBottom: '2rem' }}>
            <div className={styles.Navbar}>
                <div>
                    <text className={styles.NavbarText}> Welcome : {LoginDetails.loginName && LoginDetails.loginName.toUpperCase()} </text>
                    <FaRegEdit style={{ color: "white", alignSelf: 'center', marginLeft: '1em', cursor: 'pointer' }} onClick={() => { redirectToPage("/SroUpdateDetails", LoginDetails) }} />
                </div>
                <text className={styles.NavbarText}> Last Login : {LoginDetails.lastLogin}</text>
                {/* <button className={styles.paymentButtton} style={{ border: "none", marginTop: "2px", marginBottom: "3px", width: "53px", height: "27px", color: "green" }} onClick={() => { redirectToPage("/SroUpdateDetails", LoginDetails) }}>Edit</button> */}
                <div style={{ cursor: 'pointer' }} onClick={onLogout}><text className={styles.NavbarText}> Logout </text></div>
            </div>

            {IsReportsDetailsVisible ?
                <div style={{ margin: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                    {UserDetails.reports === 'DIST/SRO' &&
                        <div className={styles.EditButton} style={{ width: '150px' }} onClick={() => { handleclickreports(); setIsReportsDetailsVisible(false) }}><text className={styles.NavbarText}>Back to Reports</text></div>
                    }
                </div> :
                LoginDetails && LoginDetails.role && (LoginDetails.role === "SRO" || LoginDetails.role === "VR") &&
                <div>
                    <div className={styles.titlecontainer}><text className={styles.heading}> Officer Dashboard </text>

                        <div className={styles.btn} onClick={() => router.push("/SRORegistrations")}>Create New Registration</div>
                    </div>

                    {LoginDetails.role === 'VR' ?
                        <div className={styles.tabcontainer}>
                            {
                                ['NEW', 'PENDING', 'COMPLETED', 'SEARCH'].map((o, i) => {
                                    return (
                                        <button key={o} className={i === activeTab ? styles.activeButton : styles.button} onClick={() => {
                                            if (i < 3) {
                                                ListDataByStatus(o)
                                            }
                                            setActiveTab(i);
                                        }}>{o}</button>
                                    )
                                })
                            }
                        </div> :
                        <div>
                            <div className={styles.tabcontainer}>
                                {
                                    ['REPORTS', 'NEW', 'PENDING', 'COMPLETED', 'SEARCH', 'CERTIFICATE REQUESTS'].map((o, i) => {
                                        return (
                                            <button key={o} className={i === activeTab ? styles.activeButton : styles.button} onClick={() => {
                                                // Clear filters on tab change
                                                // if (i === 0) { // REPORTS tab
                                                //     setFromDate("");
                                                //     setToDate("");
                                                // } else if (i > 0 && i < 4) { // NEW, PENDING, COMPLETED
                                                //     setselectedYear("");
                                                // }
                                                if ((i > 0) && (i < 4)) {
                                                    ListDataByStatus(o)
                                                }
                                                else if (i === 5) {
                                                    CallGetUserListbysro(Selectedstatus)
                                                } else if (i === 0 && LoginDetails.role !== "SRO") {
                                                    handleclickreports()
                                                }
                                                setActiveTab(i);
                                            }}>{o}</button>
                                        )
                                    })
                                }
                            </div>
                            {/* <div className={styles.tabscontainer}/> */}
                        </div>
                    }
                </div>
            }

            <div>
                <Row style={{ marginLeft: '2rem', marginRight: '2rem', cursor: 'pointer', marginTop: '0.5rem', marginBottom: '0.5rem', padding: '0.5rem', justifySelf: 'flex-end' }}>
                    {LoginDetails.role != 'SRO' && LoginDetails.role !== 'VR' && !IsReportsDetailsVisible ?
                        (
                            <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <label style={{ marginRight: '0.5rem' }}>From Date:</label>
                                    <input type="date" value={fromDate} max={today} onChange={e => setFromDate(e.target.value)} />
                                    <label style={{ marginLeft: '1rem', marginRight: '0.5rem' }}>To Date:</label>
                                    <input type="date" value={toDate} min={fromDate} max={today} onChange={e => setToDate(e.target.value)} />
                                </div>
                                <div className={styles.EditButton} style={{color: "#fff"}} onClick={handleClearFilters}>
                                    Clear
                                </div>
                                {/* <div className={styles.EditButton} style={{color: "#fff"}} onClick={handleFilterResult}>Get details</div> */}
                                <div style={{ marginBottom: '1rem' }}>
                                    <TableInputRadio label='' required={true} name='reports' defaultValue={UserDetails.reports} onChange={onChange} options={FeaturesList.Reports} />
                                </div> 
                            </div>
                        )
                        : null
                    }
                    {MandalsVisible && !VillagesVisible && UserDetails.reports != 'DIST/SRO' ?
                        <div style={{ marginLeft: '1rem', display: 'flex', justifyContent: 'flex-end', }}>
                            <div className={styles.EditButton} style={{ width: '160px' }} onClick={() => { handledistrictreports(fromDate, toDate); setMandalsVisible(false) }}><text className={styles.NavbarText}>Back to Districts</text></div>
                        </div> : null
                    }
                    {VillagesVisible && !VillageDataVisible && UserDetails.reports != 'DIST/SRO' ?
                        <div style={{ marginLeft: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                            <div className={styles.EditButton} style={{ width: '160px' }} onClick={() => { handlemandalreports(seleteddistrict, seletede); setVillagesVisible(false) }}><text className={styles.NavbarText}>Back to Mandals</text></div>
                        </div> : null
                    }
                    {VillageDataVisible && UserDetails.reports != 'DIST/SRO' ?
                        <div style={{ marginRight: '-1rem', display: 'flex', justifyContent: 'flex-end' }}>
                            <div className={styles.EditButton} style={{ width: '170px' }} onClick={() => { handlevillagereports(seleteddistrict, seletedmandal, seletede); setVillageDataVisible(false) }}><text className={styles.NavbarText}>Back to Villages</text></div>
                        </div> : null
                    }
                    {(LoginDetails.role == 'SRO') && (activeTab === 1 || activeTab === 2 || activeTab === 3) ?
                        // <div style={{ position: "relative" }}>
                        //     <div className={styles.UploadText} style={{ color: 'red', position: "absolute" }} >*Note: This page contains the applications that have been registered.</div>
                        //     <div style={{ display: 'flex', justifyContent: 'flex-end', }}>
                        //         <Col lg={4} md={4} ms={12} >
                        //             <TableInputText placeholder='Search ...' required={false} value={globalSearch} name="searchField" type='text' onChange={(e) => { setGlobalSearch(e.target.value.toUpperCase()) }} />
                        //         </Col>
                        //     </div>
                        // </div>
                        <Col lg={12} md={12} ms={12} style={{display: 'flex', gap: '2rem'}}>
                            <select onChange={(e) => { setselectedYear(e.target.value) }} name="plan" id="plan" value={selectedYear} className={styles.DropDown}>
                                {yearRange && yearRange.length > 0 && yearRange.map((year) => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                            <TableInputText placeholder='Search ...' required={false} value={globalSearch} name="searchField" type='text' onChange={(e) => { setGlobalSearch(e.target.value.toUpperCase()) }} />
                        </Col>
                        : null
                    }
                    {
                        LoginDetails.role === "SRO" && activeTab === 0 ? (
                            <>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <label style={{ marginRight: '0.5rem' }}>From Date:</label>
                                    <input type="date" value={fromDate} max={today} onChange={e => setFromDate(e.target.value)} />
                                    <label style={{ marginLeft: '1rem', marginRight: '0.5rem' }}>To Date:</label>
                                    <input type="date" value={toDate} min={fromDate} max={today} onChange={e => setToDate(e.target.value)} />
                                    <div className={styles.EditButton} style={{ color: "#fff", width: "150px", marginLeft: "1rem"}} onClick={handleClearFilters}>
                                        Clear
                                    </div>
                                    {/* <div className={styles.EditButton} style={{color: "#fff"}} onClick={handleFilterResult}>Get details</div> */}
                                </div>
                            </>
                        ) : null
                    }
                    {LoginDetails.role != 'SRO' && LoginDetails.role !== 'VR' && activeTab === 3 && UserDetails.reports === 'DIST/SRO' && !IsReportsDetailsVisible ?
                        <Col lg={4} md={4} ms={12}>
                            <TableInputText placeholder='Search ..' required={false} value={globalSearch} name="searchField" type='text' onChange={(e) => { setGlobalSearch(e.target.value.toUpperCase()) }} />
                        </Col> : null
                    }
                    {/* {(LoginDetails.role == 'SRO') && activeTab === 1 ?
                        // <div style={{ position: "relative" }}>
                        //     <div className={styles.UploadText} style={{ color: 'red', position: "absolute" }} >*Note: This page contains pending applications for Registration.</div>
                        //     <div style={{ display: 'flex', justifyContent: 'flex-end', }}>
                        //         <Col lg={4} md={4} ms={12} >
                        //             <TableInputText placeholder='Search ...' required={false} value={globalSearch} name="searchField" type='text' onChange={(e) => { setGlobalSearch(e.target.value.toUpperCase()) }} />
                        //         </Col>
                        //     </div>
                        // </div>
                        <Col lg={12} md={12} ms={12} >
                        <TableInputText placeholder='Search ...' required={false} value={globalSearch} name="searchField" type='text' onChange={(e) => { setGlobalSearch(e.target.value.toUpperCase()) }} />
                    </Col>
                        : null
                    } */}
                    {(LoginDetails.role === 'VR') && activeTab < 3 ?
                        // <div style={{ position: "relative" }}>
                        //     <div className={styles.UploadText} style={{ color: 'red', position: "absolute" }} >*Note: This page contains new applications for Registration.</div>
                        //     <div style={{ display: 'flex', justifyContent: 'flex-end', }}>
                        //         <Col lg={4} md={4} ms={12} >
                        //             <TableInputText placeholder='Search ...' required={false} value={globalSearch} name="searchField" type='text' onChange={(e) => { setGlobalSearch(e.target.value.toUpperCase()) }} />
                        //         </Col>
                        //     </div>
                        // </div>
                        <Col lg={12} md={12} ms={12} >
                        <TableInputText placeholder='Search ...' required={false} value={globalSearch} name="searchField" type='text' onChange={(e) => { setGlobalSearch(e.target.value.toUpperCase()) }} />
                    </Col>
                        : null
                    }
                    {(LoginDetails.role === 'SRO' || LoginDetails.role === 'VR') && activeTab === 3 ?
                        <Col lg={4} md={2} ms={12}> </Col> : null
                    }
                    <Col lg={4} md={2} ms={12}> </Col>
                    {/* {activeTab === 3 && !IsReportsDetailsVisible ?
                            <div style={{width:"10rem"}} >
                                <TableSelectDate max={DateCalculator('today')} name='startdate' value={date.startdate} placeholder='Select Date' required={true} onChange={handleChange} />
                            </div>
                   :<Col lg={2} md={4} ms={12}> </Col>
                    }
                   <Col lg={2} md={4} ms={12}>
                    {activeTab === 3 && !IsReportsDetailsVisible ?
                            <div style={{width:"10rem"}} >
                               <TableSelectDate max={DateCalculator('today')} name='enddate' value={date.enddate} placeholder='Select Date' required={true}  onChange={handleChange} />
                            </div>
                   :<Col lg={2} md={4} ms={12}> </Col>
                    } */}
                    {activeTab === 0 && !IsReportsDetailsVisible && UserDetails.reports === 'DIST' && LoginDetails.role !== 'VR' ?
                        <Col lg={4} md={6} ms={12}>
                            <div className="text-end" style={{marginRight: "2rem"}}>
                                <select onChange={(e) => { setSelectedNoDay(e.target.value) }} name="plan" id="plan" value={SelectedNoDay} className={styles.DropDown}>
                                    <option value="7" selected>Last 7 Days </option>
                                    <option value="15">Last 15 Days</option>
                                    <option value="30">Last 30 Days</option>
                                    <option value="90">Last 90 Days</option>
                                    <option value="0">All</option>
                                </select>
                            </div>
                        </Col> : null
                        // <Col lg={4} md={2} ms={12}> </Col> 
                    }
                    {activeTab === 5 && LoginDetails.role === 'SRO' ?
                        <Col lg={8} md={6} ms={12}>
                            <div className="text-end">
                                <select
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    name="plan" id="plan" value={Selectedstatus} className={styles.DropDown}>
                                    <option value="PENDING" selected>PENDING </option>
                                    <option value="COMPLETED">COMPLETED</option>
                                    <option value="PROCESSED">PROCESSED</option>
                                    <option value="">ALL</option>
                                </select>
                            </div>
                        </Col> : null
                        // <Col lg={4} md={2} ms={12}> </Col>
                    }
                </Row>

                {(LoginDetails.role === 'SRO' && activeTab === 4) || (LoginDetails.role === 'VR' && activeTab === 3) ?
                    <div style={{ justifySelf: "flex-start", width: "100%" }}>
                        <Row>
                            <div className={styles.UploadText} style={{ color: 'red', marginLeft: "2rem" }} >*Note: Only completed Marriage Registrations data can be retrieved.</div>
                        </Row>
                        <Row style={{ margin: '1.5rem' }}>
                            <Col>
                                <div style={{ position: 'relative' }}>
                                    <TableText label=" Husband Name :" required={false} LeftSpace={false} />
                                    <div style={{ position: 'absolute', top: '0rem', left: '7.5rem', width: '75%' }}>
                                        <TableInputText type='text' placeholder='Enter Husband Name' required={true} name={'husbandName'} value={searchData.husbandName} onChange={(e) => { setSearchData({ ...searchData, husbandName: e.target.value.toUpperCase() }) }} />
                                    </div>
                                </div>
                            </Col>
                            <Col>
                                <div style={{ position: 'relative', left: '3rem' }}>
                                    <TableText label=" Wife Name :" required={false} LeftSpace={false} />
                                    <div style={{ position: 'absolute', top: '0rem', left: '5.7rem', width: '75%' }}>
                                        <TableInputText type='text' placeholder='Enter Wife Name' required={true} name={'wifeName_beforeMarriage'} value={searchData.wifeName_beforeMarriage} onChange={(e) => { setSearchData({ ...searchData, wifeName_beforeMarriage: e.target.value.toUpperCase() }) }} />
                                    </div>
                                </div>
                            </Col>
                            <Col>
                                <div style={{ position: 'relative', left: '4rem' }}>
                                    <TableText label=" HM Registration No. :" required={false} LeftSpace={false} />
                                    <div style={{ position: 'absolute', top: '0rem', left: '9.2rem', width: '75%' }}>
                                        <TableInputText type='text' placeholder='Enter HM Registration No.' required={true} name={'documentNumber'} value={searchData.documentNumber} onChange={(e) => { setSearchData({ ...searchData, documentNumber: e.target.value.toUpperCase() }) }} />
                                    </div>
                                </div>
                            </Col>
                            <Col>
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <div className={styles.EditButton} style={{ width: '30%', borderRadius: '6px' }} onClick={(e) => { getCompletedUserData(searchData.husbandName, searchData.wifeName_beforeMarriage, searchData.documentNumber) }}><text className={styles.NavbarText}>Search</text></div>
                                </div>
                            </Col>
                        </Row>
                    </div> : null
                }
            </div>
            <div style={{ height: "400px", margin: '2rem', marginTop: '0', marginBottom: '50px', display: 'flex', justifyContent: 'center' }}>
                {/* {
                    ((activeTab === 0) && (LoginDetails && LoginDetails?.loginId && LoginDetails?.role === "VR")) && (
                        // <>
                            // {console.log({ UsersList, activeTab })}
                            <DataGrid
                                className={styles.GridTable}
                                onRowClick={(e) => { viewDetails(e.row.id) }}
                                rows={UsersList}
                                columns={columns}
                                pageSize={pageSize}
                                rowsPerPageOptions={[pageSize]}
                                sx={datagridSx}
                                paginationMode="server"
                                rowCount={noOfRows}
                                onPageChange={handlePageChange}
                                page={page}
                                rowHeight={35}
                            />
                        // </>
                    )
                } */}
                {((activeTab === 0) && (LoginDetails && LoginDetails?.loginId && LoginDetails?.role === "VR")) ? 
                    <DataGrid
                                className={styles.GridTable}
                                onRowClick={(e) => { viewDetails(e.row.id) }}
                                rows={UsersList}
                                columns={columns}
                                pageSize={pageSize}
                                rowsPerPageOptions={[pageSize]}
                                sx={datagridSx}
                                paginationMode="server"
                                rowCount={noOfRows}
                                onPageChange={handlePageChange}
                                page={page}
                                rowHeight={35}
                            />
                : activeTab > 0 && activeTab < 3 ?
                    <DataGrid
                        className={styles.GridTable}
                        onRowClick={(e) => { viewDetails(e.row.id) }}
                        rows={UsersList}
                        columns={columns}
                        pageSize={pageSize}
                        rowsPerPageOptions={[pageSize]}
                        sx={datagridSx}
                        paginationMode="server"
                        rowCount={noOfRows}
                        onPageChange={handlePageChange}
                        page={page}
                        rowHeight={35}
                    />
                    : activeTab === 3 ?
                        <DataGrid
                            className={styles.GridTable}
                            onRowClick={(e) => { viewDetails(e.row.id) }}
                            rows={UsersList}
                            columns={completedcolumns}
                            pageSize={pageSize}
                            rowsPerPageOptions={[pageSize]}
                            sx={datagridSx}
                            paginationMode="server"
                            rowCount={noOfRows}
                            onPageChange={handlePageChange}
                            page={page}
                            rowHeight={35}
                        />
                        : activeTab === 4 || (LoginDetails.role === 'VR' && activeTab === 3) ?
                            <DataGrid
                                className={styles.GridTable}
                                // onRowClick={(e) => { viewDetails(e.row.id) }}
                                rows={UsersList}
                                columns={completedcolumns}
                                pageSize={50}
                                rowsPerPageOptions={[20]}
                                sx={datagridSx}
                                rowHeight={35}
                            /> : activeTab === 5 ?
                                <DataGrid
                                    className={styles.GridTable}
                                    onRowClick={(e) => { CertificateRequestsdetails(e.row._id) }}
                                    rows={UsersList}
                                    columns={certificatecolumns}
                                    pageSize={50}
                                    rowsPerPageOptions={[20]}
                                    sx={datagridSx}
                                    rowHeight={35}
                                /> :
                                <div style={{ width: '100%' }}>
                                    {UserDetails.reports === 'DIST/SRO' && LoginDetails.role !== 'VR' &&
                                        <div style={{ height: "400px" }}>
                                            {!IsReportsDetailsVisible ?
                                                <DataGrid
                                                    className={styles.GridTable}
                                                    rows={UsersList}
                                                    columns={reportcolumns}
                                                    onCellClick={(e) => { getReportDetails(e) }}
                                                    pageSize={pageSize}
                                                    rowsPerPageOptions={[pageSize]}
                                                    sx={datagridSx}
                                                    paginationMode="server"
                                                    rowCount={noOfRows}
                                                    onPageChange={handlePageChange}
                                                    page={page}
                                                    rowHeight={35}
                                                /> :
                                                <DataGrid
                                                    className={styles.GridTable}
                                                    onRowClick={(e) => { viewDetails(e.row.id) }}
                                                    rows={UsersList}
                                                    columns={Reportcolumnsdata}
                                                    pageSize={pageSize}
                                                    rowsPerPageOptions={[pageSize]}
                                                    sx={datagridSx}
                                                    rowHeight={35}
                                                />
                                            }
                                        </div>
                                    }
                                    {UserDetails.reports != 'DIST/SRO' && LoginDetails.role != 'SRO' && LoginDetails.role !== 'VR' &&
                                        <div style={{ height: "400px" }}>
                                            {!MandalsVisible ?
                                                <DataGrid
                                                    className={styles.GridTable}
                                                    onCellClick={(e) => { handlemandalreports(e.row.district, e), getDistrictReportViewDetails(e) }}
                                                    rows={UsersList}
                                                    columns={districtcolumns}
                                                    pageSize={pageSize}
                                                    rowsPerPageOptions={[pageSize]}
                                                    sx={datagridSx}
                                                    paginationMode="server"
                                                    rowCount={noOfRows}
                                                    onPageChange={handlePageChange}
                                                    page={page}
                                                    rowHeight={35}
                                                /> :
                                                <div style={{ height: "400px" }}>
                                                    {!VillagesVisible ?
                                                        <div style={{ height: "400px" }}>
                                                            {!UsersList[0]?.husbandName ?
                                                                <DataGrid
                                                                    className={styles.GridTable}
                                                                    onCellClick={(e) => { handlevillagereports(e.row.district, e.row.mandal, e), getMandalReportViewDetails(e) }}
                                                                    rows={UsersList}
                                                                    columns={mandalcolumns}
                                                                    pageSize={50}
                                                                    rowsPerPageOptions={[20]}
                                                                    sx={datagridSx}
                                                                    rowHeight={35}
                                                                /> :
                                                                <DataGrid
                                                                    className={styles.GridTable}
                                                                    onRowClick={(e) => { viewDetails(e.row.id) }}
                                                                    rows={UsersList}
                                                                    columns={DMVcolumnsdata}
                                                                    pageSize={pageSize}
                                                                    rowsPerPageOptions={[pageSize]}
                                                                    sx={datagridSx}
                                                                    rowHeight={35}
                                                                />}
                                                        </div>
                                                        :
                                                        <div style={{ height: "400px" }}>
                                                            {!VillageDataVisible ?
                                                                <div style={{ height: "400px" }}>
                                                                    {!UsersList[0]?.husbandName ?
                                                                        <DataGrid
                                                                            className={styles.GridTable}
                                                                            onCellClick={(e) => { getVillageReportViewDetails(e) }}
                                                                            rows={UsersList}
                                                                            columns={villagecolumns}
                                                                            pageSize={50}
                                                                            rowsPerPageOptions={[20]}
                                                                            sx={datagridSx}
                                                                            rowHeight={35}
                                                                        /> :
                                                                        <DataGrid
                                                                            className={styles.GridTable}
                                                                            onRowClick={(e) => { viewDetails(e.row.id) }}
                                                                            rows={UsersList}
                                                                            columns={DMVcolumnsdata}
                                                                            pageSize={pageSize}
                                                                            rowsPerPageOptions={[pageSize]}
                                                                            sx={datagridSx}
                                                                            rowHeight={35}
                                                                        />}
                                                                </div> :
                                                                <DataGrid
                                                                    className={styles.GridTable}
                                                                    onRowClick={(e) => { viewDetails(e.row.id) }}
                                                                    rows={UsersList}
                                                                    columns={DMVcolumnsdata}
                                                                    pageSize={pageSize}
                                                                    rowsPerPageOptions={[pageSize]}
                                                                    sx={datagridSx}
                                                                    rowHeight={35}
                                                                />
                                                            }
                                                        </div>
                                                    }
                                                </div>
                                            }
                                        </div>
                                    }
                                </div>
                }
            </div>
            {/* <pre>{JSON.stringify(LoginDetails, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(UsersList, null, 2)}</pre> */}
        </div>
    )
}

export default OfficeDashboard;


