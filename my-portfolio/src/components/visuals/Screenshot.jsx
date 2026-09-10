import React from "react";

export default function Screenshot({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      style={{ width: "100%", height: "auto", display: "block" }}
    />
  );
}