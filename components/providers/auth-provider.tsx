"use client"
import { SessionProvider } from 'next-auth/react'
import { AppProps } from 'next/app'
import React from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google';

function AuthProvider({ children }: any) {
    return (
        <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID || '477063296363-m6rp04kk83v4cpjfmuatkcr0e4oghikf.apps.googleusercontent.com'}>
            {children}
        </GoogleOAuthProvider>
    )
}

export default AuthProvider
