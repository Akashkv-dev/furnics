
const handlebars = require('handlebars');
const moment = require('moment'); // For date manipulation

// Register a handlebars helper for formatting dates
handlebars.registerHelper('formatDate', function(date) {
  return moment(date).format('DD/MM/YYYY');
});




