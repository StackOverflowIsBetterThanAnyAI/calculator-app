/// <reference types="cypress" />

describe('Calculator App', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('should display default text on initial mount', () => {
        cy.clearLocalStorage()
        cy.get('[data-testid="display"]').should(
            'have.text',
            'The Calculator Is Waiting For Your Actions.|'
        )
    })

    it('should solve basic calculations for mouse input', () => {
        cy.get('[data-testid="button-AC"]').click()
        cy.get('[data-testid="display"]').should('have.text', '|')

        cy.get('[data-testid="button-7"]').click()
        cy.get('[data-testid="button-()"]').click()
        cy.get('[data-testid="button-3"]').click()
        cy.get('[data-testid="button-+/-"]').click()
        cy.get('[data-testid="button-0"]').click()
        cy.get('[data-testid="button-,"]').click()
        cy.get('[data-testid="button-2"]').click()
        cy.get('[data-testid="button-/"]').click()
        cy.get('[data-testid="button-0"]').click()
        cy.get('[data-testid="button-,"]').click()
        cy.get('[data-testid="button-8"]').click()
        cy.get('[data-testid="button-+/-"]').click()
        cy.get('[data-testid="button-="]').click()
        cy.get('[data-testid="display"]').should(
            'have.text',
            '7 x ((-30,2 / (-0,8)))|Result: 264,25'
        )

        cy.get('[data-testid="button-0"]').click()
        cy.get('[data-testid="button-2"]').click()
        cy.get('[data-testid="button-="]').click()
        cy.get('[data-testid="display"]').should(
            'have.text',
            '7 x ((-30,2 / (-0,8))) x 2|Result: 528,5'
        )
    })

    it('should solve basic calculations for keyboard input', () => {
        cy.get('body').trigger('keydown', { key: 'Delete' })
        cy.get('[data-testid="display"]').should('have.text', '|')

        cy.get('body').trigger('keydown', { key: '7' })
        cy.get('body').trigger('keydown', { key: '(' })
        cy.get('body').trigger('keydown', { key: '3' })
        cy.get('body').trigger('keydown', { key: 'Control' })
        cy.get('body').trigger('keydown', { key: '0' })
        cy.get('body').trigger('keydown', { key: ',' })
        cy.get('body').trigger('keydown', { key: '2' })
        cy.get('body').trigger('keydown', { key: '/' })
        cy.get('body').trigger('keydown', { key: '0' })
        cy.get('body').trigger('keydown', { key: ',' })
        cy.get('body').trigger('keydown', { key: '8' })
        cy.get('body').trigger('keydown', { key: 'Control' })
        cy.get('body').trigger('keydown', { key: 'Enter' })
        cy.get('[data-testid="display"]').should(
            'have.text',
            '7 x ((-30,2 / (-0,8)))|Result: 264,25'
        )

        cy.get('body').trigger('keydown', { key: '0' })
        cy.get('body').trigger('keydown', { key: '2' })
        cy.get('body').trigger('keydown', { key: 'Enter' })
        cy.get('[data-testid="display"]').should(
            'have.text',
            '7 x ((-30,2 / (-0,8))) x 2|Result: 528,5'
        )
    })

    it('should display an error for divisions with zero', () => {
        cy.get('body').trigger('keydown', { key: '1' })
        cy.get('body').trigger('keydown', { key: '/' })
        cy.get('body').trigger('keydown', { key: '0' })
        cy.get('body').trigger('keydown', { key: 'Enter' })
        cy.get('[data-testid="display"]').should(
            'have.text',
            '1 / 0|Please do not divide by Zero.'
        )

        cy.get('body').trigger('keydown', { key: 'Delete' })
        cy.get('body').trigger('keydown', { key: '1' })
        cy.get('body').trigger('keydown', { key: 'Control' })
        cy.get('body').trigger('keydown', { key: '/' })
        cy.get('body').trigger('keydown', { key: '0' })
        cy.get('body').trigger('keydown', { key: 'Enter' })
        cy.get('[data-testid="display"]').should(
            'have.text',
            '(-1 / 0)|Please do not divide by Zero.'
        )
    })
})
