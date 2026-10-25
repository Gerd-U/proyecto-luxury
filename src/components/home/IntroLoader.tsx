import BrandMark from "../brand/BrandMark";
import type { StyleWithVars } from "../../types/css";
import "./IntroLoader.css";

interface IntroLoaderProps {
  isLeaving: boolean;
  onSkip: () => void;
}

const BRAND_LETTERS: string[] = Array.from("La Guaria");

function IntroLoader({ isLeaving, onSkip }: IntroLoaderProps) {
  return (
    <div
      className={`intro ${isLeaving ? "intro--leaving" : ""}`}
      aria-hidden="true"
      onClick={onSkip}
    >
      <div className="intro__content">
        <BrandMark size={88} animated className="intro__mark" />

        <p className="intro__name">
          {BRAND_LETTERS.map((letter, index) => (
            <span className="intro__mask" key={index}>
              <span
                className="intro__letter"
                style={{ "--i": index } as StyleWithVars}
              >
                {letter === " " ? "\u00A0" : letter}
              </span>
            </span>
          ))}
        </p>

        <p className="intro__tagline">Residencias · Costa Rica</p>
      </div>
    </div>
  );
}

export default IntroLoader;
