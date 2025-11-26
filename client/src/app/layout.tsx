import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
    title: 'AntiGravity Connect',
    description: 'Anonymous Real-time Video Chat',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-riot-dark text-riot-text`}>
                <div className="flex min-h-screen">
                    <Sidebar />
                    <div className="flex-1 ml-16 md:ml-20">
                        {children}
                    </div>
                </div>
            </body>
        </html>
    )
}
