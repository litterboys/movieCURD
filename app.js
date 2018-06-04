var express = require('express')
var mongoose = require('mongoose')
var Movie = require('./models/movie')
var path = require('path')
var bodyParser = require('body-parser')
var _ = require('underscore')
var port = process.env.PORT || 8090
var app = express()

mongoose.connect('mongodb://127.0.0.1:27017/decepticon')

app.set('views', './views/pages')
app.set('view engine', 'jade')
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))
app.listen(port)
console.log('server start')

app.locals.moment = require('moment')
// index page
app.get('/', function (req, res) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err)
        }
        res.render('index', {
            title: 'rancheer 首页',
            movies: movies
        })
    })
})

// detail page
app.get('/movie/:id', function (req, res) {
    let id = req.params.id
    Movie.findById(id, function (err, movie) {
        if (err) {
            console.log(err)
        }

        res.render('detail', {
            title: 'rancheer' + movie.title,
            movie: movie
        })
    })
})

// update page
app.get('/movie/update/:id', function (req, res) {
    let id = req.params.id
    Movie.findById(id, function (err, movie) {
        if (err) {
            console.log(err)
        }
        res.render('admin', {
            title: 'rancheer 更新页',
            movie: movie
        })
    })
})

// amdin page
app.get('/admin', function (req, res) {
    res.render('admin', {
        title: 'rancheer 管理页',
        movie: {
            title: '',
            doctor: '',
            country: '',
            year: '',
            poster: '',
            flash: '',
            summary: '',
            language: ''
        }
    })
})

// admin post movie
app.post('/admin/movie/new', function (req, res) {
    var id = req.body.movie._id
    var movieObj = req.body.movie
    var _movie

    if (id !== 'undefined') {
        Movie.findById(id, function (err, movie) {
            _movie = _.extend(movie, movieObj)
            _movie.save(function (err, movie) {
                if (err) {
                    console.log(err)
                }
                res.redirect('/admin/list')
            })
        })
    } else {
        _movie = new Movie({
            title: movieObj.title,
            doctor: movieObj.doctor,
            country: movieObj.country,
            language: movieObj.language,
            poster: movieObj.poster,
            flash: movieObj.flash,
            year: movieObj.year,
            summary: movieObj.summary,
        })
        _movie.save(function (err, movie) {
            if (err) {
                console.log(err)
            }
            res.redirect('/movie/' + movie._id)
        })
    }
})

// list page
app.get('/admin/list', function (req, res) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err)
        }
        res.render('list', {
            title: 'rancheer 列表页',
            movies: movies
        })
    })
})

// delete movie
app.delete('/admin/list', function (req, res) {
    let query = req.query.id
    if (query) {
        Movie.remove({_id: query}, function (err, movie) {
            if (err) {
                console.log(err)
            } else {
                res.json({success: 1})
            }
        })
    }
})

// {
//     doctor: '何塞·帕迪里亚',
//     _id: 3,
//     country: '美国',
//     title: '机械战警',
//     year: 2014,
//     poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5',
//     language: '英语',
//     flash: 'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf',
//     summary: '机械战警机械战警机械战警机械战警机械战警机械战警机械战警机械战警机械战警机械战警机械战警机械战警机械战警'
// }