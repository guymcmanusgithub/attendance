const pin = '1234'

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test. We do this because of some ugly js errors
  // from a js library we are using
  return false
})

describe('Create member', function() {
  it('Open form - about you', function() {
    cy.visit('/')
    cy.get('#add_member').click()
    cy.get('h1')
      .contains('Lets get to know each other')
      .should('exist')
    cy.get('#root_bikesHousehold')
      .clear()
      .type('5')
    cy.get('#root_reasons')
      .clear()
      .type('I just love riding my bike')
    cy.get('button')
      .contains('Next')
      .click()
  })
  it('Contact details', function() {
    cy.get('h1')
      .contains('Details')
      .should('exist')
    cy.get('#root_name')
      .clear()
      .type('Eddie Mercx')
    cy.get('#root_email')
      .clear()
      .type('eddie@mercx.com')
    cy.get('#root_addressStreet')
      .clear()
      .type('27 Rue de la Bicyclette')
    cy.get('#root_addressSuburb')
      .clear()
      .type('Bruxelles')
    // Don't know how to tackle dropdowns yet - no id present???
    // cy.get('#root_addressState')
    //   .clear()
    //   .type('Lux')
    cy.get('#root_addressPostcode')
      .clear()
      .type('AB2701')
    cy.get('#root_phone')
      .clear()
      .type('NA')
    cy.get('#root_mobile')
      .clear()
      .type('0400 911 911')
    cy.get('#root_pin')
      .clear()
      .type(pin)
    cy.get('#root_pinConfirm')
      .clear()
      .type(pin)
    cy.get('button')
      .contains('Next')
      .click()
  })
  it('Emergency contact details', function() {
    cy.get('h1')
      .contains('Who should we contact in an emergency')
      .should('exist')
    cy.get('#root_emergencyContact')
      .clear()
      .type('Madame Lash')
    cy.get('#root_emergencyEmail')
      .clear()
      .type('M.lash@folies_bergere.co.fr')
    cy.get('#root_emergencyPhone')
      .clear()
      .type('1-111-222')
    cy.get('button')
      .contains('Next')
      .click()
  })
  it('Choose an avatar', function() {
    cy.get('h1')
      .contains('Choose an avatar')
      .should('exist')
    cy.get('img[src="/images/avatars/9.jpg"]').click()
    cy.get('button')
      .contains('Next')
      .click()
  })
  it('Review your details', function() {
    cy.get('h1')
      .contains('Review your details')
      .should('exist')
    cy.get('img[src="/images/avatars/9.jpg"]').should('exist')
    cy.get('span')
      .contains('I just love riding my bike')
      .should('exist')
    cy.get('span')
      .contains(pin)
      .should('exist')
    cy.get('span')
      .contains('Madame Lash')
      .should('exist')
    cy.get('span')
      .contains('1-111-222')
      .should('exist')
    cy.get('button')
      .contains('Submit')
      .click()
    // check success alert shows
    cy.get('.s-alert-success').should('exist')
  })
  it('Find your name', function() {
    cy.get('input[placeholder="Search Members"]').should('exist')
    // cy.get('input[placeholder="Search Members"]')
    //   .clear()
    //   .type('Mercx')
    cy.get('div')
      .contains('Eddie Mercx')
      .should('exist')
      .click()
    cy.contains('Eddie Mercx').click()
    cy.get('input#pin').type(pin)
    cy.get('#signIn').click()
  })
})
