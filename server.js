const app = require('./app');
const connectDB = require('./db/db.js');

const port = 3999;

connectDB();


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${3999}`);
});