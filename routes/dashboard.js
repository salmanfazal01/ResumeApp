var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('../models/User');
var fs = require('fs');

var urlencodedParser = bodyParser.urlencoded({extended: false});

var multer = require('multer');
var fs = require('fs');
var path = require('path');
var config = require('../config/images');

var temp = " ";


module.exports = function (app, passport) {

    // =====================================================
    // ================ RENDER DASHBOARD ===================
    // =====================================================
    //GET dashboard page - protected
    app.get('/dashboard', isLoggedIn, function (req, res) {
        res.render('dashboard', {
            user: req.user //get user from session
        });
    });
    app.get('/get_user_data', isLoggedIn, function (req, res) {
        res.send({user: req.user});
    });

    // =====================================================
    // ==================== USER ===========================
    // =====================================================

    //user security
    app.post('/post_user_security_link', function (req, res) {

        User.findOne({'local.link': req.body.link.toLowerCase()}, function (err, obj) {

            if (obj) {
                res.send("Exists");
            } else {
                User.findById(req.user._id, function (err, doc) {
                    if (err) {
                        console.log('no entry found');
                    }
                    doc.local.link = req.body.link.toLowerCase();
                    doc.save(function (err) {
                        if (err) {
                            return err;
                        } else {
                            res.send("Success");
                        }
                    });
                });
            }
        });
    });

    //user change password
    app.post('/post_user_security_pass', function (req, res, next) {
        User.findById(req.user._id, function (err, doc) {
            if (err) {
                console.log('no entry found');
            }

            if (!doc.validPassword(req.body.old_pass)) {
                res.send("error");
            } else {
                doc.local.password = doc.generateHash(req.body.new_pass);

                doc.save(function (err) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send("success");
                    }
                });
            }
        });
    });


    //user basic information
    app.post('/post_user_basic', urlencodedParser, function (req, res) {

        User.findById(req.user._id, function (err, doc) {
            if (err) {
                console.log('no entry found');
            }
            doc.local.basic.name = req.body.name;
            doc.local.basic.occupation = req.body.occupation;
            doc.save(function (err) {
                if (err) {
                    return err;
                } else {
                    res.send("Success");
                }
            });
        });
    });

    //user basic profile image upload
    app.post('/upload_user', function (req, res) {
        User.findById(req.user._id, function (err, doc) {
            upload_user_image(req, res, function (err) {

                if (err) {
                    res.send("error");
                } else {

                    console.log("File Name: " + req.file.filename);
                    doc.local.basic.user_image = req.file.filename;
                    doc.save(function (err) {
                        if (err) {
                            return err;
                        } else {
                            res.send("Worked Success");
                        }
                    });
                }
            });
        });
    });

    //user contact and social
    app.post('/post_user_social', function (req, res) {
        User.findById(req.user._id, function (err, doc) {
            if (err) {
                console.log('no entry found');
            }
            doc.local.social = req.body;
            doc.save(function (err) {
                if (err) {
                    return err;
                } else {
                    res.send("Success");
                }
            });
        });
    });


    // =====================================================
    // ================== EDUCATION ========================
    // =====================================================
    app.post('/post_education', function (req, res) {
        User.findById(req.user._id, function (err, doc) {
            if (err) {
                console.log('no entry found');
            }
            doc.local.education.splice((req.body.id) - 1, 0, req.body);
            doc.save(function (err) {
                if (err) {
                    return err;
                } else {
                    res.send("Success");
                }
            });
        });
    });

    app.put('/put_education/:id', function (req, res) {
        var row_id = parseInt(req.params.id); //get education id from table row

        //first, get the current logged in user
        User.findById(req.user._id, function (err, doc) {
            if (err) {
                console.log('no entry found');
            }

            console.log("Row id: " + row_id);

            //match the table row id with the id in users education model
            var education = doc.local.education;
            for (var i = 0; i < education.length; i++) {
                console.log(education[i].id + "   " + row_id);
                if (education[i]["id"] == row_id) {
                    education[i] = req.body;
                    doc.save(function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.send("Success");
                        }
                    });

                    break;
                }
            }
        });
    });

    app.delete('/delete_education/:id', function (req, res) {
        var row_id = parseInt(req.params.id); //get education id from table row
        console.log(row_id);

        //first, get the current logged in user
        User.findById(req.user._id, function (err, doc) {
            if (err) {
                console.log('no entry found');
            }
            //match the table row id with the id in users education model
            var education = doc.local.education;
            for (var i = 0; i < education.length; i++) {
                console.log(education[i].id + "   " + row_id);
                if (education[i]["id"] == row_id) {
                    education.splice(i, 1);
                    doc.save(function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.send("Success");
                        }
                    });
                    break;
                }
            }
        });
    });


    // =====================================================
    // ================ EXPERIENCE =========================
    // =====================================================
    app.post('/post_experience', function (req, res) {
        User.findById(req.user._id, function (err, doc) {
            if (err) {
                console.log('no entry found');
            }
            doc.local.experience.splice((req.body.id) - 1, 0, req.body);
            doc.save(function (err) {
                if (err) {
                    return err;
                } else {
                    res.send("Success");
                }
            });
        });
    });

    app.put('/put_experience/:id', function (req, res) {
        var row_id = parseInt(req.params.id); //get experience id from table row

        //first, get the current logged in user
        User.findById(req.user._id, function (err, doc) {
            if (err) {
                console.log('no entry found');
            }

            console.log("Row id: " + row_id);

            //match the table row id with the id in users experience model
            var experience = doc.local.experience;
            for (var i = 0; i < experience.length; i++) {
                console.log(experience[i].id + "   " + row_id);
                if (experience[i]["id"] == row_id) {
                    experience[i] = req.body;
                    doc.save(function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.send("Success");
                        }
                    });
                    break;
                }
            }
        });
    });

    app.delete('/delete_experience/:id', function (req, res) {
        var row_id = parseInt(req.params.id); //get experience id from table row

        //first, get the current logged in user
        User.findById(req.user._id, function (err, doc) {
            if (err) {
                console.log('no entry found');
            }

            console.log("Row id: " + row_id);

            //match the table row id with the id in users experience model
            var experience = doc.local.experience;
            for (var i = 0; i < experience.length; i++) {
                console.log(experience[i].id + "   " + row_id);
                if (experience[i]["id"] == row_id) {
                    experience.splice(i, 1);
                    doc.save(function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.send("Success");
                        }
                    });
                    break;
                }
            }
        });
    });


    // =====================================================
    // ================== PROJECT ==========================
    // =====================================================
    app.post('/post_project', function (req, res) {
        User.findById(req.user._id, function (err, doc) {
            if (err) {
                console.log('no entry found');
            }
            doc.local.projects.splice((req.body.id) - 1, 0, req.body);
            doc.save(function (err) {
                if (err) {
                    return err;
                } else {
                    res.send("Success");
                }
            });
        });
    });

    //upload project image
    app.post('/upload_project/:id', function (req, res) {

        //set the selected row id
        var project_id = parseInt(req.params.id);

        //Get the logged in user
        User.findById(req.user._id, function (err, doc) {

            //set the project id
            for(var i = 0; i < doc.local.projects.length; i++){
                if(doc.local.projects[i]["id"] == project_id+1){
                    console.log(doc.local.projects[i]._id);
                    temp = doc.local.projects[i]._id;
                }
            }

            //upload function
            upload_project_image(req, res, function (err) {

                if(err) {
                    res.send("error");
                } else {

                    console.log("File Name: " + req.file.filename);

                    for (var i = 0; i < doc.local.projects.length; i++) {
                        console.log("Loop project Id: " + doc.local.projects[i]["id"]);
                        if (doc.local.projects[i]["id"] == project_id + 1) {
                            doc.local.projects[i]["image"] = req.file.filename;
                        }
                    }

                    doc.save(function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.send("Worked Success");
                        }
                    });
                }
            });
        });
    });

    //UPDATE PROJECT
    app.put('/put_project/:id', function (req, res) {
        var row_id = parseInt(req.params.id); //get project id from table row

        //first, get the current logged in user
        User.findById(req.user._id, function (err, doc) {
            if (err) {
                console.log('no entry found');
            }

            //match the table row id with the id in users project model
            var project = doc.local.projects;
            for (var i = 0; i < project.length; i++) {
                console.log(project[i].id + "   " + row_id);
                if (project[i]["id"] == row_id) {
                    project[i] = req.body;
                    doc.save(function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.send("Success");
                        }
                    });
                    break;
                }
            }
        });
    });

    //DELETE PROJECT
    app.delete('/delete_project/:id', function (req, res) {
        var row_id = parseInt(req.params.id); //get project id from table row

        //first, get the current logged in user
        User.findById(req.user._id, function (err, doc) {
            if (err) {
                console.log('no entry found');
            }

            console.log("Row id: " + row_id);

            //match the table row id with the id in users project model
            var project = doc.local.projects;
            for (var i = 0; i < project.length; i++) {
                console.log(project[i].id + "   " + row_id);
                if (project[i]["id"] == row_id) {

                    //delete project image
                    fs.unlink('./public/uploads/projects/'+project[i]["image"], function (err) {
                        if (err) console.log("error");
                        console.log('File deleted!');
                    });

                    project.splice(i, 1);
                    doc.save(function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.send("Success");
                        }
                    });
                    break;
                }
            }
        });
    });


    // =====================================================
    // =================== OTHER ===========================
    // =====================================================

    //statement section
    app.post('/post_statement', function (req, res) {
        User.findById(req.user._id, function (err, doc) {
            if (err) {
                console.log('no entry found');
            }
            doc.local.statement = req.body.statement;
            doc.save(function (err) {
                if (err) {
                    return err;
                } else {
                    res.send("Success");
                }
            });
        });
    });

    //achievement section
    app.post('/post_achievements', function (req, res) {
        User.findById(req.user._id, function (err, doc) {
            if (err) {
                console.log('no entry found');
            }
            doc.local.achievements.splice((req.body.id) - 1, 0, req.body);
            doc.save(function (err) {
                if (err) {
                    return err;
                } else {
                    res.send("Success");
                }
            });
        });
    });

    app.put('/put_achievement/:id', function (req, res) {
        var row_id = parseInt(req.params.id); //get achievement id from table row

        //first, get the current logged in user
        User.findById(req.user._id, function (err, doc) {
            if (err) {
                console.log('no entry found');
            }

            console.log("Row id: " + row_id);

            //match the table row id with the id in users project model
            var achievement = doc.local.achievements;
            for (var i = 0; i < achievement.length; i++) {
                console.log(achievement[i].id + "   " + row_id);
                if (achievement[i]["id"] == row_id) {
                    achievement[i] = req.body;
                    doc.save(function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.send("Success");
                        }
                    });
                    break;
                }
            }
        });
    });

    app.delete('/delete_achievement/:id', function (req, res) {
        var row_id = parseInt(req.params.id); //get achievement id from table row

        //first, get the current logged in user
        User.findById(req.user._id, function (err, doc) {
            if (err) {
                console.log('no entry found');
            }

            console.log("Row id: " + row_id);

            //match the table row id with the id in users project model
            var achievement = doc.local.achievements;
            for (var i = 0; i < achievement.length; i++) {
                console.log(achievement[i].id + "   " + row_id);
                if (achievement[i]["id"] == row_id) {
                    achievement.splice(i, 1);
                    doc.save(function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.send("Success");
                        }
                    });
                    break;
                }
            }
        });
    });

    //Other page - Technical section
    //add new technical
    app.post('/post_technical', function (req, res) {
        User.findById(req.user._id, function (err, doc) {
            if (err) {
                console.log('no entry found');
            }
            doc.local.technical.splice((req.body.id) - 1, 0, req.body);
            doc.save(function (err) {
                if (err) {
                    return err;
                } else {
                    res.send("Success");
                }
            });
        });
    });

    app.put('/put_technical/:id', function (req, res) {
        var row_id = parseInt(req.params.id); //get technical id from table row

        //first, get the current logged in user
        User.findById(req.user._id, function (err, doc) {
            if (err) {
                console.log('no entry found');
            }

            console.log("Row id: " + row_id);

            //match the table row id with the id in users technical model
            var technical = doc.local.technical;
            for (var i = 0; i < technical.length; i++) {
                console.log("Hi" + typeof(technical[i].id) + "   " + typeof(row_id));
                if (technical[i]["id"] == row_id) {
                    console.log(technical[i]);
                    console.log(req.body);
                    technical[i] = req.body;
                    doc.save(function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.send("Success");
                        }
                    });
                    break;
                }
            }
        });
    });

    app.delete('/delete_technical/:id', function (req, res) {
        var row_id = parseInt(req.params.id); //get technical id from table row

        //first, get the current logged in user
        User.findById(req.user._id, function (err, doc) {
            if (err) {
                console.log('no entry found');
            }

            console.log("Row id: " + row_id);

            //match the table row id with the id in users technical model
            var technical = doc.local.technical;
            for (var i = 0; i < technical.length; i++) {
                console.log("dumb" + technical[i].id + "   " + row_id);
                if (technical[i]["id"] == row_id) {
                    technical.splice(i, 1);
                    doc.save(function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.send("Success");
                        }
                    });
                    break;
                }
            }
        });
    });


    //Other page - qualities section
    //add new qualities
    app.post('/post_qualities', function (req, res) {
        User.findById(req.user._id, function (err, doc) {
            if (err) {
                console.log('no entry found');
            }
            doc.local.qualities.splice((req.body.id) - 1, 0, req.body);
            doc.save(function (err) {
                if (err) {
                    return err;
                } else {
                    res.send("Success");
                }
            });
        });
    });

    app.put('/put_qualities/:id', function (req, res) {
        var row_id = parseInt(req.params.id); //get qualities id from table row

        //first, get the current logged in user
        User.findById(req.user._id, function (err, doc) {
            if (err) {
                console.log('no entry found');
            }

            console.log("Row id: " + row_id);

            //match the table row id with the id in users qualities model
            var qualities = doc.local.qualities;
            for (var i = 0; i < qualities.length; i++) {
                console.log(qualities[i].id + "   " + row_id);
                if (qualities[i]["id"] == row_id) {
                    qualities[i] = req.body;
                    doc.save(function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.send("Success");
                        }
                    });
                    break;
                }
            }
        });
    });

    app.delete('/delete_qualities/:id', function (req, res) {
        var row_id = parseInt(req.params.id); //get qualities id from table row

        //first, get the current logged in user
        User.findById(req.user._id, function (err, doc) {
            if (err) {
                console.log('no entry found');
            }

            console.log("Row id: " + row_id);

            //match the table row id with the id in users qualities model
            var qualities = doc.local.qualities;
            for (var i = 0; i < qualities.length; i++) {
                console.log(qualities[i].id + "   " + row_id);
                if (qualities[i]["id"] == row_id) {
                    qualities.splice(i, 1);
                    doc.save(function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.send("Success");
                        }
                    });
                    break;
                }
            }
        });
    });

    //Other page - languages section
//add new languages
    app.post('/post_languages', function (req, res) {
        User.findById(req.user._id, function (err, doc) {
            if (err) {
                console.log('no entry found');
            }
            doc.local.languages.splice((req.body.id) - 1, 0, req.body);
            doc.save(function (err) {
                if (err) {
                    return err;
                } else {
                    res.send("Success");
                }
            });
        });
    });

    app.put('/put_languages/:id', function (req, res) {
        var row_id = parseInt(req.params.id); //get languages id from table row

        //first, get the current logged in user
        User.findById(req.user._id, function (err, doc) {
            if (err) {
                console.log('no entry found');
            }

            console.log("Row id: " + row_id);

            //match the table row id with the id in users languages model
            var languages = doc.local.languages;
            for (var i = 0; i < languages.length; i++) {
                console.log(languages[i].id + "   " + row_id);
                if (languages[i]["id"] == row_id) {
                    languages[i] = req.body;
                    doc.save(function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.send("Success");
                        }
                    });
                    break;
                }
            }
        });
    });

    app.delete('/delete_languages/:id', function (req, res) {
        var row_id = parseInt(req.params.id); //get languages id from table row

        //first, get the current logged in user
        User.findById(req.user._id, function (err, doc) {
            if (err) {
                console.log('no entry found');
            }

            console.log("Row id: " + row_id);

            //match the table row id with the id in users languages model
            var languages = doc.local.languages;
            for (var i = 0; i < languages.length; i++) {
                console.log(languages[i].id + "   " + row_id);
                if (languages[i]["id"] == row_id) {
                    languages.splice(i, 1);
                    doc.save(function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.send("Success");
                        }
                    });
                    break;
                }
            }
        });
    });


};

// Check is user is logged in
function isLoggedIn(req, res, next) {
    //if user is authenticated in session then carry on
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/#accounts');
}

//USER PROFILE IMAGE
//multer config to upload images
var user_image_storage = multer.diskStorage({// used to determine within which folder the uploaded files should be stored.
    destination: './public/uploads/users/',
    filename: function (req, file, callback) {
        console.log(file);
        //err, name (filename + data + extension)
        callback(null, req.user.local.email + path.extname(file.originalname));
    }
});
//Configuring file system storage (recommended to store images)
var upload_user_image = multer({
    storage: user_image_storage,
    limits: {fileSize: 4000000} //4 MB
}).single('user_image');


//PROJECT IMAGE
//multer config to upload images
var projects_image_storage = multer.diskStorage({// used to determine within which folder the uploaded files should be stored.
    destination: './public/uploads/projects/',
    filename: function (req, file, callback) {
        callback(null, temp + path.extname(file.originalname));
        //callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

//Configuring file system storage (recommended to store images)
var upload_project_image = multer({
    storage: projects_image_storage,
    limits: {fileSize: 4000000} //4 MB
}).single('project_image');





















