require('dotenv').config({ path: '.env.test' });

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const https = require('https');
https.globalAgent.options.rejectUnauthorized = false;
