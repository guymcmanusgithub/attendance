import { Mongo } from 'meteor/mongo'
import SimpleSchema from  'simpl-schema'
import { RegExId, createdAt, updatedAt } from '/imports/api/schema'

const ServiceItems = new Mongo.Collection('serviceItems')

export const PartsSchema = new SimpleSchema({
  _id: RegExId,
  name: { type: String, label: 'Parts description' },
  price: { type: SimpleSchema.Integer, label: 'Price in cents' },
  code: { type: String, label: 'Code to indicate if item is for front or back of bike' },
  category: { type: String, label: 'Parts category' },
  used: { type: Boolean, label: 'Is item new or used' },
  createdAt,
  updatedAt,
})

ServiceItems.attachSchema(PartsSchema)

export default ServiceItems
