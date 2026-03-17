import instance from './api';
import { CallTokenInvalidate } from '../axios';
import { handleLogOut } from '../../utils';

const SetUp = () => {
    instance.interceptors.request.use(
        function(config) {
          const data = localStorage.getItem("loginDetails");
          let parsedData;
          try{
            parsedData = JSON.parse(data);
            if (parsedData && parsedData.token && parsedData.token.token) {
                config.headers["Authorization"] = 'Bearer ' + parsedData.token.token;
              }
          } catch{
            parsedData= false;
          }
          return config;
        },
        function(error) {
          return Promise.reject(error);
        }
      );
      
      instance.interceptors.response.use(async (response) => {
          return response;
       }, async(error)=>{
        const originalConfig = error.config;
        if (error && error.response && error.response.status === 401 && !originalConfig._retry) {
         originalConfig._retry = true;
         try{
            const g = localStorage.getItem("loginDetails");
            let parsedData; 
            try{
                parsedData = JSON.parse(g);
                console.log("Refresh url :: ", parsedData);
               if(parsedData && parsedData.token && parsedData.token.refreshTokenUrl){
                    const rs = await instance.get('/token');
                    console.log("access token after refresh url :: ", rs);
                    if(rs.data.data.token){
                        parsedData.token.token = rs.data.data.token;
                        localStorage.setItem("loginDetails",JSON.stringify(parsedData));
                        return instance(originalConfig)
                    }
                    else{
                        console.log("session timeout12 :: ", parsedData);
                        //CallTokenInvalidate();
                        // setTimeout(() =>{localStorage.clear();},200);
                        // setTimeout(() => {
                        //     window.location.href = "/hmr"
                        // }, 0) 
                    }
                }
                else{
                    console.log("session timeout123 :: ", parsedData);
                }
            } catch(_error1){
                handleLogOut()
                return Promise.reject(_error1);
            }
         }catch (_error) {
            handleLogOut()
            return Promise.reject(_error);
         }
       }
       else if (error.response.status === 401){
            handleLogOut()
       }
       return Promise.reject(error);
    });
} 

export default SetUp;