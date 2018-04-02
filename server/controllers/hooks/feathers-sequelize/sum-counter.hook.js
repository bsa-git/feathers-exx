"use strict";

module.exports = async (context) => {
    // Set sequelize property which allows to pass additional Sequelize options
    if (!context.params.sequelize){
        context.params.sequelize = {};
    }
    Object.assign(context.params.sequelize, { raw: true });// { raw: true } is default
    // Get the Sequelize instance. In the generated application via:
    const sequelize = context.app.get('sequelizeClient');
    // Get model
    const Model = sequelize.model('messages');
    // Model findAll
    const messages = await Model.findAll({
        attributes: {include: [[sequelize.fn('sum', sequelize.col('counter')), 'sum_counter']]}
    });
    // Set result
    context.result =  [messages[0].dataValues];
    return context;
};