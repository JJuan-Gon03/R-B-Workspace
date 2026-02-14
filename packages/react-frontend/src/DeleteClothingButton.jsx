import { deleteCloth } from "./services/cloth.service";

export default function DeleteClothingButton({ clothId, setWardrobe }) {
  async function handleDelete() {
    try {
      await deleteCloth(clothId);
    } catch (error) {
      console.log(error?.message || error);
      //add error handling in the future
      return;
    }

    setWardrobe((prev) => prev.filter((cloth) => cloth._id !== clothId));
  }

  return (
    <div>
      <button onClick={handleDelete}>DELETE</button>
    </div>
  );
}
