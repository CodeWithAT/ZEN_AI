require('ts-node/register');
const express = require('express');
const app = express();
const sc = require('./src/controllers/systemController');

const routes = [
  ['get', '/api/clients', sc.getClients],
  ['post', '/api/clients', sc.createClient],
  ['delete', '/api/clients/:id', sc.deleteClient],
  ['put', '/api/clients/:id/stage', sc.updateClientStage],
  ['get', '/api/employees', sc.getEmployees],
  ['post', '/api/employees/onboard', sc.onboardEmployee],
  ['get', '/api/leave', sc.getLeaveRequests],
  ['post', '/api/leave', sc.createLeaveRequest],
  ['put', '/api/leave/:id/status', sc.updateLeaveRequestStatus]
];

for (const [method, path, handler] of routes) {
  if (typeof handler !== 'function') {
    console.error(`ERROR: Handler for ${method.toUpperCase()} ${path} is not a function! It is ${typeof handler}`);
    process.exit(1);
  }
}
console.log("All handlers are valid functions.");
