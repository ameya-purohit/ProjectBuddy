const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

// Middleware
app.use('/static', express.static('static'));
app.use(express.urlencoded({ extended: true }));

// View Engine Setup
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Database Connection (db of that name must exist) 
mongoose.connect('mongodb://localhost/project-db', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define Project Schema and Model
const ProjectSchema = new mongoose.Schema({
    Project_ID: String,
    Institute_name: String,
    Professor_name: String, 
    Project_domain: String,
    Project_desc: String,
    Students_aff: Number,
    Students_req: Number,
});

const Project = mongoose.model('Project', ProjectSchema);

// Routes 
app.get('/', (req, res) => {
    res.render('index.pug');  
}); 

app.get('/sign-up', (req, res) => {
    res.render('popup.pug');
});

app.get('/student-sign-up', (req, res) => {
    res.render('sign-up.pug');
});  
 
app.get('/professor-sign-up', (req, res) => {
    res.render('prof.pug');
});
   
app.get('/login', (req, res) => {
    res.render('login.pug');
});

app.get('/projectEntry', (req, res) => {
    const params = { title: 'Project Entry' };
    res.render('projectEntry.pug', params);
});
 
app.post('/projectEntry', (req, res) => { 
    const projectData = req.body;
    const newProject = new Project(projectData); 

    newProject.save()  
        .then(() => { 
            res.send('This item has been saved to the database');
        })
        .catch((error) => {
            console.error('Error saving data to the database:', error);
            res.status(500).send('Item was not saved to the database');
        });
}); 

// Start the Server
app.listen(port, () => {
    console.log(`The application started successfully on port ${port}`);
}); 

