import Joi from "joi";
import Boom from "@hapi/boom";
import {user} from "../database/model/User.js";
import jwt from "jsonwebtoken";


const RegisterPlugin = {
    name: 'register',
    version: '1.0.2',
    register: async function (server, options) {
        server.route({
            method: 'POST',
            path: '/register',
            handler: async (request, h) => {
                const {name, email, password} = request.payload
                const options = {
                    errors: {
                        wrap: {
                            label: false
                        }
                    }
                };

                const schema = Joi.object({
                    name: Joi.string().required(),
                    email: Joi.string().email().required(),
                    password:Joi.string().min(4).max(10)
                });
                const {error, value} = schema.validate(request.payload,options);

                if (error) {
                    return h.response(error.details[0].message).code(400); // Bad Request
                }

                try {
                    const User = await user.findOne({email: email})
                    if (User) {
                        return Boom.badRequest('User already exist')
                    }

                    const Users = await user.create({
                        name: request.payload.name,
                        email: request.payload.email,
                        password: request.payload.password
                    })
                    if (Users) {
                       const token = jwt.sign({Users},process.env.JWT_SECRET,{
                           expiresIn:'1hr'
                       })
                        request.cookieAuth.set({token})
                        return h.response(({
                            id:Users._id,
                            name:Users.name,
                            email:Users.email
                        }))
                    }
                } catch (e) {
               return  console.log(e)
                  
                }
                
            },
            options: {
                auth:{
                  mode:'try'
                },
                cors: {
                    credentials: true
                },

            }


        })
    }

}
const LoginPlugin = {
    name: 'Login',
    version: '1.1.1',
    register: async (server, options) => {
        server.route({
            path: '/login',
            method: 'POST',

            handler: async (request, h) => {
                const {email, password} = request.payload
                const options = {
                    errors: {
                        wrap: {
                            label: false
                        }
                    }
                };

                const schema = Joi.object({
                   password:Joi.string().min(4).max(10),
                    email: Joi.string().email().required(),

                });
                const {error, value} = schema.validate(request.payload,options);

                if (error) {
                    return h.response(error.details[0].message).code(400); // Bad Request
                }
                try{
                    const Users = await user.findOne({email: email})
                    if (Users  && await (Users.comparePassword(password))){
                        const token = jwt.sign({Users},process.env.JWT_SECRET,{
                            expiresIn:'1hr'
                        })
                     request.cookieAuth.set({token})
                        return h.response(({
                            id:Users._id,
                            name:Users.name,
                            email:Users.email
                        }))

                    }else {
                        return h.response('invalid email or password').code(401).takeover()
                    }

                }catch (e) {
                return  h.response(e.message).code(401).takeover()

                }

            },
            options: {
                auth:{
                    mode:'try'
                },
                cors: {
                    credentials: true
                }
            },
        })
    }
}


const Logout = {
    name: 'Logout',
    version: '1.1.1',
    register: async (server, options) => {
        server.route({
            path: '/logout',
            method: "POST",
            handler: (request, h) => {
              request.cookieAuth.clear()
              
              return   h.response('User logged out successfully').unstate('name',{
                  ttl:60*60*60*1000,
                  clearInvalid:true
              })
            }
        })
    }
}

export {RegisterPlugin, LoginPlugin, Logout}