// Basic Lib Imports
const app = require('./app');

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server started on port http://127.0.0.1:${port}/`));
