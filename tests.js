const assert = require('assert');
const request = require('supertest');
const api = require('.');
const app = api.app;

describe('/api/presidents', () => {
  describe('GET', () => {
    it('should return all presidents', function (done) {
      request(app)
        .get('/api/presidents')
        .end((err, res) => {
          assert.notStrictEqual(err, undefined);
          assert.strictEqual(res.status, 200);
          assert.strictEqual(res.type, 'application/json');
          assert.deepStrictEqual(JSON.parse(res.text), api.db());
          done();
        });
    });
  });

  describe('POST', () => {
    it.only('adds a new president', function (done) {
      const id = api.nextId();
      const expected = [...api.db(), { id, name: 'Andrew Yang', from: '2020'} ];
  
      request(app)
        .post('/api/presidents')
        .set('Content-Type', 'application/json')
        .send({ name: 'Andrew Yang', from: '2020' })
        .end((err, res) => {          
          // assert.notStrictEqual(err, undefined);
          // assert.strictEqual(res.status, 201);
          // assert.strictEqual(res.type, 'application/json');
          // assert.strictEqual(res.header['location'], `/api/presidents/${id}`);
          // assert.deepStrictEqual(JSON.parse(res.text), {id});
          // assert.deepStrictEqual(expected, api.db());
          done();
        });
    });
  
    it.only('rejects invalid content type', (done) => {
      request(app)
        .post('/api/presidents')
        .set('Content-Type', 'text/plain')
        .send('hi')
        .end((err, res) => {
          assert.notStrictEqual(err, undefined);
          // assert.strictEqual(res.status, 415);
          done();
        });
    });
  
    it.only('rejects request with fewer than required keys', (done) => {
      request(app)
        .post('/api/presidents')
        .set('Content-Type', 'application/json')
        .send({name: 'Andrew Yang'})
        .end((err, res) => {
          assert.notStrictEqual(err, undefined);
          // assert.strictEqual(res.status, 422);
          done();
        });
    });

    it.only('rejects request with unknown keys', (done) => {
      request(app)
        .post('/api/presidents')
        .set('Content-Type', 'application/json')
        .send({name: 'Andrew Yang', from: 2020, to: 2024, foo: 'bar'})
        .end((err, res) => {
          assert.notStrictEqual(err, undefined);
          // assert.strictEqual(res.status, 422);
          done();
        });
    });

    it.only('rejects request with invalid from year', (done) => {
      request(app)
        .post('/api/presidents')
        .set('Content-Type', 'application/json')
        .send({name: 'Andrew Yang', from: 11111})
        .end((err, res) => {
          assert.notStrictEqual(err, undefined);
          assert.strictEqual(res.status, 422);
          done();
        });
    });

    it.only('rejects request with invalid to year', (done) => {
      request(app)
        .post('/api/presidents')
        .set('Content-Type', 'application/json')
        .send({name: 'Andrew Yang', from: 2020, to: 999999})
        .end((err, res) => {
          assert.notStrictEqual(err, undefined);
          assert.strictEqual(res.status, 422);
          done();
        });
    });
  });
});

describe('/api/presidents/:id', () => {
  describe('GET', () => {
    it.only('returns president by id', (done) => {
      const id = 44;
      request(app)
        .get(`/api/presidents/${id}`)
        .end((err, res) => {
          assert.notStrictEqual(err, undefined);
          assert.strictEqual(res.status, 200);
          assert.strictEqual(res.type, 'application/json');
          assert.deepStrictEqual(JSON.parse(res.text), api.db().find((x) => x.id == id));
          done();
        });
    });

    it('rejects invalid ids', (done) => {
      const id = -100;
      request(app)
        .get(`/api/presidents/${id}`)
        .end((err, res) => {
          assert.notStrictEqual(err, undefined);
          assert.strictEqual(res.status, 404);
          done();
        });
    });
  });

  describe('PUT', () => {
    it('updates an entry', (done) => {
      const id = 44;
      request(app)
        .put(`/api/presidents/${id}`)
        .send({name: 'John Yang', from: 2020})
        .end((err, res) => {
          assert.notStrictEqual(err, undefined);
          assert.strictEqual(res.status, 204);
          assert.strictEqual((api.db().find((x) => x.id == id)).name, 'John Yang');
          done();
        });
    });

    it('rejects request with fewer than required keys', (done) => {
      const id = 44;
      const expected = api.db().find((x) => x.id == id);
      request(app)
        .put(`/api/presidents/${id}`)
        .send({name: 'John Yang', to: 2024})
        .end((err, res) => {
          assert.notStrictEqual(err, undefined);
          assert.strictEqual(res.status, 422);
          assert.strictEqual(api.db().find((x) => x.id == id), expected);
          done();
        });
    });

    it('rejects request with unknown keys', (done) => {
      const id = 44;
      const expected = api.db().find((x) => x.id == id);
      request(app)
        .put(`/api/presidents/${id}`)
        .send({name: 'John Yang', from: 2020, foo: 'bar'})
        .end((err, res) => {
          assert.notStrictEqual(err, undefined);
          assert.strictEqual(res.status, 422);
          assert.strictEqual(api.db().find((x) => x.id == id), expected);
          done();
        });
    });

    it('rejects request with invalid year', (done) => {
      const id = 44;
      const expected = api.db().find((x) => x.id == id);
      request(app)
        .put(`/api/presidents/${id}`)
        .send({name: 'John Yang', from: 'hi'})
        .end((err, res) => {
          assert.notStrictEqual(err, undefined);
          assert.strictEqual(res.status, 422);
          assert.strictEqual(api.db().find((x) => x.id == id), expected);
          done();
        });
    });
  });

  describe('DELETE', () => {
    it('removes specified element', async () => {
      const id = 44;
      const original = [ ...api.db() ];

      await request(app).get(`/api/presidents/${id}`).expect(200);
      await request(app).delete(`/api/presidents/${id}`).expect(204);
      await request(app).get(`/api/presidents/${id}`).expect(404);

      const actual = api.db();
      assert.strictEqual(original.length - 1, actual.length);
    });

    it('rejects invalid ids', (done) => {
      const id = -100;
      request(app)
        .delete(`/api/presidents/${id}`)
        .end((err, res) => {
          assert.notStrictEqual(err, undefined);
          assert.strictEqual(res.status, 404);
          done();
        });
    });
  });
});