/* eslint-disable no-constant-condition */
const app = require('express')();
let presidents = [
  {
    id: '43',
    from: '2001',
    to: '2009',
    name: 'George W. Bush'
  },
  {
    id: '44',
    from: '2009',
    to: '2017',
    name: 'Barack Obama'
  },
  {
    id: '45',
    from: '2017',
    name: 'Donald Trump'
  }
];

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//HELPER FUNCTIONS
const nextId = presidents => {
  const highestId = presidents.reduce((a, c) => (c.id > a ? c.id : a), 0);
  return Number.parseInt(highestId) + 1;
};

const firstPresidentId = () => {
  return presidents.map(({ id }) => id).sort()[0];
};

const LastPresidentId = () => {
  const lastId = presidents.map(({ id }) => id).sort();
  return lastId[lastId.length - 1];
};

const validate = (id, name, from, to) => {
  const regex = /^[\w]{4}$/m;
  if (!regex.test(from) || !regex.test(to)) {
    throw 'Invalid From Format';
  } else if (firstPresidentId <= id <= LastPresidentId){
    throw 'Invalid ID Format';
  }
};

// ENDPOINTS
app.get('/api/presidents', (req, res) => {
  res.status(200).send(presidents);
});

app.get('/api/presidents/:id', (req, res) => {
  if(req.params.id < 0 || isNaN(req.params.id)) {
    res.status(404).end();
  }
  const getPresidentById  =  presidents.find(president => president.id === req.params.id);
  res.status(200).json(getPresidentById);
});

app.post('/api/presidents', (req, res, next) => {
  res.set('Content-Type', 'application/json');
  res.setHeader('Location', '/api/presidents/46');

  console.log(req.body);
  const { name, from, to, foo } = req.body;
  const newPresident = { id: nextId(presidents).toString(), name, from, to };
  const err = validate(name, from, to, foo);
  // console.log(newPresident);

  presidents.push(newPresident.toString());
  res.status(201).send(newPresident);
  next(err);
});

app.put('/api/presidents/:id', (req, res, next) => {
  const presidentToBeUpdated = presidents.filter(president => {
    return president.id == req.params.id;
  })[0];

  const requestKeys = Object.keys(req.body);
  requestKeys.forEach(key => {
    presidentToBeUpdated[key] = req.body[key];
  });

  const index = presidents.indexOf(presidentToBeUpdated);
  presidents[index] = presidentToBeUpdated;
  res.status(204).json(presidents[index]);
});

app.delete('/api/presidents/:id', (req, res, next) => {
  let presidentToBeDeleted = presidents.filter(president => {
    return president.id == req.params.id;
  })[0];

  const index = presidents.indexOf(presidentToBeDeleted);
  presidents.splice(index, 1);
  res
    .status(200)
    .send(`President at index ${req.params.id} deleted successfully!`);
});

// ERROR HANDLING MIDDLEWARE
app.use((req, res, next) => {
  const error = new Error(
    'This action cannot be performed, request is invalid!'
  );
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 422);
  res.end();
});

module.exports.app = app;
module.exports.db = () => presidents;
module.exports.nextId = () => nextId(presidents);
