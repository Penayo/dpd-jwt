# DPD-JWT

Simple module to create JWT tokens with Deployd

## Usage

### Setup

In your dpd directory type,

`npm install dpd-jwt`

Add a Jwt Web Token resource in the dashboard, and set the configs.

### GET/POST

To get a JWT token you will need to use a POST, either internally, or externally using either REST or dpd

To get a Token on the client, use and then set a header `x-token`:

    dpd.jwtwebtoken.get(function(error, result)) {
        // work with token that is returned
    }
    
If you wish to use HTTP you can send a GET request to `/jwtwebtoken` and make sure that any user auth info is set in the headers/cookies, if you are using the `User Collection` that would be the sid cookie.

In the `ON GET` tab/event you need to validate the user and set the values object:

    var val = {};
    if (me) {
        // Logged in user
        val = {
            sid: 0293420kdfjsd09fs0d9fsd, // from the cookie that is set by the user collection when a user logs in
            somevalue: “anything here”,
            uid: me.id
        } 
    } else {
        // Anonymous user
        val = {object that describes an anonymous user};
        // OR
        cancel(“Anonymous access denied”, 401);
    }

    // Set the values
    setValues(val);

    
To get the validated and decoded result use (either on the client, or even in an event on the server):

    dpd.jwtwebtoken.validate(function(error, result) {
        // work with error or result
    }
    
To validate over HTTP make sure that the `x-token` header is set and make a GET request to `/validate`. Will return null/error or the decoded token object.

### Headers

dpd-jwt uses headers to pass the JWT token around, you will need to set the header of `x-token` once you recieve a token using the post command.

### On Post

In the `ON POST` event for the JwtWebToken Resource you are free to use `setValues(values)` to set the values/tokens you want to use in the JWTWebToken, values being an Object. You can use what ever validation you wish.

## TODO

* Add more options to config to allow for RSA key files, etc
* Be able to send the Token with validate function with out using headers