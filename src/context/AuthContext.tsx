import React,{ createContext,useEffect,useCallback,useState,useContext } from 'react'
import AsyncStorage from '@react-native-community/async-storage'

import api from '../services/api'

interface authState{
    token:string
    user:object
}

interface signInCredentials{
    email:string
    password:string
}

interface authContext{
    loading:boolean
    user:object
    signin(credentials:signInCredentials):Promise<void>
    signout():void

}

const AuthContext = createContext<authContext>({} as authContext)


const AuthProvider: React.FC = ({children}) => {
    
    const[data,setData]=useState<authState>({} as authState)
    const[loading,setLoading] = useState(true)


    useEffect(()=>{
        async function loadStorageData():Promise<void>{
            const [token,user] = await AsyncStorage.multiGet(['@GoBarber:token','@GoBarber:user'])
            
            if(token[1] && user[1]){
                setData({token:token[1] ,user:JSON.parse(user[1])})
                setLoading(false)
            }
        }

        loadStorageData()
    },[])

    const signin = useCallback(async({email,password})=>{
        
        const { data } = await api.post('session',{email,password})    
        const { token,user } = data

        await AsyncStorage.multiSet([
            ['@GoBarber:token',token],
            ['@GoBarber:user',JSON.stringify(user)]
        ])
        

        setData({ token,user })
    },[])

    const signout = useCallback(async ()=>{
        await AsyncStorage.multiRemove(['@GoBarber:token','@GoBarber:user'])

        setData({} as authState)
    },[])

    
    return(
      <>
        <AuthContext.Provider value={{ user:data.user , signin, signout,loading }}>
            {children}
        </AuthContext.Provider>
    
      </>
    )
}

const useAuth = ():authContext =>{

    const context = useContext(AuthContext)
    
    if(!context){
        throw new Error('useAuth must be use within an AuthProvider')
    }

    return context
}

export { AuthProvider,useAuth}

