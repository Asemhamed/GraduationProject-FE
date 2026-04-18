'use client'

import { UserDataProvider } from '@/Context/UserData'
import { store } from '@/Store/store'
import { ReactNode } from 'react'
import { Provider } from 'react-redux'

export default function Providers({children}: {children:ReactNode}) {
    return <>
        <Provider store={store} >
        <UserDataProvider>
            {children}
        </UserDataProvider>
        </Provider>
    </>
}
