const express = require('express');
const connect = require('./db');
//const characterController = require('./controller/UserController');
//const cors = require('cors');

const app = express();

// Middleware
//app.use(cors());

const PORT = 4000;




app.use(express.json());
app.use('/api/auth',require('./routes/auth'))

app.use('/api/notes',require('./routes/notes'))
app.listen(PORT, async () => {
    try {
        await connect();
        console.log(`Server started on port ${PORT}`);
    } catch (error) {
        console.error(error);
    }
});
