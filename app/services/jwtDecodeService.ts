import {jwtDecode} from "jwt-decode";
import {DecodedToken} from "@/app/interface/Token.interface";

export const jwtDecodeService = (): DecodedToken | null=> {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if(token){
        return jwtDecode(token);
    }
    return null;
}