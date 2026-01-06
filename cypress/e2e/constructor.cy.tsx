describe('Данные для ингредиентов', () => {
  beforeEach(function () {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1300, 800);
    cy.visit('/');
  });

  it('добавляем булку', function () {
    cy.get('[data-cy=bun-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=constructor-bun-1]')
      .contains('Краторная булка N-200i')
      .should('exist');
    cy.get('[data-cy=constructor-bun-2]')
      .contains('Краторная булка N-200i')
      .should('exist');
  });

  it('добавляем начинку или соус', function () {
    cy.get('[data-cy=mains-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=sauces-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=constructor-ingredients]')
      .contains('Соус Spicy-X')
      .should('exist');
    cy.get('[data-cy=constructor-ingredients]')
      .contains('Биокотлета из марсианской Магнолии')
      .should('exist');
  });
});
/*Тестирование работы модальных окон*/
describe('открытие модального окна ингредиента', function () {
  this.beforeEach(function () {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1300, 800);
    cy.visit('http://localhost:4000');
  });
  it('открытие модального окна', function () {
    cy.contains('Детали ингедиента').should('not.exist');
    cy.contains('Краторная булка N-200i').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get('#modals').contains('Краторная булка N-200i').should('exist');
  });
  it('закрытие по клику на крестик', function () {
    cy.contains('Краторная булка N-200i').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get('#modals button[aria-label="Закрыть"]').click();
    cy.contains('Детали ингредиента').should('not.exist');
  });
});
/*Тестирование cоздание заказа*/
describe('заказ в модалном окне', function () {
  beforeEach(function () {
    /*Настройка перехватов запросов*/
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', 'api/orders', { fixture: 'post_order.json' }).as(
      'postOrder)'
    );

    window.localStorage.setItem(
      'refreshToken',
      JSON.stringify('test-refreshToken')
    );
    cy.setCookie('accesToken', 'test-accessToken');
    cy.viewport(1300, 800);
    cy.visit('http://localhost:4000');
  });

  afterEach(function () {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('сборка бургера', function () {
    cy.get('[data-cy=bun-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=mains-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=sauces-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=order-summ] button').click();

    /*Проверка номера заказа в модальном окне*/
    cy.get('[data-cy=order-number]').contains('123456').should('exist');

    /*Закрывается модальное окно и проверяется успешность закрытия*/
    cy.get('#modals button[aria-label="Закрыть"]').click();
    cy.get('[data-cy=order-number]').should('not.exist');
    /*Проверяется, что конструктор пуст*/
    cy.get('[data-cy=constructor]');
  });
});
