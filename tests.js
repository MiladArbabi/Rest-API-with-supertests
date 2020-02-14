/* global describe, it */
const assert = require('assert');
const request = require('supertest');
const api = require('.');
const app = api.app;

describe('The /presidents API', function() {
  it('returns all presidents', function(done) {
    request(app)
      .get('/api/presidents')
      .set('Accept', 'application/json')
      .expect(200, done);
  });
});
