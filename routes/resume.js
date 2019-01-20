var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('../models/User');
var fs = require('fs');

var urlencodedParser = bodyParser.urlencoded({extended: false});


module.exports = function (app) {

    // =====================================================
    // ================ RENDER RESUME ======================
    // =====================================================
    //GET resume page - protected
    var temp_user;
    app.get('/:link', function (req, res) {
        User.findOne( {'local.link' : req.params.link} , function (err, doc) {
            if(err){
                console.log(err);
            } else {
                if(doc == null) {
                    res.redirect('/');
                } else {
                    temp_user = doc.local;
                    res.render('resume', {user_data: doc.local});
                }
            }
        });
    });

    app.get('/resume_user_data1', function (req, res) {
        console.log("Hello" + temp_user);
        res.send({user_data: temp_user});
    });



};