import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface TypeOFinitialState {
    value: string;
    PopupMemory: any;
    ConfirmMemory:any;
    Loading: any;
}

const initialState: TypeOFinitialState = {
    value: "Hello World",
    PopupMemory: {
        enable: false,
        type: true,
        message: "",
        redirect: "",
    },
    ConfirmMemory: {
        enable: false,
        message: "",
        result:"",
        buttons:[],
    },
    Loading: {
        enable: false
    },
}
export const commonSlice = createSlice({
    name: "common",
    initialState,
    reducers: {
        ChangeTo: (state, action: PayloadAction<any>) => {
            state.value = action.payload;
        },
        PopupAction: (state, action: PayloadAction<any>) => {
            state.PopupMemory = action.payload;
        },
        ConfirmAction: (state, action: PayloadAction<any>) => {
            state.ConfirmMemory = action.payload;
        },
        LoadingAction: (state, action: PayloadAction<any>) => {
            state.Loading = action.payload;
        },
    }
})

export const { ChangeTo, PopupAction, ConfirmAction, LoadingAction } = commonSlice.actions;
export default commonSlice.reducer;