/**
 * Module dependencies
 */
var Resource = require('deployd/lib/resource'),
    util = require('util'),
    jwt = require('jsonwebtoken');

/**
 * Module setup.
 */
function JwtWebToken() {
    Resource.apply(this, arguments);
}

util.inherits(JwtWebToken, Resource);

JwtWebToken.label = "Jwt Web Token";
JwtWebToken.defaultPath = "/webtoken";
JwtWebToken.events = ["get"];

JwtWebToken.prototype.clientGeneration = true;
JwtWebToken.prototype.clientGenerationExec = ['validate']

JwtWebToken.basicDashboard = {
    settings: [
        {
            name: 'securityKey',
            type: 'text',
            description: 'Defaults to DPD_JWT_SECURITY_KEY env variable or \'development\'.'
        },
        {
            name: 'expires',
            type: 'number',
            description: 'Number of hours till JWT-Token expires, Defaults to DPD_JWT_EXPIRES'
        },
        {
            name: 'internalOnly',
            type: 'checkbox',
            description: '(Not Implemented Yet) Should this only accept calls internally, might make this somewhat limiting'
        }]
};

/**
 * Module methodes
 */
JwtWebToken.prototype.handle = function (ctx, next) {
    var result = {};
    var key = this.config.securityKey || process.env.DPD_JWT_SECURITY_KEY || "development";
    var expires = this.config.expires || process.env.DPD_JWT_EXPIRES || "-1";
    var token = ctx.req.headers["x-token"] || "";
    var values = {};

    var domain = {
        setValues: function (value) {
            values = value;
        }
    };

    if (ctx.url === "/validate") {
        jwt.verify(token, key, (error, verified) => {
            ctx.done(error, verified);
        });
    } else if (ctx.method === "GET" && this.events.get) {
        this.events.get.run(ctx, domain, err => {
            if (err) {
                ctx.done(err, result);
            } else {
                var options = {};
                console.log(expires);
                if (expires > 0) {
                    options.expiresIn = expires + "h";
                }
                console.log(options);
                result = jwt.sign(values, key, options);
                ctx.done(err, result);
            }
        });
    } else {
        next();
    }

}

/**
 * Module export
 */
module.exports = JwtWebToken;