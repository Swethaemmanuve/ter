import { getClient } from '../apiClient'
const basePath = '/api'

export default {
    createTemplate: async (body: any) => {
        const client = await getClient()
        return client.post(`${basePath}/CreateTemplate`, body)
    },
    scrapeTemplate: async (body: any) => {
        const client = await getClient()
        return client.post(`${basePath}/scrapeTemplate`, body)
    },
    writeContent: async (body: any) => {
        const client = await getClient()
        return client.post(`${basePath}/writeContent`, body)
    },
    getImage: async (body: any) => {
        const client = await getClient()
        return client.post(`${basePath}/getImage`, body)
    },
    Listtempltes: async () => {
        const client = await getClient()
        return client.get(`${basePath}/Listtempltes`)
    },
    listProjects: async () => {
        const client = await getClient()
        return client.get(`${basePath}/listProjects`)
    },
    
    getPage: (id:string) => {
        return getClient().then((client: any ,) => {
            return client.get(`${basePath}/listProjectsById?projectRef=${id}`)
        })
    },
 
    regenerateContent: (body:any) => {
        return getClient().then((client: any ,) => {
            return client.post(`${basePath}/regenerateContent`, body)
        })
    },
 
    downloadFile: (websiteRef:any) => {
        return getClient().then((client: any ,) => {
            return client.get(`${basePath}/downloadPage?projectRef=${websiteRef}`, )
        })
    },
 
    saveEditFile: (body: any) => {
        return getClient().then((client: any ,) => {
            return client.post(`${basePath}/savePages`, body)
        })
    }
}
