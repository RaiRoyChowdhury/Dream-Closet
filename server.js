const app = require('./app');
const connectDB = require('./db/db.js');

const port = ;

connectDB();


app.listen(port, () => {
    console.log(`Server is running on https://dream-closet-cd49.onrender.com${}`);
});