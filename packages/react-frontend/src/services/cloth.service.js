async function deleteCloth(clothId) {
  const res = await fetch(
    import.meta.env.VITE_API_BASE + "/wardrobe/" + encodeURIComponent(clothId),
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
