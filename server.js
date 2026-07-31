const app = require('./app');
const connectDB = require('./db/db.js');

const port = process.env.PORT || 3999;

connectDB();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});