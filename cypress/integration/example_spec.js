describe('Simple test', () => {
  it('Load the front page', () => {
    cy.visit('');
    cy.title().should('eq', 'gTrack admin');
  });
});
