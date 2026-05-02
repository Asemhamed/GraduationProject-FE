'use client'

import { UserDataProvider } from '@/Context/UserData'
import { store } from '@/Store/store'
import { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { Bounce, ToastContainer } from 'react-toastify'

export default function Providers({children}: {children:ReactNode}) {
    
    return <>
        <Provider store={store} >
        <UserDataProvider>
            {children}
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
                />
        </UserDataProvider>
        </Provider>
    </>
}
