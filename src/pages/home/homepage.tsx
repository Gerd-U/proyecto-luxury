import Hero from "../../components/home/hero";
import ValueProposition from "../../components/home/ValueProposition";
import FeaturedApartments from "../../components/home/FeaturedApartments";
import { useApartments } from "../../hooks/useApartments";

function HomePage() {
  const { apartments, isLoading, error, retry } = useApartments();

  return (
    <div className="home">
      <Hero isReady={true} apartments={apartments} />
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
