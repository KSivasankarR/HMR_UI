import { createSlice, PayloadAction } from "@reduxjs/toolkit"
interface TypeOFinitialState {
    loginDetails:any
}

const initialState: TypeOFinitialState = {
    loginDetails:{
        loginId: '',
        loginEmail: '',
        loginName: '',
        token: '',
        lastLogin:'',
        role:'',
        // appNo: '',
        // status: '',
        loginType: '',
        sroOffice: '',
        sroNumber: '',
        registrationDetails:''
    },
}
export const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        saveLoginDetails: (state, action: PayloadAction<any>) => {
            state.loginDetails = action.payload;
        },
        resetLoginDetails: (state) => {
            state.loginDetails = {
                loginId: '',
                loginEmail: '',
                loginName: '',
                token: '',
                lastLogin:'',
                role:'',
                // appNo: '',
                // status: '',
                loginType: '',
                sroOffice: '',
                sroNumber: '',
                registrationDetails:''
            }
        }
    }
})

export const { saveLoginDetails, resetLoginDetails } = loginSlice.actions;
export default loginSlice.reducer;