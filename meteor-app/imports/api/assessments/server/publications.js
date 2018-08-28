import { Meteor } from 'meteor/meteor'
import Assessment from '../assessment'
import Services from '../services'
import ServiceItems from '../serviceItems'
import Logger from '../logger'

// Mainly to get updated changes reflected in job cart
Meteor.publish('services.all', () => {
  return Services.find({})
})

Meteor.publish('serviceItems.all', () => {
  return ServiceItems.find({})
})

Meteor.publish('assessments.all', () => {
  return Assessment.find({})
})

Meteor.publish('logger.assessment', () => {
  return Logger.find()
})