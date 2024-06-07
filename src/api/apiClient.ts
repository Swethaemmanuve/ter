import axios from 'axios';

const axoisInstance = axios.create({
    
})
axoisInstance.defaults.timeout = 5000;

const getClient = async () => {
    const token = localStorage.getItem('idToken')
    const instance = axios.create({
        baseURL:'https://contentcrafter.bulkpe.in',
    })
    if(token){
        try{
                    
            instance.defaults.headers.common['Authorization']= `Bearer ${token}`;          
            return instance
        }catch(err){
            return instance;
        }
    }else{
        return instance
    }
    
}
export {getClient};