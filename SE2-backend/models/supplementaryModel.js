import mongoose, { Schema } from 'mongoose';

const supplementarySchema = new Schema({
    course:{
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    data:{
        type: Buffer,
        require: true
    },
    contentType:{
        type: String,
        require: true
    },
    fileName: {
        type: String,
        require: true
    }
});

export default mongoose.model("Supplementary",supplementarySchema);