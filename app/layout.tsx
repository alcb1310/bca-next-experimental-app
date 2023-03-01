import Footer from "@/components/Footer"
import { Inter } from "@next/font/google"
import NavBar from "@/components/NavBar"

import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className={inter.className}>
        {children}
        <Footer />
      </body>
    </html>
  )
}
