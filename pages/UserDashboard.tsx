import React, { useEffect, useState } from 'react';
import styles from '../styles/pages/UserDashboard.module.scss';
import { useRouter } from 'next/router';
import { useAppSelector, useAppDispatch } from '../src/redux/hooks';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import {GetUserRegistrations} from '../src/axios';
import { handleLogOut } from '../utils';
import { LoadingAction } from '../src/redux/commonSlice';

const datagridSx = {
    borderRadius: 2,
    "& .MuiDataGrid-main": { borderRadius: 2 },
    // '& div[data-rowIndex][role="row"]:nth-of-type(5n-4)': {
    //   color: "blue",
    //   fontSize: 18,
    //   //risky
    //   minHeight: "60px !important",
    //   height: 60,
    //   "& div": {
    //     minHeight: "60px !important",
    //     height: 60,
    //     lineHeight: "59px !important"
    //   }
    // },
    "& .MuiDataGrid-virtualScrollerRenderZone": {
        "& .MuiDataGrid-row": {
            // "&:nth-child(2n)": { backgroundColor: "rgba(235, 235, 235, .7)" }
        }
    },
    "& .MuiDataGrid-columnHeaders": {
       // backgroundColor: "#D3d3d3",
       color: "#FFFFFF",
       fontStyle: "bold",
       fontSize: 16,
       background: "linear-gradient(90deg, #394C91 0.86%, #27D3E0 100%)",
    }
};

const columns: GridColDef[] = [
    { field: 'appNo', headerName: 'Application No.', flex: 1 },
    { field: 'husbandName', headerName: 'Husband Name', flex: 1 },
    { field: 'wifeName_beforeMarriage', headerName: 'Wife Name', flex: 1 },
    { field: 'assignedTo', headerName: 'Assigned To', flex: 1 },
    { field: 'regDate', headerName: 'Reg. Date', flex: 1},
    { field: 'status', headerName: 'Status', flex: 1 }
];

const UserDashboard = () => {
    const dispatch = useAppDispatch()
    const Loading = (value: boolean) => { dispatch(LoadingAction({ enable: value })); }
    let initialLoginDetails = useAppSelector((state) => state.login.loginDetails);
    const [LoginDetails, setLoginDetails] = useState(initialLoginDetails);
    //const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();
    const [tableHeight, settableHeight] = useState(200)

    useEffect(() => {
        
        if(!LoginDetails && !(LoginDetails.registrationDetails) && LoginDetails.registrationDetails!="")
        {
            let rowCount = LoginDetails.registrationDetails.length;
            if (rowCount > 10 && rowCount < 20) { 
                settableHeight((250 + (10 * rowCount))) 
            }
            else if (rowCount > 20) { 
                settableHeight((10 * rowCount)+150) 
            }
            else if (rowCount > 5 && rowCount < 10) { 
                 settableHeight(350) 
            }
            else { settableHeight(300) }
        }
        else { settableHeight(300) }
    }, [LoginDetails.registrationDetails])

    
    const GetUserRegistrationsList = async (loginData:any ) => {
        let regData = await GetUserRegistrations();
        if (regData && regData.status) {
            let data = regData.data;
            if(data!)
                loginData.registrationDetails = data;
        }
        setLoginDetails(loginData);
        Loading(false); 
    } 

    useEffect(() => {
        Loading(true);        
        let data: any = localStorage.getItem("loginDetails");
        if (data) {
            data = JSON.parse(data);
            if(data && data.token && (data.loginType == "USER" || data.loginType == "user")){
                //setLoginDetails(data);
                GetUserRegistrationsList(data);
            } else{
                handleLogOut()
            }
        }
        else{
            handleLogOut()
        }
    }, [])

    const ShiftToLocation = (location: string, query: {}) => {

        router.push({
            pathname: location,
            // query: query,
        })
    }

    return (
        <div>
            <div className={styles.Navbar}>
                <text className={styles.NavbarText}> Welcome : {LoginDetails.loginName.toUpperCase()}</text>
                <text className={styles.NavbarText}> Last Login : {LoginDetails.lastLogin}</text>
                <div style={{ cursor: 'pointer' }} onClick={() => { handleLogOut() }} ><text className={styles.NavbarText}> Logout </text></div>
            </div>
            <div className={styles.Container}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* <text className={styles.TitleText1}>User Registration</text> */}
                    <text className={styles.TitleText1}>User Dashboard</text>
                    <button onClick={() => {
                         localStorage.removeItem("registrationId");
                         localStorage.removeItem("redirectFrom");
                         localStorage.removeItem("Prieview");
                        ShiftToLocation("/Registrations", {})
                        }} className={styles.button}>Apply for New Registration </button>
                </div>
                <div style={{ height: tableHeight, margin: '4px', marginTop: '0',marginBottom:'6rem', display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>  
                    {LoginDetails.registrationDetails && LoginDetails.registrationDetails.length ?
                        <DataGrid
                            className={styles.GridTable}
                            onRowClick={(e) => {
                                localStorage.setItem("registrationId", e.row.id);
                                if (e.row.status == "DRAFT") {
                                    localStorage.setItem("redirectFrom","Registrations");
                                    //localStorage.setItem("isFromDashboard", "Yes");
                                    router.push("/Registrations")
                                }
                                else
                                    router.push("/ViewUserDetails")
                            }}
                            rows={LoginDetails.registrationDetails}
                            columns={columns}
                            pageSize={20}
                            rowsPerPageOptions={[20]}
                            sx={datagridSx}
                        /> :
                        <DataGrid
                            className={styles.GridTable}
                            rows={LoginDetails}
                            columns={columns}
                            pageSize={20}
                            rowsPerPageOptions={[20]}
                            sx={datagridSx}
                        />
                    }
                </div>
            </div>
            {/* <pre>{JSON.stringify(LoginDetails, null, 2)}</pre> */}
            {
                /*
                isModalOpen && 
                <div className={styles.modalOverlay}>
                    <div className={styles.modalCard}>
                        <span>Would like to register your marriage in Tirumala?</span>
                        <div className={styles.actionBtns}>
                            <button onClick={() => {ShiftToLocation("/TirumalaRegistration", {})}}>Yes</button>
                            <button onClick={() => {ShiftToLocation("/Registrations", {})}}>No</button>
                        </div>
                    </div>
                </div>
                */
            }
        </div>
    )
}

export default UserDashboard;