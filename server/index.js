const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const port = 3000;

// Require routes
const routes = require('./routes');

// Use morgan to log requests
app.use(morgan('combined'));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Middleware to log request payload
app.use((req, res, next) => {
    console.log('Request payload:', req.file, req.body);
    next();
});

// Use routes
app.use(routes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});