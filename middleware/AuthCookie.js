import Cookie from '@hapi/cookie'
import {verifyToken} from "./Generate.js";
import jwt from "jsonwebtoken";
import {user} from "../database/model/User.js";


const protect = {
	name: 'jwt',
	version: '1.0.0',
	register: async (server, options) => {
		await server.register(Cookie)
		server.auth.strategy('session', 'cookie', {
			cookie: {
				name: 'session',
				password: 'ThisIsCokeIgniteYourPassionWithSprite',
				isSecure: process.env.NODE_ENV !== 'development',
                ttl:60*60*1000,
				clearInvalid:true
			},
					validate: async (request, session) => {
			try{
				const token = session.token
				const decoded = jwt.verify(token,process.env.JWT_SECRET)
				request.user = await user.findById(decoded.Users).select('-password')
				console.log(request.user)
							if (!decoded){
					return {isValid:false}
				}
				return  {isValid:true,credentials:decoded.Users}
			}catch (e) {
			return {isValid:false}
			}
				
			}
		})
		server.auth.default('session')
		
		
	}
}

export {protect}
