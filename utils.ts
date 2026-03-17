import { CallTokenInvalidate } from "./src/axios";
import { resetLoginDetails } from "./src/redux/loginSlice";
import { store } from "./src/redux/store";

export const handleLogOut = () => {
    CallTokenInvalidate();
    setTimeout(() => {
        localStorage.clear(); window.location.href = '/hmr'
    }, 200);
    setTimeout(() => {
        store.dispatch(resetLoginDetails());
    }, 500)
}