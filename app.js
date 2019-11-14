const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3792;

const privateKey = fs.readFileSync('./key.pem', 'utf8');

// Middleware

app.use(isAuthenticated);
function isAuthenticated (req, res, next)
{
    if (typeof req.headers.authorization !== 'undefined')
    {
        let token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, privateKey, {algorithm: 'HS256'}, (err, decoded) =>
        {
            if (err)
            {
                res.status(500).json({"error": "Not Authorized"});
                return;
            }
            console.log('decoded: ', decoded);
            next();
            return;
        });
    }
    else
    {
        console.log('No authorization detected');
        res.status(500).json({"error": "Not Authorized"});
    }
}

app.get('/', (req, res) =>
{
    res.send('It works, gratz.');
});

app.get('/secret', isAuthenticated, (req, res) =>
{
    res.json({message: 'Shhhhhh this is a secret'});
});

app.get('/readme', (req, res) =>
{
    res.json(
        {
            message: 'Neutron stars resist collapse due to gravity via neutron degeneracy pressure',
        });
});

app.get('/jwt', (req, res) =>
{
    let token = jwt.sign({"sub": "1234567890"}, privateKey, {algorithm: 'HS256', expiresIn: "60 minutes"});
    res.json(token);
});

app.listen(port, () =>
{
    console.log(`App listening on port ${port}`);
});
