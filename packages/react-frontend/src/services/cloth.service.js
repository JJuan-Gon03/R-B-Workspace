async function deleteCloth(clothId) {
  const res = await fetch(
    "http://localhost:8000/wardrobe/" + encodeURIComponent(clothId),
    {
      method: "DELETE",
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.message || "Cloth Delete Failed");
  }
}

export { deleteCloth };
