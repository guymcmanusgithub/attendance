import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import Alert from 'react-s-alert'
import { Button, List, Accordion, Icon, Grid, Loader } from 'semantic-ui-react'

import '/imports/ui/layouts/assessment.css'
import {
  LOG_EVENT_READABLE,
  STATUS_UPDATE,
  MECHANIC_UPDATE,
  NEW_JOB,
  PHONE_CALL,
  SEND_SMS,
  JOB_STATUS,
  JOB_STATUS_READABLE,
  JOB_STATUS_BUTTON,
  JOB_STATUS_STYLES,
  LOG_EVENT_TYPES
} from '/imports/api/constants'
import printJobCard from '/imports/ui/assessment/assessment-print-job'
import MechanicModal from './mechanic-modal'
import SmsModal from './sms-modal'
import PhoneModal from './phone-modal'

class JobCard extends Component {
  state = {
    activeIndex: -1
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  updateButton = () => {
    const jobId = this.props.job._id
    const statusValue = this.props.job.status
    const statusList = Object.keys(JOB_STATUS)
    const status = statusList.find(key => JOB_STATUS[key] === statusValue) // Find key/name of current status
    const statusIndex = statusList.findIndex(element => element === status)
    const updatedStatusKey = statusList[statusIndex + 1] // Find key/name of next status
    const updatedStatus = JOB_STATUS[updatedStatusKey] // Update to the next status

    try {
      if (statusValue >= JOB_STATUS.PICKED_UP) return
      this.props.updateStatus(jobId, updatedStatus)
      Alert.success(`Successfully changed job status to ${JOB_STATUS_READABLE[updatedStatus]}`)
    } catch (error) {
      Alert.error(error.message)
    }
  }

  cancelButton = () => {
    const jobId = this.props.job._id
    const status = this.props.job.status
    const cancelStatus = JOB_STATUS.CANCELLED
    const completeStatus = JOB_STATUS.PICKED_UP
    const reopenStatus = JOB_STATUS.NEW
    const bikePickedUpStatus = JOB_STATUS.PICKED_UP
    try {
      if (status < bikePickedUpStatus) {
        this.props.updateStatus(jobId, cancelStatus)
        Alert.success(`Successfully changed job status to ${JOB_STATUS_READABLE[cancelStatus]}`)
      } else if (status === cancelStatus || status === completeStatus) {
        this.props.updateStatus(jobId, reopenStatus)
        Alert.success(`Successfully changed job status to ${JOB_STATUS_READABLE[reopenStatus]}`)
      }
      return
    } catch (error) {
      Alert.error(error.message)
    }
  }

  sendSMS = cost => {}

  callCustomer = cost => {
    const jobId = this.props.job._id
  }

  titleCase(str) {
    if (!str) return
    return str
      .toLowerCase()
      .split(' ')
      .map(x => x[0].toUpperCase() + x.slice(1))
      .join(' ')
  }

  renderLogs(logs) {
    if (!logs.length) {
      return <Loader active inline size="mini" />
    }
    return logs.map((log, ix) => {
      const date = moment(log.createdAt).format('ddd Do MMM, h:mm a')
      const message = status => {
        switch (status) {
          case LOG_EVENT_TYPES[STATUS_UPDATE]:
            return `${LOG_EVENT_READABLE[LOG_EVENT_TYPES[STATUS_UPDATE]]}: ${JOB_STATUS_READABLE[log.status]}`
          case LOG_EVENT_TYPES[MECHANIC_UPDATE]:
            return `${LOG_EVENT_READABLE[LOG_EVENT_TYPES[MECHANIC_UPDATE]]}: ${log.data}`
          case LOG_EVENT_TYPES[NEW_JOB]:
            return `${LOG_EVENT_READABLE[LOG_EVENT_TYPES[NEW_JOB]]} ${log.user}`
          case LOG_EVENT_TYPES[PHONE_CALL]:
            return `${LOG_EVENT_READABLE[LOG_EVENT_TYPES[PHONE_CALL]]}: ${log.data}`
          case LOG_EVENT_TYPES[SEND_SMS]:
            return `${LOG_EVENT_READABLE[LOG_EVENT_TYPES[SEND_SMS]]}: ${log.data}`
          default:
            return JOB_STATUS_READABLE[log.status]
        }
      }
      return <li key={ix}>{`${date} - ${message(log.eventType)}`}</li>
    })
  }

  render() {
    const { activeIndex } = this.state
    // Pulling data from props (assessment collection)
    const { status, jobNo, bikeDetails, services, mechanic, pickupDate, totalCost, customerDetails } = this.props.job
    const make = bikeDetails.make
    const model = bikeDetails.model
    const color = bikeDetails.color
    const pickupDisplay = moment(pickupDate).format('D/M/YYYY')
    const totalRepairCost = totalCost / 100
    const jobStatus = JOB_STATUS_READABLE[status]
    const customerName = customerDetails.isRefurbish ? 'Refurbish' : customerDetails.name
    // const serviceList = services.serviceItem.map(item => (<li key={item.name} style={{textIndent: "10px"}}>{item.name}</li>))
    const servicePackage = services.baseService

    // Dynamic button name
    const statusText = status <= JOB_STATUS.PICKED_UP ? JOB_STATUS_BUTTON[status] : 'Cancelled'
    const cancelText = status <= JOB_STATUS.READY_FOR_PICK_UP ? 'Cancel Job' : 'Re-open Job'
    const name = `${jobNo} ${this.titleCase(color)} ${make} ${model}`

    return (
      <Accordion className="job-card-container" styled fluid>
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={this.handleClick}
          style={JOB_STATUS_STYLES[status]}
        >
          <Grid stackable>
            <Grid.Row columns={5} mobile={2}>
              <Grid.Column width={1}>
                <Icon name="dropdown" />
              </Grid.Column>

              <Grid.Column width={3}>
                <div>
                  <strong>{jobStatus}</strong>
                </div>
              </Grid.Column>

              <Grid.Column width={6}>
                <List.Item>{name}</List.Item>
              </Grid.Column>

              <Grid.Column width={4}>
                <List.Item>{this.titleCase(customerName)}</List.Item>
              </Grid.Column>

              <Grid.Column width={2}>
                <List.Item>${totalRepairCost}</List.Item>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Accordion.Title>

        <Accordion.Content active={activeIndex === 0} style={{ fontSize: '1em', marginLeft: '28px' }}>
          <Grid stackable>
            <Grid.Row columns={2} style={{ marginTop: '20px' }}>
              <Grid.Column style={{ fontSize: '1.2em' }}>
                <List.Item>
                  <strong>{servicePackage} </strong> Due: {pickupDisplay} <strong>Mechanic: </strong>
                  {mechanic}
                </List.Item>
                <ul>
                  <strong>Activity: </strong>
                  {this.renderLogs(this.props.logs)}
                </ul>
                <br />
                <Button.Group>
                  <Button
                    className="ui button"
                    color="green"
                    style={{ textAlign: 'center', borderRadius: '5px', width: '200px' }}
                    onClick={this.updateButton}
                  >
                    <h2>{statusText}</h2>
                  </Button>
                  <Button
                    className="ui button"
                    color="red"
                    style={{ textAlign: 'center', marginLeft: '10px', borderRadius: '5px' }}
                    onClick={this.cancelButton}
                  >
                    <h2>{cancelText}</h2>
                  </Button>
                </Button.Group>
              </Grid.Column>

              <Grid.Column style={{ textAlign: 'right' }}>
                <Grid.Row>
                  <Button.Group>
                    <MechanicModal {...this.props} />
                    <Button
                      className="ui button"
                      color="blue"
                      style={{ textAlign: 'center', margin: '5px', borderRadius: '5px' }}
                      onClick={() => printJobCard(this.props.job)}
                    >
                      <h1>
                        <Icon name="print" />
                      </h1>
                      Job Card
                    </Button>
                  </Button.Group>
                </Grid.Row>

                <Grid.Row>
                  <Button.Group>
                    <PhoneModal job={this.props.job} />
                    <SmsModal job={this.props.job} />
                  </Button.Group>
                </Grid.Row>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Accordion.Content>
      </Accordion>
    )
  }
}

JobCard.propTypes = {
  job: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    status: PropTypes.number.isRequired
  }),
  updateStatus: PropTypes.func.isRequired,
  logs: PropTypes.array.isRequired
}

export default JobCard
