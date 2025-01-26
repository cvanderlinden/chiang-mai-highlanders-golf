// app/layout.tsx

import './globals.css';
import React from 'react';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className="bg-gray-100 text-gray-900">
        <div className="min-h-screen flex flex-col">
            {children}
        </div>
        </body>
        </html>
    );
}
