async function deleteCloth(clothId) {
  const res = await fetch(
    "http://localhost:8000/wardrobe/" + encodeURIComponent(clothId),
    {
      method: "DELETE",
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message);
  }
}

export { deleteCloth };
