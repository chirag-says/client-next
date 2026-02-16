'use client';

/**
 * ClientLayout - Provider wrapper for client-side global state
 * 
 * This component wraps the entire application with:
 * - AuthProvider (authentication state)
 * - ChatProvider (real-time chat)
 * - ScrollToTop (scroll reset on route change, wrapped in Suspense for useSearchParams)
 * - Navbar (fixed navigation)
 * - Footer (site footer)
 * - ChatButton + ChatWidget (floating chat UI)
 * - ToastContainer (notifications)
 */

import { Suspense } from 'react';
import { AuthProvider } from '../context/AuthContext';
import { ChatProvider } from '../context/ChatContext';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import ChatButton from '../components/Chat/ChatButton';
import ChatWidget from '../components/Chat/ChatWidget';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ClientLayout({ children }) {
    return (
        <AuthProvider>
            <ChatProvider>
                <Suspense fallback={null}>
                    <ScrollToTop />
                </Suspense>
                <div className="w-full min-h-screen overflow-x-hidden bg-white pt-16 lg:pt-20">
                    <Navbar />
                    <main>{children}</main>
                    <Footer />
                    <ChatButton />
                    <ChatWidget />
                </div>
                <ToastContainer
                    position="bottom-right"
                    autoClose={4000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </ChatProvider>
        </AuthProvider>
    );
}
