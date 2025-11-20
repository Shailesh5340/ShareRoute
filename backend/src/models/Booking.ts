import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  pickupLocation: string;
  destination: string;
  rider?: import('mongoose').Types.ObjectId;
  driver?: import('mongoose').Types.ObjectId;
  pickupCoords?: number[];
  destinationCoords?: number[];
  passengerName?: string;
  passengerEmail?: string;
  passengerPhone?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  fare?: number;
  distance?: number;
  estimatedDuration?: number;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    rider: { type: Schema.Types.ObjectId, ref: 'User' },
    driver: { type: Schema.Types.ObjectId, ref: 'User' },
    pickupLocation: {
      type: String,
      required: [true, 'Pickup location is required'],
      trim: true,
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
      trim: true,
    },
    passengerName: {
      type: String,
      trim: true,
    },
    passengerEmail: {
      type: String,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    passengerPhone: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    fare: {
      type: Number,
      min: 0,
    },
    distance: {
      type: Number,
      min: 0,
    },
    estimatedDuration: {
      type: Number,
      min: 0,
    },
    // Optional geo coordinates (latitude, longitude)
    pickupCoords: {
      type: [Number],
      validate: {
        validator: function (v: number[]) {
          return !v || v.length === 2;
        },
        message: 'pickupCoords must be [lat, lng]'
      }
    },
    destinationCoords: {
      type: [Number],
      validate: {
        validator: function (v: number[]) {
          return !v || v.length === 2;
        },
        message: 'destinationCoords must be [lat, lng]'
      }
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IBooking>('Booking', bookingSchema);
