'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // API_ROOT: '"http://localhost:8091"',
  API_ROOT: '"http://192.168.0.244:8091"',
  FILESERVER_ROOT: '"http://192.168.0.244:8091"'
})
