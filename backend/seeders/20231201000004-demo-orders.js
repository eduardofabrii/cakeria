"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM users;",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0) return;

    const orders = await queryInterface.bulkInsert(
      "orders",
      [
        {
          user_id: users[0].id,
          status: "complete",
          total: 89.9,
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
        {
          user_id: users[1].id,
          status: "paid",
          total: 350.0,
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
        {
          user_id: users[0].id,
          status: "pending",
          total: 78.5,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { returning: true }
    );

    const createdOrders = await queryInterface.sequelize.query(
      "SELECT id FROM orders ORDER BY id DESC LIMIT 3;",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const products = await queryInterface.sequelize.query(
      "SELECT id, price FROM products;",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (products.length === 0) return;

    const orderProducts = [];

    orderProducts.push({
      order_id: createdOrders[2].id,
      product_id: products[0].id,
      quantity: 1,
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    });
    orderProducts.push({
      order_id: createdOrders[2].id,
      product_id: products[6].id,
      quantity: 1,
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    });

    orderProducts.push({
      order_id: createdOrders[1].id,
      product_id: products[1].id,
      quantity: 1,
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    });

    orderProducts.push({
      order_id: createdOrders[0].id,
      product_id: products[2].id,
      quantity: 1,
      created_at: new Date(),
      updated_at: new Date(),
    });
    orderProducts.push({
      order_id: createdOrders[0].id,
      product_id: products[3].id,
      quantity: 10,
      created_at: new Date(),
      updated_at: new Date(),
    });

    await queryInterface.bulkInsert("order_products", orderProducts);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("order_products", null, {});
    await queryInterface.bulkDelete("orders", null, {});
  },
};
