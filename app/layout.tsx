import './globals.css';
import React from 'react';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

export const metadata = {
    title: 'Chiang Mai Highlanders Golf',
    description: 'Sign up for tee-off times and score/handicap tracking.',
    metadataBase: new URL('https://highlandersgolf.online'),
    openGraph: {
        title: 'Chiang Mai Highlanders Golf',
        description: 'Sign up for tee-off times and score/handicap tracking.',
        url: 'https://highlandersgolf.online',
        images: '/img/logo_2.jpg',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Chiang Mai Highlanders Golf',
        description: 'Join the golf community in Chiang Mai. Track scores, tee times, and your handicap!',
        images: '/img/logo_2.jpg',
    },
    icons: {
        icon: '/favicon.ico',
    },
};

export const viewport = 'width=device-width, initial-scale=1';

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className="bg-gray-100 text-gray-900">
        <div className="min-h-screen flex flex-col">{children}</div>
        </body>
        </html>
    );
}
