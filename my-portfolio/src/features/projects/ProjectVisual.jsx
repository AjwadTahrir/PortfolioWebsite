import MoscowMock from "./visuals/MoscowMock";
import PipelineDiagram from "./visuals/PipelineDiagram";
import Screenshot from "./visuals/Screenshot";
import UseCaseMock from "./visuals/UseCaseMock";

/* Renders one `visuals` descriptor, whether it came from the projects table
   (admin-edited) or a seed row. */
export default function ProjectVisual({ visual }) {
  switch (visual.type) {
    case "screenshot":
      return <Screenshot src={visual.src} alt={visual.alt} />;
    case "pipeline":
      return <PipelineDiagram title={visual.title} steps={visual.steps} />;
    case "use-case":
      return <UseCaseMock />;
    case "moscow":
      return <MoscowMock />;
    default:
      return null;
  }
}
