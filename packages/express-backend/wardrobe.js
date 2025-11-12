import mongoose from "mongoose"

const ClothSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    imgurl: {
        type:String,
        required:true,
    },
    user_id:{type:Number,required:true}
  },
  { collection: "wardrobe" }
)

const Cloth = mongoose.model("Cloth", ClothSchema);

mongoose.set("debug",true)
mongoose
  .connect("mongodb://localhost:27017/users",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
  })
  .catch((error)=>console.log(error))

function getWardrobe(user_id){
    console.log("wardrobe.js getWardrobe")
    return Cloth.find({user_id:user_id})
}

function addCloth(cloth){
    console.log("wardrobe.js addCloth")
    return Cloth.create(cloth)
}

export default{getWardrobe,addCloth}


