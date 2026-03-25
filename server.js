//import libraries
const express = require('express')
const nunjucks = require('nunjucks')
let nedb = require("@seald-io/nedb")
const cookieParser = require('cookie-parser')
const multer = require('multer')

//sets up express app
let app = express()

//setting up database variable, storing it in external file
const database = new nedb({ filename: "data.db", autoload: true })

//setting up nunjucks template
nunjucks.configure("views", {
    autoescape: true,
    express: app
})

//add files to public folder
const uploadProcessor = multer({ dest: 'public/uploads/' })
//connect exp to njk
app.set('view engine', 'njk')

//set up middleware
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true })) //accept all types of input, including img uploading 
app.use(cookieParser())

//routes come after middleware, but before listen
//handles cookie stuff, also loads home page
app.get('/', (request, response) => {
    //if there's a cookie, don't make another one, if there isn't, make one
    if (request.cookies.visits) {
        console.log(request.cookies.visits)
        let visits = request.cookies.visits
        visits++
        response.cookie('visits', visits, {
            expires: new Date(Date.now() + 1000 * 60 * 60)
        })
    } else {
        //3 params:
        //1. name of cookie stored
        //2. init val you want to assign
        //3rd: when the cookie expires, in obj format
        let oneHrInMs = 1000 * 60 * 60
        response.cookie("visits", 1, {
            expires: new Date(Date.now() + oneHrInMs)
        })
    }

    let query = {}
    database.find(query, (err, foundData) => {
        response.render('index.njk', { newAlbum: foundData }) //rendering file, taking in 2nd optional parameter which is an object
    })

})

//route that renders the form
app.get('/form', (request, response) => {
    database.find({}, (err, allData) => {
        response.render('form.njk', { newAlbum: allData })
    })
})

//after form is submitted, append data into database and sends us back to home page
app.post('/sign', uploadProcessor.single("albumImg"), (request, response) => {
    console.log(request.body)

    let newAlbum = {
        albumName: request.body.album,
        artistName: request.body.artist,
        info: request.body.info,
        filePath: "/uploads/" + request.file.filename
    }

    console.log(newAlbum)
    database.insert(newAlbum)
    response.redirect('/form')
})

//route to be fetched by the front end for album data loading, database search finds the id of the album clicked on. 
app.get('/sign/:id', (request, response) => {
    let query = {
        _id: request.params.id
    }
    //renders the page (information loading done on front end) after the data has been found
    database.findOne(query, (err, foundData) => {
        database.find({}, (err, allData) => {
            response.render('album.njk', { activeAlbum: foundData, newAlbum: allData })
        })
    })
})

//render about page
app.get('/about', (request, response) => {
    database.find({}, (err, allData) => {
        response.render('about.njk', { newAlbum: allData })
    })
})

app.get('/all-albums', (request, response)=>{
    let query = {}
    database.find(query, (err, foundData) => {
        response.json({ newAlbum: foundData }) //rendering file, taking in 2nd optional parameter which is an object
    })
})

//listener to start server running
app.listen(7001, () => {
    console.log('http://localhost:7001')
})

