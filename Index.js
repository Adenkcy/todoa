import Hapi from '@hapi/hapi'
import dotenv from 'dotenv'
import {myPlugin} from "./routes/User.js";
import {dbconn} from "./database/data.js";
import Cookie from '@hapi/cookie'
dotenv.config()
const init = async  ()=>{
    const  server = Hapi.server({
        port:process.env.PORT|| 5000,
        host:'localhost',
        routes:{
           cors:{
               origin: ['*'], // an array of origins or 'ignore'
               credentials: true // boolean - 'Access-Control-Allow-Credentials'
           }
       }
    })
    
    
  await  server.register(myPlugin)
   await server.register({
       plugin:dbconn
   })
    await server.start()
    console.log('server running  on %s', server.info.uri)
}
process.on('unhandledRejection',(err)=>{
    console.error(err)

    process.exit(1)
})
init()