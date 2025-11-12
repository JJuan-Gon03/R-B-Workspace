import React, { useState, useEffect, useRef } from "react";

export default function ImageGrid() {
  const NUM_IMAGES = 6;
  const [images, setImages] = useState([]);
  const [nextImages, setNextImages] = useState([]);
  const [fadeStates, setFadeStates] = useState(Array(NUM_IMAGES).fill(false));

  const currentIndex = useRef(0);
  const lastIndices = useRef([]);
  const imagesRef = useRef([]);

  const imageLibrary = [
    "https://tinyurl.com/4h9ttw2h",
    "https://tinyurl.com/y6uhujn9",
    "https://tinyurl.com/an9mr4ex",
    "https://shorturl.at/N9uPZ",
    "https://shorturl.at/w25DB",
    "https://shorturl.at/4SbBH",
    "https://shorturl.at/dNfIO",
    "https://shorturl.at/9Tkmx",
    "https://i.redd.it/0xtz5koc3rc51.jpg",
    "https://i.pinimg.com/originals/3b/7a/5e/3b7a5ec6b9466d57c306303e5418797f.jpg",
    "https://preview.redd.it/your-favorite-rocky-pics-or-fit-v0-u5uz6fvriksc1.jpg?width=640&crop=smart&auto=webp&s=465d2a88a8624e69412e87bacfb5917c7bebc3ab"
  ];

  function nextImage(currentImages) {
    let img;
    let tries = 0;
    do {
      img = imageLibrary[currentIndex.current];
      currentIndex.current = (currentIndex.current + 1) % imageLibrary.length;
      tries++;
      if (tries > imageLibrary.length) break;
    } while (currentImages.includes(img));
    return img;
  }

  // preload helper
  const preload = (src) => {
    const img = new Image();
    img.src = src;
  };

  // init
  useEffect(() => {
    const init = Array.from({ length: NUM_IMAGES }, () => nextImage([]));
    init.forEach(preload);
    setImages(init);
    setNextImages(init);
    imagesRef.current = init; // sync ref
  }, []);

  // update ref whenever images change
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  // main cycle interval — run once
  useEffect(() => {
    const interval = setInterval(() => {
      const numToReplace = 2;
      const indices = [];
      const lastUsedIndices = lastIndices.current;

      // pick new indices and not same as last
      while (indices.length < numToReplace) {
        const idx = Math.floor(Math.random() * NUM_IMAGES);
        if (!indices.includes(idx) && !lastUsedIndices.includes(idx)) {
          indices.push(idx);
        }
      }

      lastIndices.current = indices; // save this round

      const currentImgs = imagesRef.current;

      // get next images
      const newNext = currentImgs.map((img, i) =>
        indices.includes(i) ? nextImage(currentImgs) : img
      );
      newNext.forEach(preload);
      setNextImages(newNext);

      // start fade
      setFadeStates((prev) => prev.map((_, i) => indices.includes(i)));

      // after fade transition
      setTimeout(() => {
        setImages((prev) =>
          prev.map((img, i) => (indices.includes(i) ? newNext[i] : img))
        );
        setFadeStates((prev) =>
          prev.map((f, i) => (indices.includes(i) ? false : f))
        );
      }, 1000);
    }, 3500);

    return () => clearInterval(interval);
  }, []); // only once

  return (
    <div
    style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        gap: "16px",
        padding: "16px",
        justifyItems: "center",
        alignItems: "center",
    }}
    >
    {images.map((src, i) => (
        <div
        key={i}
        style={{
            position: "relative",
            width: "100%",
            aspectRatio: "1 / 1", // make every cell square
            overflow: "hidden",
            borderRadius: "0px",
            backgroundColor: "#f4f4f4",
        }}
        >
        <img
            src={src}
            alt={`Outfit ${i}`}
            style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "opacity 1s ease-in-out",
            opacity: fadeStates[i] ? 0 : 1,
            }}
        />
        <img
            src={nextImages[i]}
            alt={`Next Outfit ${i}`}
            style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "opacity 1s ease-in-out",
            opacity: fadeStates[i] ? 1 : 0,
            }}
        />
        </div>
    ))}
    </div>
  );
}
