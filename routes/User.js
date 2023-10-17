import {LoginPlugin, Logout, RegisterPlugin} from "../controller/User.js";
import {CreateTask, DeleteTodo, GetTask, updateTask} from "../controller/Task.js";

const myPlugin ={
    name:'Routers',
    version:'1.0.0',
    register:async function (server,options) {
     await  server.register({
            plugin:GetTask
        })
       server.register({
            plugin:CreateTask
        })
        server.register({
            plugin:updateTask
        })
        server.register({
            plugin:DeleteTodo
        })
      server.register({
           plugin:RegisterPlugin
       })
      server.register({
            plugin:LoginPlugin
        })
      server.register({
            plugin:Logout
        })

}

}
export {myPlugin}