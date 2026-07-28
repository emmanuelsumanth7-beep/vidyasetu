require('dotenv').config();
const { sendParentNotification } = require('./src/utils/notifier');
sendParentNotification('919876543210', 'Test Message')
  .then(() => console.log('Done'))
  .catch(console.error);
