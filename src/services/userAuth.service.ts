import env from "../lib/env";
import UserModel, { UserDocument } from "../models/userModel";
import axios from "axios";
import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import qs from 'qs'

interface GoogleTokensResult{
    access_token: string,
    expires_in:Number,
    refresh_token: string,
    scope: string,
    id_token: string
}
interface GoogleUserResults {
  iss: string,
  email: string,
  email_verified:boolean,
  name: string,
  picture: string,
  given_name: string,
  family_name: string,
  locale:string,
}
export async function  getGoogleOauthTokens ({code}:{code: string}) : Promise<GoogleTokensResult>{

const url = 'https://oauth2.googleapis.com/token';

    const values = {
        code,
        client_id:env.GOOGLE_OAUTH_CLIENT_ID,
        client_secret:env.GOOGLE_OAUTH_CLIENT_SECRET,
        redirect_uri:env.GOOGLE_OAUTH_REDIRECT_URL,
        grant_type:'authorization_code'

        // grant_type:'implicit'
    }

    try {
        const res = await axios.post<GoogleTokensResult>(url, qs.stringify(values),{
            headers:{
                'Content-Type':'application/x-www-form-urlencoded',
            }

        })

        return res.data;
        
    } catch (error : any) {
        console.log(error)
        throw new Error(error.response.data.error)
        
    }

}
export async function  getGoogleOauthTokensForSignin ({code}:{code: string}) : Promise<GoogleTokensResult>{

const url = 'https://oauth2.googleapis.com/token';

    const values = {
        code,
        client_id:env.GOOGLE_OAUTH_CLIENT_ID,
        client_secret:env.GOOGLE_OAUTH_CLIENT_SECRET,
        redirect_uri:env.GOOGLE_OAUTH_REDIRECT_URL,
        grant_type:'authorization_code'


    }

    try {
        const res = await axios.post<GoogleTokensResult>(url, qs.stringify(values),{
            headers:{
                'Content-Type':'application/x-www-form-urlencoded',
            }

        })
        // console.log(res.data)
        return res.data;
        
    } catch (error : any) {
        console.log(error)
        throw new Error(error)
        
    }

}
export async function  getGoogleOauthTokensForSignup ({code}:{code: string}) : Promise<GoogleTokensResult>{

const url = 'https://oauth2.googleapis.com/token';

const values = {
    code,
    client_id:env.GOOGLE_OAUTH_CLIENT_ID,
    client_secret:env.GOOGLE_OAUTH_CLIENT_SECRET,
    redirect_uri:env.GOOGLE_OAUTH_REDIRECT_URL,
    grant_type:'authorization_code'

}


    try {
        const res = await axios.post<GoogleTokensResult>(url, qs.stringify(values),{
            headers:{
                'Content-Type':'application/x-www-form-urlencoded',
            }

        })
        // console.log(res.data)
        return res.data;
        
    } catch (error : any) {
        console.log(error)
        throw new Error(error)
        
    }

}

export async function getGoogleUser({id_token, access_token}: {id_token: string, access_token :string}): Promise<GoogleUserResults>{

    try {
        const res = await axios.get<GoogleUserResults>(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, {
            headers:{
                Authorization:`Bearer ${id_token}`
            }
        })

        return res.data
    
        
    } catch (error: any) {
        throw new Error(error.message                               )
    } 

}

export async function findAndUpdateGoogleUser(
    query:FilterQuery<UserDocument>,
    update:UpdateQuery<UserDocument>,
    options: QueryOptions = {}

){
    return UserModel.findOneAndUpdate(query, update, options);

}
