# Resting API

In this test we want you to create a RESTful API, using the Express framework.

The resource you will work with are American presidents and your RESTful resource should be located at `/api/presidents`

The data for each president is a local array called `presidents`.

Here is one president represented as JSON:

```json
{
  "id": "44",
  "from": "2009",
  "to": "2017",
  "name": "Barack Obama"
}
```

For each president the following rules apply:
* `id` is required. The next id can be calculated using the supplied `nextId`-function
* `name` is required
* `from` is required and should be the year as a YYYY-string
* `to` is not required as some presidents has not ended their tenture ... yet.

RESTful means that you should adhere to the REST style and supply endpoints for:

- Create (POST) - creating a new president... Who knows - it can happen.
- Read (GET) - endpoints for reading one president and listing all presidents.
- Update (PUT) - to update president data.
- Delete (DELETE) - to delete one president.

Let the REST constraints guide you in how to structure the endpoints.
Ensure to return the correct status codes.

We want you to demonstrate that you can write RESTful APIs and return appropriate results, status codes and potential error messages from your API endpoints.

## Handling errors

Your Web API should never crash, but handle any potential errors in a graceful manner. Use the status codes where you can, to help the client to understand what has happened, if an error has happened.

## A word on the "database"

The "database" in this test is implemented as an array, a local variable called `presidents`.

Your test can get the current content of the array using the exported `module.exports.db = () => presidents;` function.

Your tests might need to calculate the next id for a president you create, for this purpose there's an exported function `module.exports.nextId = () => nextId(presidents);`

You are supposed to update the contents of the presidents array, while doing adds, deletes and updates. Our tests will check that the array content has been modified. Notice that the `presidents` array is declared with `let` and hence can be modified.

It's a good idea to read up on [arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) and it's [methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#Methods_2) to easier cope with the things you need to do with the array.

## Boiler plate code and scripts

We have supplied a very simple first starting test and a skeleton implementation, for you to start with.

There are also a `npm test` and a `npm run lint` script that you will find helpful.

## Handing in your solution

Please submit your `index.js` file to your Google Drive i a new directory called `restingAPI` inside the directory with your name.
