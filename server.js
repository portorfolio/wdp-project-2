//import libraries
const express = require('express')
const nunjucks = require('nunjucks')
let nedb = require("@seald-io/nedb")
const cookieParser = require('cookie-parser')

//sets up express app
let app = express()

//setting up database variable, storing it in external file
let database = new nedb({filename: "data.db", autoload: true})

//setting up nunjucks template
nunjucks.configure("views", {
    autoescape: true,
    express: app
})

//connect exp to njk
app.set('view engine', 'njk')

//set up middleware
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true })) //accept all types of input, including img uploading 
app.use(cookieParser())

//create javascript object with datas to store
let datatosave = {
    albumName: "",
    artist: ""
}
//insert data into database
database.insert(datatosave, function(err, newDocs){
    console.log("err:", err);
    console.log("newDocs: ", newDocs)
})

//
app.get('/form', (request,response)=>{
    response.render("form.njk")
})

app.post('/submitted', (request, response)=>{
    console.log(request.body)
    let newAlbum = {
        albumName: request.body.title,
        artist: request.body.artist,
    }

    database.insert(albumName)
    response.redirect('/')
})

//routes come after middleware, but before listen
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

    response.render('index.njk', {numVisits: request.cookies.visits}) //rendering file, taking in 2nd optional parameter which is an object

})

app.get('/about', (request,response) =>{
    response.render('about.njk')
})

//listener to start server running
app.listen(7001, () => {
    console.log('http://localhost:7001')
})

