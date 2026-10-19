import type {Metadata} from 'next';import {Shell} from '@/components/site';import './globals.css';
export const metadata:Metadata={title:'Hiroki Tanaka — Archive',description:'Independent archive of environmental design, community practice and urban research.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><Shell>{children}</Shell></body></html>}
