// ActiveBackground.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import FOG from "vanta/dist/vanta.fog.min.js";
import "./ActiveBackground.css";

export default function ActiveBackground({ theme }) {
  const vantaRef = useRef(null);
  const vantaEffectRef = useRef(null);

  useEffect(() => {
    const baseOptions = {
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
    };

    if (!vantaEffectRef.current) {
      // first mount create effect
      vantaEffectRef.current = FOG({
        ...baseOptions,
        ...theme,
      });
    } else {
      // later just update colors when theme changes
      vantaEffectRef.current.setOptions(theme);
    }

    return () => {
      // if this component ever unmounts clean up
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
      }
    };
  }, [theme]);

  return <div className="background" ref={vantaRef} />;
}

