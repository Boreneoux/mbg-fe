import HeroSection from '@/features/home/components/HeroSection';
import FeaturesSection from '@/features/home/components/FeaturesSection';
import CategoriesSection from '@/features/home/components/CategoriesSection';
import NearestStoreProducts from '@/features/geolocation/components/NearestStoreProducts';
import NewsletterSection from '@/features/home/components/NewsletterSection';

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <CategoriesSection />
      <NearestStoreProducts />
      <NewsletterSection />
    </div>
  );
}
