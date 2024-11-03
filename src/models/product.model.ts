import mongoose, { Schema } from 'mongoose';

const productSchema = new Schema({
  description: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    default: '',
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
  isCart: {
    type: Boolean,
    default: false,
  },
  sales: {
    type: Number,
    default: 0,
  },
  tag: {
    type: Number,
    default: 0,
  },
  netPrice: {
    type: Number,
    default: 0,
  },
  grossPrice: {
    type: Number,
    default: 0,
  },
  stock: {
    type: Number,
    default: 0,
  },
  img: [
    {
      url: {
        type: Array<String>,
        default: [],
      },
      isDefault: {
        type: Boolean,
        default: false,
      },
      characteristics: {
        type: mongoose.Schema.Types.Mixed,
        defaut: {},
      },
    },
  ],
  question: [
    {
      user: {
        type: mongoose.Types.ObjectId,
      },
      question: {
        type: String,
        default: '',
      },
      answer: {
        type: String,
        default: '',
      },
    },
  ],
  rating: [
    {
      user: {
        type: mongoose.Types.ObjectId,
      },
      score: {
        type: Number,
        default: 0,
        min: 1,
        max: 5,
      },
      description: {
        type: String,
        default: '',
      },
      img: {
        type: Array<String>,
        default: [],
      },
      isHelpfull: {
        type: Boolean,
        default: false,
      },
      service: {
        quality: {
          type: Number,
          default: 0,
          min: 1,
          max: 5,
        },
        delivery: {
          type: Number,
          default: 0,
          min: 1,
          max: 5,
        },
        customerService: {
          type: Number,
          default: 0,
          min: 1,
          max: 5,
        },
      },
    },
  ],
});

export const ProductModel = mongoose.model('Product', productSchema);
