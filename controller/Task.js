import {Task} from "../database/model/Task.js";
import Boom from "@hapi/boom";

import {protect as jwtCookie} from "../middleware/AuthCookie.js";

const GetTask = {
	name: 'Task',
	version: '1.1.1',
	register: async (server, options) => {
		await server.register(jwtCookie)
		server.route({
			method: "GET",
			path: '/api/todo',
			
			
			handler: async (request, h, err) => {
				const task = await Task.find({
					user: request.user._id
				})
				if (request.auth.isAuthenticated) {
					return task
				} else {
					return Boom.badRequest('No todo found')
				}
				
			},
			
			options: {
				auth: 'session',
				cors: {
					credentials: true
				}
			}
			
		})
	}
}

const CreateTask = {
	name: 'createTask',
	version: '1.0.0',
	register: async (server, options) => {
		server.route({
			path: "/api/todo",
			method: 'POST',
			
			handler: async (request, h) => {
				const {title, body, progress,Date} = request.payload
				if (!request.payload.title || !request.payload.body || !request.payload.progress ||!request.payload.Date) {
					return h.response('Please add all fields').code(401).takeover()
				}
				try {
					const Todo = await Task.create({
						title,
						body,
						progress,
                        Date,
						user: request.user._id
					})
					if (request.auth.isAuthenticated) {
						return Todo
					} else {
						return Boom.badRequest('No todo found')
					}
					
				} catch (e) {
					console.error(e.message);
					throw Boom.internal('An internal server error occurred');
				}
				
			},
			options: {
				auth: 'session',
				cors: {
					credentials: true
				},
				
			},
		})
		
	}
}

const updateTask = {
	name: 'task',
	version: '1.0.0',
	register: (server, options) => {
		server.route({
			path: "/api/todo/{id}",
			method: "PUT",
			options: {
				auth: 'session',
				cors: {
					credentials: true
				},
				
			},
			handler: async (request, h) => {
				const task = await Task.findById(request.params.id)
				if (!task) {
					return Boom.badRequest('Task not available')
				}
				const UpdatedTask = await Task.findByIdAndUpdate(request.params.id, request.payload, {new: true})
				if (request.auth.isAuthenticated) {
					return UpdatedTask
				} else {
					return Boom.badRequest('No todo found')
				}
			}
		})
	}
}

const DeleteTodo = {
	name: 'DeleteTodo',
	version: '1.0.0',
	register: async (server, options) => {
		server.route({
			path: '/api/todo/{id}',
			method: "DELETE",
			
			
			handler: async (request, h) => {
				const task = await Task.findById(request.params.id)
				if (!task) {
					return Boom.badRequest('Ask not available')
				}
				
				await task.deleteOne()
				if (request.auth.isAuthenticated) {
					return h.response(request.params.id)
				} else {
					return h.response('No todo found').code(401).takeover()
				}
				
			},
			options: {
				auth: 'session',
				cors: {
					credentials: true,
					origin:["*"]
				},
				
			},
		})
	}
}
export {CreateTask, GetTask, updateTask, DeleteTodo}