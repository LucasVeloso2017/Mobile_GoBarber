import React from 'react'
import { AuthProvider } from './AuthContext'


const appProvider: React.FC = ({children}) => {
    return(
      <AuthProvider>
        {children}
      </AuthProvider>
    );
}

export default appProvider;