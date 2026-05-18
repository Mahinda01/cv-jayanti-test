import PublicLayout from '@/Layouts/PublicLayout';
import Navbar from '@/Components/Public/Navbar';
import HeroSection from '@/Components/Public/HeroSection';
import AboutSection from '@/Components/Public/AboutSection';
import ProductSection from '@/Components/Public/ProductSection';
import ContactSection from '@/Components/Public/ContactSection';
import Footer from '@/Components/Public/Footer';

export default function Home() {
    return (
        <PublicLayout>
            <Navbar />
            <HeroSection />
            <AboutSection />
            <ProductSection />
            <ContactSection />
            <Footer />
        </PublicLayout>
    );
}