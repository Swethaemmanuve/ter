import { getClient } from '../apiClient'
const basePath = '/api'

export default {
    signUP: async (body: any) => {
        const client = await getClient()
        return client.post(`${basePath}/signup`, body)
    },
    signIn:async (body:any)=>{
        const client = await getClient()
        return client.post(`${basePath}/signin`, body)
    }
}
