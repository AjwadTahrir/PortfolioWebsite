import "./visuals.css";

export default function Screenshot({ src, alt, eager = false }) {
  return (
    <img
      className="screenshot"
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
