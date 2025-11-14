// ActiveBackground.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import FOG from "vanta/dist/vanta.fog.min.js";
import "./ActiveBackground.css"

export default function ActiveBackground() {
  const vantaRef = useRef(null);

  useEffect(() => {
    const vantaEffect = FOG({
      el: vantaRef.current,
      THREE,
      minHeight: 200.0,
      minWidth: 200.0,
      highlightColor: 0xffc300,
      midtoneColor: 0xfcfcfc,
      lowlightColor: 0xf4105a,
      baseColor: 0xffffff,
      blurFactor: 0.6,
      speed: 2,
      zoom: 1,
    });

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);

  return <div className="background" ref={vantaRef}></div>;
}