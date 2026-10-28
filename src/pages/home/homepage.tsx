import IntroLoader from "../../components/home/IntroLoader";
import Hero from "../../components/home/hero";
import BrandIntro from "../../components/home/BrandIntro";
import ValueProposition from "../../components/home/ValueProposition";
import FeaturedApartments from "../../components/home/FeaturedApartments";
import { useApartments } from "../../hooks/useApartments";
import { useIntroLoader } from "../../hooks/useIntroLoader";

function HomePage() {
  const { apartments, isLoading, error, retry } = useApartments();
  const intro = useIntroLoader();

  // activa el hero cuando empieza a salir la intro
  const isHeroReady = !intro.isVisible || intro.isLeaving;

  return (
    <div className="home">
      {intro.isVisible && (
        <IntroLoader isLeaving={intro.isLeaving} onSkip={intro.skip} />
      )}
      <Hero isReady={isHeroReady} apartments={apartments} />
      <BrandIntro />
      <ValueProposition />
      <FeaturedApartments
        apartments={apartments}
        isLoading={isLoading}
        error={error}
        onRetry={retry}
      />
    </div>
  );
}

export default HomePage;
