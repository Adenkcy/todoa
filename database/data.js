import mongoose from "mongoose";

const  dbconn = {
    name:'db',
    version:'1.0.1',
    register: function  (server,option) {
        const dbcon = async ()=>{
            try {
                const conn = await mongoose.connect(process.env.MONGO_URI)
                console.log(`db is connected on ${conn.connection.host}`)
            }catch (e) {
                console.log(e)
            }
        }
        dbcon()
    }

}
export {dbconn}