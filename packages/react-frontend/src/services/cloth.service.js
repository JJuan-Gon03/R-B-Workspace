const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "https://thriftr-affjdacjg4fecuha.westus3-01.azurewebsites.net";

async function deleteCloth(clothId) {
  const res = await fetch(
    API_BASE + "/wardrobe/" + encodeURIComponent(clothId),
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
