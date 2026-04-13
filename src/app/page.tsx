import HeroSection from '@/features/home/components/HeroSection';
import FeaturesSection from '@/features/home/components/FeaturesSection';
import CategoriesSection from '@/features/home/components/CategoriesSection';
import FeaturedProductsSection from '@/features/home/components/FeaturedProductsSection';
import NewsletterSection from '@/features/home/components/NewsletterSection';

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <CategoriesSection />
      <FeaturedProductsSection />
      <NewsletterSection />
    </div>
  );
}
