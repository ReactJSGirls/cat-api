/* eslint-env mocha */
describe('/Cats && /Cat test', () => {
  it('returns JSON', () => {
    cy.request('/cat')
      .its('headers')
      .its('content-type')
      .should('include', 'application/json')
  })

  it('loads 2 items', () => {
    cy.request('/cat')
      .its('body')
      .its('cat')
      .should('be.a', 'string')
  })

  it('returns 1 cat', () => {
    cy.request('/cats/1')
      .its('body')
      .its('cats')
      .should('have.length', 1)
      .each(cats => expect(cats).to.be.a('string'))
  })

  it('returns 22 cat', () => {
    cy.request('/cats/22')
      .its('body')
      .its('cats')
      .should('have.length', 22)
      .each(cats => expect(cats).to.be.a('string'))
  })

  it('returns errror', () => {
    cy.request({
      url: '/cats/adsad',
      failOnStatusCode: false
    })
      .then(response => {
        expect(response.status).to.eq(500)
      })
      .its('body')
      .its('error')
      .should('eq', 'You need to ask for at least one cat')
  })

  it('returns errror', () => {
    cy.request({
      url: '/cats/-1',
      failOnStatusCode: false
    })
      .then(response => {
        expect(response.status).to.eq(500)
      })
      .its('body')
      .its('error')
      .should('eq', 'You need to ask for at least one cat')
  })
})
