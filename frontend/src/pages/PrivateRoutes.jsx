import {Navigate , Outlet} from "react-router-dom";
// import  axios  from 'axios';
import { useEffect , useState} from "react";
import { tokenUtils } from "../utils/tokenUtils";

export default function PrivateRoutes(){
    // const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [auth , setAuth] = useState(null);

    // useEffect(()=>{
    //     axios.get(`${BASE_URL}/auth/check`, {withCredentials : true})
    //     .then(() => setAuth(true))
    //     .catch(()=> setAuth(false));
    // } , []);

    useEffect(()=>{
        const token = tokenUtils.getToken();
        setAuth(!!token);
    },[ ]);

       if(auth === null) return (
        <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
            Checking Authentication ....
        </div>
    );
    return auth ? <Outlet /> : <Navigate to="/" />

}
