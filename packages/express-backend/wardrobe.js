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
  .connect("mongodb://localhost:27017/randb",{})
  .catch((error)=>console.log("error connecting to mongodb:\n",error))

function getWardrobe(user_id){
    return Cloth.find({user_id:user_id}).catch((error)=>console.log(`error finding user with user_id: ${user_id}. error:\n`,error))
}

function addCloth(cloth){
    return Cloth.create(cloth).catch((error)=>console.log(`error creating cloth: ${cloth}. error:\n`,error))
}

export default{getWardrobe,addCloth}


