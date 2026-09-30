import { useState } from "react";
import { fetchTable } from "../lib/publicFetch";

const FILENAME = "Ajwad_Portfolio.pdf";

/* Builds the portfolio PDF in the browser from the live project rows.
   The renderer and the document are imported on click, so neither lands
   in the site's initial bundle. */
export default function DownloadPortfolioButton() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const download = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      let projects;
      try {
        projects = await fetchTable("projects", { order: "sort_order.asc" });
      } catch (err) {
        console.error(err);
        setError("Couldn't load the projects for the PDF. Check your connection and try again.");
        return;
      }

      const [{ pdf }, { default: PortfolioPDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("./PortfolioPDF"),
      ]);
      const blob = await pdf(<PortfolioPDF projects={projects} />).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = FILENAME;
      document.body.appendChild(link);
      link.click();
      link.remove();
      // Revoke on the next tick: some browsers drop the download if the URL goes first.
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error(err);
      setError("Couldn't generate the PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="letters__link letters__link--button"
        onClick={download}
        disabled={isGenerating}
        aria-busy={isGenerating}
        aria-label={isGenerating ? "Generating portfolio PDF" : "Download portfolio (PDF)"}
      >
        {isGenerating ? "Generating..." : "Portfolio (PDF)"}
      </button>
      {error && <p className="letters__status" role="alert">{error}</p>}
    </>
  );
}
