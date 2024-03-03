# JSON Server starter

Thanks for joining us today and many thanks for your time.

This code challenge is using Typescript, ExpressJS and NodeJS technologies. The basic project is already set up but you're welcome to add more packages if you like.

In /src/app.ts you will find the base code of our API. In /src/**tests**/app.ts you will find a basic unit test for it.

You can use your own tool (Postman, Insomnia etc) to call your API from your local computer once it's alive and running.

This repository is public but not open for merge requests. You should clone it and send back your own repository.

## Setup

This is a boilerplate you can start with. Just clone in your own machine and install the dependencies:

```
$ npm i
```

To run the server:

```
$ npm run dev
```

To run the unit test:

```
$ npm test
```

## Task 1 - Fetch product list

- Write a GET call that will fetch all products available at https://dummyjson.com/products and return them sorted by title (A-Z).
- Output product list must be an array of Product (see type definition).
- Documentation is available at https://dummyjson.com/docs/products

### Solution:

#### URL : http://localhost:3000/products
#### Method GET

#### Response Example
```
[
  {
    "id": 21,
    "title": "- Daal Masoor 500 grams",
    "description": "Fine quality Branded Product Keep in a cool and dry place",
    "price": 20,
    "thumbnail": "https://cdn.dummyjson.com/product-images/21/thumbnail.png"
  },
  ...
]
```

## Task 2 - Login

- Write a POST call that will take username and password from body and will authenticate against the endpoint https://dummyjson.com/auth/login
- If credentials are invalid throw the proper HTTP error.
- As response use type User (see type definition).
- Documentation is available at https://dummyjson.com/docs/auth

### Solution:

#### URL : http://localhost:3000/login
#### Method POST
#### Request Body
```
{
  "username" : string,
  "password : string
}
```
#### Response Example
```

{
  "username": "kminchelle",
  "firstName": "Jeanne",
  "lastName": "Halvorson",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsInVzZXJuYW1lIjoia21pbmNoZWxsZSIsImVtYWlsIjoia21pbmNoZWxsZUBxcS5jb20iLCJmaXJzdE5hbWUiOiJKZWFubmUiLCJsYXN0TmFtZSI6IkhhbHZvcnNvbiIsImdlbmRlciI6ImZlbWFsZSIsImltYWdlIjoiaHR0cHM6Ly9yb2JvaGFzaC5vcmcvSmVhbm5lLnBuZz9zZXQ9c2V0NCIsImlhdCI6MTcwOTMwOTMxOCwiZXhwIjoxNzA5MzEyOTE4fQ.BDmGEVnuiyW0oyPv2M3Cv3Ee5RPj2fYo75KSN7BN09M"
}
```


## Task 3 - Cart

- Write a POST call that will add a product to the cart.
- For this task please do not use Dummy JSON Cart API. You should create your own implementation.
- It will read the payload using CartPayload as type (see type definition) and add to customer's cart (reside in memory for the code challenge).
- You'll need to write a middleware to decode token and block and unauthorized attempt.
- Token payload has customer's ID and you should use that.
- Avoid product duplication.

### Solution:

#### URL : http://localhost:3000/cart
#### Method POST
#### HTTP authentication : Bearer
#### Request Body
```
{
  "productId" : number
}
```
#### Response Example
```
{
  "products": [
    {
      "quantity": 1,
      "product": {
        "id": 3,
        "title": "Samsung Universe 9",
        "description": "Samsung's new variant which goes beyond Galaxy to the Universe",
        "price": 1249,
        "thumbnail": "https://cdn.dummyjson.com/product-images/3/thumbnail.jpg"
      }
    }
  ],
  "total": 1249,
  "totalProducts": 1,
  "customerId": 15
}
```
#### Note: 
In order to address 'avoid product duplication' requirement, I added a quantity property to each product in the cart. When the user adds a product that already exists in the cart, the product doesn't get duplicated, only the product quantity increases by one like in a real world webshop.

Since there was no specification about the response type for this task, I created this response object so the tester of this API knows the current state of the cart after adding one product.


