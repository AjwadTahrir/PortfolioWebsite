import { FOLIO } from "../../constants/site";
import "./layout.css";

/* Folio line at the foot of each numbered page. */
export default function PageFoot({ no }) {
  return (
    <div className="page-foot mono">
      <span>{FOLIO}</span>
      <span>PAGE {no}</span>
    </div>
  );
}
