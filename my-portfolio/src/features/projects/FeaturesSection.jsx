import Reveal from "../../components/ui/Reveal";
import FeatureGrid from "./FeatureGrid";
import "./projects.css";

export default function FeaturesSection({ projects, onOpen }) {
  return (
    <main id="features" className="wrap features">
      <div className="rule-thick features__rule" />
      <Reveal>
        <FeatureGrid projects={projects} onOpen={onOpen} />
      </Reveal>
    </main>
  );
}
