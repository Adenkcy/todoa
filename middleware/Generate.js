import jwt from "jsonwebtoken";
import {user} from '../database/model/User.js'
import Boom from "@hapi/boom";

export const verifyToken = async (request,h,token)=>{
        try{
        
        }catch (e) {
            console.log(e)
        return Boom.internal('invalid response ')
        }

}

