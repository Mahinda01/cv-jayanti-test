import { Head } from '@inertiajs/react';
import Navbar from '../Components/Public/Navbar';
import Footer from '../Components/Public/Footer';

export default function PublicLayout({ children, title = 'CV Jayanti Muliatama' }) {
    return (
        <>
            <Head title={title}>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />

                <style>
                    {`
                        html {
                            scroll-behavior: smooth;
                        }

                        body,
                        body * {
                            transition-property: background-color, border-color, color, fill, stroke, box-shadow;
                            transition-duration: 250ms;
                            transition-timing-function: ease-in-out;
                        }
                    `}
                </style>
            </Head>

            <div
                className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-white"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
                <Navbar />

                <main className="pt-[78px]">
                    {children}
                </main>

                <Footer />
            </div>
        </>
    );
}