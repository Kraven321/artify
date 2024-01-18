import { Schema, model, models } from "mongoose";

const WorkSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    category: {
        type: String
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    price: {
        type: Number
    },
    workPhotoPaths:[{type: String}]
})

const Work = models.work || model("work", WorkSchema)

export default Work