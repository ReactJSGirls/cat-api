/* eslint-env mocha */
describe('Placeholder test', () => {
  it('returns JPEG', () => {
    cy.request('/placeholder')
      .its('headers')
      .its('content-type')
      .should('include', 'image/jpeg')

    cy.request('/placeholder/22')
      .its('headers')
      .its('content-type')
      .should('include', 'image/jpeg')

    cy.request('/placeholder/22/22')
      .its('headers')
      .its('content-type')
      .should('include', 'image/jpeg')
  })

  it('returns errror', () => {
    cy.request({
      url: '/placeholder/adsad',
      failOnStatusCode: false
    })
      .then(response => {
        expect(response.status).to.eq(500)
      })
      .its('body')
      .its('error')
      .should('eq', 'There was an error processing the image.')

    cy.request({
      url: '/placeholder/-1',
      failOnStatusCode: false
    })
      .then(response => {
        expect(response.status).to.eq(500)
      })
      .its('body')
      .its('error')
      .should('eq', 'There was an error processing the image.')

    cy.request({
      url: '/placeholder/1/sudahk',
      failOnStatusCode: false
    })
      .then(response => {
        expect(response.status).to.eq(500)
      })
      .its('body')
      .its('error')
      .should('eq', 'There was an error processing the image.')

    cy.request({
      url: '/placeholder/1/-21',
      failOnStatusCode: false
    })
      .then(response => {
        expect(response.status).to.eq(500)
      })
      .its('body')
      .its('error')
      .should('eq', 'There was an error processing the image.')
  })
})
