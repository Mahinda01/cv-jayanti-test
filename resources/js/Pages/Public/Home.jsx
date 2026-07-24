import PublicLayout from '../../Layouts/PublicLayout';
import HeroSection from '../../Components/Public/HeroSection';
import AboutSection from '../../Components/Public/AboutSection';
import ProductSection from '../../Components/Public/ProductSection';
import ContactSection from '../../Components/Public/ContactSection';

export default function Home({ products = [] }) {
    return (
        <PublicLayout title="CV Jayanti Muliatama">
            <HeroSection />
            <AboutSection />
            <ProductSection products={products} />
            <ContactSection />
        </PublicLayout>
    );
}