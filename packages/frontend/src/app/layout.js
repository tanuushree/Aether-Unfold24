"use client"
import { GoogleOAuthProvider } from '@react-oauth/google';
import { OktoProvider, BuildType } from "okto-sdk-react";
import localFont from "next/font/local";
import "./globals.css";
import React, { createContext, useState } from "react";
// import { AppProvider } from '../context/context'; // Import the AppProvider

export const AppContext = createContext({});


// Load custom fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});



export default function RootLayout({ children }) {

    const oktaId=process.env.NEXT_PUBLIC_OKTA_CLIENT_ID

  return (
    <>
      <html lang="en">
        <AppContext.Provider value={{}}>
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
            <OktoProvider apiKey={oktaId} buildType={BuildType.SANDBOX}>
                <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                        {children}
                </body>
            </OktoProvider>
          </GoogleOAuthProvider>
        </AppContext.Provider>
      </html>
    </>
  );
}
