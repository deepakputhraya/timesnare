exports.up = function(knex, Promise) {
    return knex.schema.createTable('focus_sessions', function (table) {
        table.increments('id');
        table.timestamp('start_time').defaultTo(null);
        table.timestamp('end_time').defaultTo(null);
        table.string('video_path');
        table.string('status').defaultTo(null);
    })
};

exports.down = function(knex, Promise) {
    knex.schema.dropTableIfExists('focus_sessions');
};
