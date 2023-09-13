import {Schema, model, Document, Types} from 'mongoose';

export interface IItems extends Document {
    user: Types.ObjectId | string,
    name: string,
    id: number,
    side: "buy" | "sell",
    quantity: number,
    price: number,
    sold: number,
    icon: string,
    timestamp: Number
};

const itemsSchema = new Schema<IItems>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    name: {
        type: String
    },
    id: {
        type: Number
    },
    side: {
        type: String,
        enum: ["buy", "sell"],
        default: "buy"
    },
    quantity: {
        type: Number
    },
    icon:{
        type: String,
        default: ""
    },
    sold: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    timestamp: {
        type: Number,
        default: Date.now()
    }
});

export default model<IItems>('Items', itemsSchema);