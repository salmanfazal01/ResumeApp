var user_data; // all user json data
var row_id; // save row clicked id

$(document).ready(function () {

    // fill for with values from server/database
    initialize();

    //enable popups
    $(function () {
        $('[data-toggle="popover"]').popover()
    });


    //====================================================================
    //==================== USER PAGE -> DATABASE =========================
    //====================================================================
    //User page - security section
    $('#user_security_form_pass').on('submit', function (event) {
        console.log("Hello Fham");
        event.preventDefault();

        $.ajax({
            url: '/post_user_security_pass',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                old_pass: $('input[name="security_pass"]').val(),
                new_pass: $('input[name="security_newpass_confirm"]').val()
            }),
            success: function (response) {
                if (response == "success") {
                    $("#password_changed_text").show().delay(3000).fadeOut();
                    $('#user_security_form_pass').each(function () {
                        this.reset();
                    });
                } else {
                    $('input[name="security_pass"]').val('');
                    $("#password_wrong_text").show().delay(3000).fadeOut();
                }
            }
        });
    });

    //User page - update form link
    $('#user_security_form_link').on('submit', function (event) {
        event.preventDefault();

        $.ajax({
            url: '/post_user_security_link',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                link: $('input[name="security_link"]').val()
            }),
            success: function (response) {
                if(response == "Success"){
                    $("#security_saved").show().delay(3000).fadeOut();
                } else {
                    $("#security_exists").show().delay(3000).fadeOut();
                }
            }
        });
    });

    // User page - basic section
    $('#upload_user_image').on('submit', function (event) {
        event.preventDefault();

        var formData = new FormData(this);
        console.log(formData);

        $.ajax({
            url: 'upload_user',
            type: 'POST',
            data: formData,
            success: function (response) {
                if(response == "error") {
                    $("#basic_error").show().delay(3000).fadeOut();
                } else {
                    $("#basic_saved").show().delay(3000).fadeOut();
                }
            },
            cache: false,
            contentType: false,
            processData: false
        });
    });

    //basic details
    $('#user_basic_form').on('submit', function (event) {
        event.preventDefault();
        $.ajax({
            url: '/post_user_basic',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                name: $('input[name="basic_name"]').val(),
                occupation: $('input[name="basic_occupation"]').val()
            }),
            success: function (response) {
                $("#basic_saved").show().delay(3000).fadeOut();
            }
        });
    });

    // User page - social section
    $('#user_social_form').on('submit', function (event) {
        event.preventDefault();
        $.ajax({
            url: '/post_user_social',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                address: $('textarea[name="social_address"]').val(),
                email: $('input[name="social_email"]').val(),
                website: $('input[name="social_website"]').val(),
                linkedin: $('input[name="social_linkedin"]').val(),
                twitter: $('input[name="social_twitter"]').val(),
                phone: $('input[name="social_phone"]').val(),
                skype: $('input[name="social_skype"]').val(),
                github: $('input[name="social_github"]').val(),
                facebook: $('input[name="social_facebook"]').val()
            }),
            success: function (response) {
                $("#social_saved").show().delay(3000).fadeOut();
            }
        });
    });


    // Education page - POST
    $('#education_form').on('submit', function (event) {
        event.preventDefault();
        $.ajax({
            url: '/post_education',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                id: $('select[name="education_id"]').val(),
                degree: $('input[name="education_degree"]').val(),
                institute: $('input[name="education_institute"]').val(),
                dates: $('input[name="education_dates"]').val(),
                description: $('textarea[name="education_description"]').val()
            }),
            success: function (response) {
                initialize();
                $("#education_saved").show().delay(3000).fadeOut();
            }
        });
    });

    //Education page - UPDATE
    $('#education_body').on('click', '.edit_education', function () {
        row_id = get_row_id(this);

        user_data.education.forEach(function (education, index) {
            if (education.id === row_id) {
                $('select[name="education_id"]').val(user_data.education[index].id);
                $('input[name="education_degree"]').val(user_data.education[index].degree);
                $('input[name="education_institute"]').val(user_data.education[index].institute);
                $('input[name="education_dates"]').val(user_data.education[index].dates);
                $('textarea[name="education_description"]').val(user_data.education[index].description);
            }
        });

        console.log("Client row clicked: " + row_id);

        $("#education_save_button").hide();
        $("#education_update_button").show();
        $('select[name="education_id"]').prop('disabled', true);

    });

    $('#education_form').on('click', '#education_update_button', function (event) {
        event.preventDefault();
        $.ajax({
            url: '/put_education/' + row_id,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                id: $('select[name="education_id"]').val(),
                degree: $('input[name="education_degree"]').val(),
                institute: $('input[name="education_institute"]').val(),
                dates: $('input[name="education_dates"]').val(),
                description: $('textarea[name="education_description"]').val()
            }),
            success: function (response) {
                initialize();
                $("#education_saved").show().delay(3000).fadeOut();
                $("#education_modal").modal('toggle');
            }
        });
    });

    $('#education_add_button').on('click', function (event) {
        $("#education_save_button").show();
        $("#education_update_button").hide();
        $('select[name="education_id"]').prop('disabled', false);
    });

    //Education page - DELETE
    $('#education_body').on('click', '.delete_education', function () {
        event.preventDefault();
        row_id = get_row_id(this);

        $.ajax({
            url: '/delete_education/' + row_id,
            method: 'DELETE',
            contentType: 'application/json',
            success: function (response) {
                initialize();
            }
        });
    });


    // Experience page
    $('#experience_form').on('submit', function (event) {
        event.preventDefault();
        $.ajax({
            url: '/post_experience',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                id: $('select[name="experience_id"]').val(),
                work: $('input[name="experience_work"]').val(),
                company: $('input[name="experience_company"]').val(),
                dates: $('input[name="experience_dates"]').val(),
                description: $('textarea[name="experience_description"]').val()
            }),
            success: function (response) {
                initialize();
                $("#experience_saved").show().delay(3000).fadeOut();
            }
        });
    });

    //Experience page - UPDATE
    $('#experience_body').on('click', '.edit_experience', function () {
        row_id = get_row_id(this);

        user_data.experience.forEach(function (experience, index) {
            if (experience.id === row_id) {
                $('select[name="experience_id"]').val(user_data.experience[index].id);
                $('input[name="experience_work"]').val(user_data.experience[index].work);
                $('input[name="experience_company"]').val(user_data.experience[index].company);
                $('input[name="experience_dates"]').val(user_data.experience[index].dates);
                $('textarea[name="experience_description"]').val(user_data.experience[index].description);
            }
        });

        console.log("Client row clicked: " + row_id);

        $("#experience_save_button").hide();
        $("#experience_update_button").show();
        $('select[name="experience_id"]').prop('disabled', true);

    });

    $('#experience_form').on('click', '#experience_update_button', function (event) {
        event.preventDefault();
        $.ajax({
            url: '/put_experience/' + row_id,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                id: $('select[name="experience_id"]').val(),
                work: $('input[name="experience_work"]').val(),
                company: $('input[name="experience_company"]').val(),
                dates: $('input[name="experience_dates"]').val(),
                description: $('textarea[name="experience_description"]').val()
            }),
            success: function (response) {
                initialize();
                $("#experience_saved").show().delay(3000).fadeOut();
                $("#experience_modal").modal('toggle');
            }
        });
    });

    $('#experience_add_button').on('click', function (event) {
        $("#experience_save_button").show();
        $("#experience_update_button").hide();
        $('select[name="experience_id"]').prop('disabled', false);
    });

    //Experience page - DELETE
    $('#experience_body').on('click', '.delete_experience', function () {
        event.preventDefault();
        row_id = get_row_id(this);

        $.ajax({
            url: '/delete_experience/' + row_id,
            method: 'DELETE',
            contentType: 'application/json',
            success: function (response) {
                initialize();
            }
        });
    });


    //====================================================================
    //======================== PROJECT PAGE ==============================
    //====================================================================

    //ADD
    //submit project
    $('#project_form').on('submit', function (event) {
        console.log($('input[name="project_category"]').val());
        event.preventDefault();
        $.ajax({
            url: '/post_project',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                id: $('select[name="project_id"]').val(),
                title: $('input[name="project_title"]').val(),
                category: $('input[name="project_category"]').val(),
                description: $('textarea[name="project_description"]').val(),
                youtube: $('input[name="project_youtube_link"]').val(),
                github: $('input[name="project_github_link"]').val(),
                other_link: $('input[name="project_other_link"]').val()
            }),
            success: function (response) {
                initialize();
                $("#project_saved").show().delay(3000).fadeOut();
            }
        });
    });

    //UPDATE
    //fill form
    $('#project_body').on('click', '.edit_project', function () {
        row_id = get_row_id(this);

        user_data.projects.forEach(function (project, index) {
            if (project.id === row_id) {
                $('select[name="project_id"]').val(user_data.projects[index].id);
                $('input[name="project_title"]').val(user_data.projects[index].title);
                $('input[name="project_category"]').val(user_data.projects[index].category);
                $('textarea[name="project_description"]').val(user_data.projects[index].description);
                $('input[name="project_youtube_link"]').val(user_data.projects[index].youtube);
                $('input[name="project_github_link"]').val(user_data.projects[index].github);
                $('input[name="project_other_link"]').val(user_data.projects[index].other_link);
            }
        });

        console.log("Client row clicked: " + row_id);

        $("#project_save_button").hide();
        $("#project_update_button").show();
        $('select[name="project_id"]').prop('disabled', true);

    });

    //update project form
    $('#project_form').on('click', '#project_update_button', function (event) {
        event.preventDefault();
        console.log(row_id);
        console.log(user_data.projects[row_id-1]["image"]);
        $.ajax({
            url: '/put_project/' + row_id,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                id: $('select[name="project_id"]').val(),
                title: $('input[name="project_title"]').val(),
                category: $('input[name="project_category"]').val(),
                description: $('textarea[name="project_description"]').val(),
                youtube: $('input[name="project_youtube_link"]').val(),
                github: $('input[name="project_github_link"]').val(),
                other_link: $('input[name="project_other_link"]').val(),
                image: user_data.projects[row_id-1]["image"]
            }),
            success: function (response) {
                initialize();
                $("#project_saved").show().delay(3000).fadeOut();
                $("#project_modal").modal('toggle');
            }
        });
    });

    $('#project_add_button').on('click', function (event) {
        $("#project_save_button").show();
        $("#project_update_button").hide();
        $('select[name="project_id"]').prop('disabled', false);
    });

    //DELETE
    $('#project_body').on('click', '.delete_project', function () {
        event.preventDefault();
        row_id = get_row_id(this);

        $.ajax({
            url: '/delete_project/' + row_id,
            method: 'DELETE',
            contentType: 'application/json',
            success: function (response) {
                initialize();
            }
        });
    });

    //PROJECT IMAGE
    //Table image clicked
    $('#project_body').on('click', '.image_project', function () {
        event.preventDefault();

        row_id =  get_row_id(this);

        for(var i = 0; i < user_data.projects.length; i++){
            if(user_data.projects[i]["id"] == row_id){
                console.log(row_id + " " + user_data.projects[i]["id"]);
                $('#project_modal_header').css('display', 'block');
                $('#display_project_image').attr('src', "/uploads/projects/" + user_data.projects[i]["image"]);
                break;
            } else {
                $('#project_modal_header').css('display', 'none');
            }
        }

    });

    //upload project image
    $('#upload_project_image').on('submit', function (event) {
        event.preventDefault();

        var formData = new FormData(this);

        $("#project_image_loading").show();

        $.ajax({
            url: '/upload_project/' + (row_id-1),
            type: 'POST',
            data: formData,
            success: function (response) {
                if(response == "error") {
                    $("#project_image_loading").hide();
                    $("#project_image_error").show().delay(3000).fadeOut();
                } else {
                    $("#project_image_loading").hide();
                    $("#project_image_saved").show().delay(3000).fadeOut();
                    $("#project_image_modal").modal('toggle');
                }
            },
            cache: false,
            contentType: false,
            processData: false
        });
    });


    //OTHER PAGE
    //statement section
    $('#statement_form').on('submit', function (event) {
        event.preventDefault();
        $.ajax({
            url: '/post_statement',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                statement: $('textarea[name="statement_input"]').val()
            }),
            success: function (response) {
                $("#statement_saved").show().delay(3000).fadeOut();
            }
        });
    });


    // Other page - achievements section
    $('#achievements_form').on('submit', function (event) {
        event.preventDefault();
        $.ajax({
            url: '/post_achievements',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                id: $('select[name="achievement_id"]').val(),
                title: $('input[name="achievement_title"]').val(),
                description: $('textarea[name="achievement_description"]').val()
            }),
            success: function (response) {
                initialize();
                $("#achievement_saved").show().delay(3000).fadeOut();

            }
        });
    });

    //Achievements section - edit button
    $('#achievements_body').on('click', '.edit_achievement', function () {
        row_id = get_row_id(this);

        user_data.achievements.forEach(function (project, index) {
            if (project.id === row_id) {
                $('select[name="achievement_id"]').val(user_data.achievements[index].id);
                $('input[name="achievement_title"]').val(user_data.achievements[index].title);
                $('textarea[name="achievement_description"]').val(user_data.achievements[index].description);
            }
        });

        console.log("Client row clicked: " + row_id);

        $("#achievement_add_button").hide();
        $("#achievement_cancel_button").show();
        $("#achievement_update_button").show();

    });

    //achievement update
    $('#achievements_form').on('click', '#achievement_update_button', function (event) {
        event.preventDefault();
        $.ajax({
            url: '/put_achievement/' + row_id,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                id: $('select[name="achievement_id"]').val(),
                title: $('input[name="achievement_title"]').val(),
                description: $('textarea[name="achievement_description"]').val()
            }),
            success: function (response) {
                initialize();
                $("#achievement_saved").show().delay(3000).fadeOut();
            }
        });

        $("#achievement_add_button").show();
        $("#achievement_cancel_button").hide();
        $("#achievement_update_button").hide();
    });

    $('#achievement_cancel_button').on('click', function (event) {
        $("#achievement_add_button").show();
        $("#achievement_cancel_button").hide();
        $("#achievement_update_button").hide();
        initialize();
    });

    //Achievement section - DELETE
    $('#achievements_body').on('click', '.delete_achievement', function () {
        event.preventDefault();
        row_id = get_row_id(this);

        $.ajax({
            url: '/delete_achievement/' + row_id,
            method: 'DELETE',
            contentType: 'application/json',
            success: function (response) {
                initialize();
            }
        });
    });

    //Other page - technical
// technical page
    $('#technical_form').on('submit', function (event) {
        event.preventDefault();

        $.ajax({
            url: '/post_technical',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                id: $('select[name="technical_id"]').val(),
                title: $('input[name="technical_title"]').val(),
                percentage: ($('input[name="technical_percentage"]').val()).toString()
            }),
            success: function (response) {
                initialize();
            }
        });
    });

//technical page - edit button
    $('#technical_body').on('click', '.edit_technical', function () {
        row_id = get_row_id(this);

        user_data.technical.forEach(function (technical, index) {
            if (technical.id === row_id) {
                $('select[name="technical_id"]').val(user_data.technical[index].id);
                $('input[name="technical_title"]').val(user_data.technical[index].title);
                $('input[name="technical_percentage"]').val(user_data.technical[index].percentage);
            }
        });

        console.log("Client row clicked: " + row_id);

        $("#technical_save_button").hide();
        $("#technical_update_button").show();
        $("#technical_cancel_button").show();


    });


//technical page - UPDATE
    $('#technical_form').on('click', '#technical_update_button', function (event) {
        event.preventDefault();
        $.ajax({
            url: '/put_technical/' + row_id,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                id: $('select[name="technical_id"]').val(),
                title: $('input[name="technical_title"]').val(),
                percentage: $('input[name="technical_percentage"]').val().toString()
            }),
            success: function (response) {
                initialize();
            }
        });

        $("#technical_save_button").show();
        $("#technical_update_button").hide();
        $("#technical_cancel_button").hide();
    });

//technical cancel button clicked
    $('#technical_cancel_button').on('click', function (event) {

        $("#technical_save_button").show();
        $("#technical_update_button").hide();
        $("#technical_cancel_button").hide();
        clear_all();
    });

//technical page - DELETE
    $('#technical_body').on('click', '.delete_technical', function () {
        event.preventDefault();
        row_id = get_row_id(this);

        $.ajax({
            url: '/delete_technical/' + row_id,
            method: 'DELETE',
            contentType: 'application/json',
            success: function (response) {
                initialize();
            }
        });
    });

    //Other page - qualities
// qualities page
    $('#qualities_form').on('submit', function (event) {
        event.preventDefault();

        $.ajax({
            url: '/post_qualities',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                id: $('select[name="qualities_id"]').val(),
                title: $('input[name="qualities_title"]').val(),
                percentage: ($('input[name="qualities_percentage"]').val()).toString()
            }),
            success: function (response) {
                initialize();
            }
        });
    });

//qualities page - edit button
    $('#qualities_body').on('click', '.edit_qualities', function () {
        row_id = get_row_id(this);

        user_data.qualities.forEach(function (qualities, index) {
            if (qualities.id === row_id) {
                $('select[name="qualities_id"]').val(user_data.qualities[index].id);
                $('input[name="qualities_title"]').val(user_data.qualities[index].title);
                $('input[name="qualities_percentage"]').val(user_data.qualities[index].percentage);
            }
        });

        console.log("Client row clicked: " + row_id);

        $("#qualities_save_button").hide();
        $("#qualities_update_button").show();
        $("#qualities_cancel_button").show();


    });


//qualities page - UPDATE
    $('#qualities_form').on('click', '#qualities_update_button', function (event) {
        event.preventDefault();
        $.ajax({
            url: '/put_qualities/' + row_id,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                id: $('select[name="qualities_id"]').val(),
                title: $('input[name="qualities_title"]').val(),
                percentage: $('input[name="qualities_percentage"]').val().toString()
            }),
            success: function (response) {
                initialize();
            }
        });

        $("#qualities_save_button").show();
        $("#qualities_update_button").hide();
        $("#qualities_cancel_button").hide();
    });

//qualities cancel button clicked
    $('#qualities_cancel_button').on('click', function (event) {

        $("#qualities_save_button").show();
        $("#qualities_update_button").hide();
        $("#qualities_cancel_button").hide();
        clear_all();
    });

//qualities page - DELETE
    $('#qualities_body').on('click', '.delete_qualities', function () {
        event.preventDefault();
        row_id = get_row_id(this);

        $.ajax({
            url: '/delete_qualities/' + row_id,
            method: 'DELETE',
            contentType: 'application/json',
            success: function (response) {
                initialize();
            }
        });
    });

    //Other page - languages
// languages page
    $('#languages_form').on('submit', function (event) {
        event.preventDefault();

        $.ajax({
            url: '/post_languages',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                id: $('select[name="languages_id"]').val(),
                title: $('input[name="languages_title"]').val(),
                percentage: ($('input[name="languages_percentage"]').val()).toString()
            }),
            success: function (response) {
                initialize();
            }
        });
    });

//languages page - edit button
    $('#languages_body').on('click', '.edit_languages', function () {
        row_id = get_row_id(this);

        user_data.languages.forEach(function (languages, index) {
            if (languages.id === row_id) {
                $('select[name="languages_id"]').val(user_data.languages[index].id);
                $('input[name="languages_title"]').val(user_data.languages[index].title);
                $('input[name="languages_percentage"]').val(user_data.languages[index].percentage);
            }
        });

        console.log("Client row clicked: " + row_id);

        $("#languages_save_button").hide();
        $("#languages_update_button").show();
        $("#languages_cancel_button").show();


    });


//languages page - UPDATE
    $('#languages_form').on('click', '#languages_update_button', function (event) {
        event.preventDefault();
        $.ajax({
            url: '/put_languages/' + row_id,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                id: $('select[name="languages_id"]').val(),
                title: $('input[name="languages_title"]').val(),
                percentage: $('input[name="languages_percentage"]').val().toString()
            }),
            success: function (response) {
                initialize();
            }
        });

        $("#languages_save_button").show();
        $("#languages_update_button").hide();
        $("#languages_cancel_button").hide();
    });

//languages cancel button clicked
    $('#languages_cancel_button').on('click', function (event) {

        $("#languages_save_button").show();
        $("#languages_update_button").hide();
        $("#languages_cancel_button").hide();
        clear_all();
    });

//languages page - DELETE
    $('#languages_body').on('click', '.delete_languages', function () {
        event.preventDefault();
        row_id = get_row_id(this);

        $.ajax({
            url: '/delete_languages/' + row_id,
            method: 'DELETE',
            contentType: 'application/json',
            success: function (response) {
                initialize();
            }
        });
    });


    //Technical form limit number
    $('input[name="skills_percentage"]').on('keydown keyup', function (e) {
        if ($(this).val() > 100
            && e.keyCode != 46 // delete
            && e.keyCode != 8 // backspace
        ) {
            e.preventDefault();
            $(this).val(100);
        }
        if ($(this).val() < 1) {
            e.preventDefault();
            $(this).val(1);
        }
    });

});
//================== END OF DOCUMENT READY ===========================


//==================== GET DATABASE -> FORM ==========================
//====================================================================


//set user data
function set_user_data() {
    $.ajax({
        url: '/get_user_data',
        method: 'GET',
        async: false,
        contentType: 'application/json',
        success: function (response) {
            if (response == true) {
                user_data = response.user.local;
            } else {
                user_data = response.user.local;
            }
        }
    });
}

function initialize() {

    $.ajax({
        url: '/get_user_data',
        method: 'GET',
        contentType: 'application/json',
        success: function (response) {
            clear_all();
            set_user_data();
            fill_user_form(response.user.local);
            fill_education_form(response.user.local.education);
            fill_experience_form(response.user.local.experience);
            fill_project_form(response.user.local.projects);
            fill_other_form(response.user.local);
            fill_technical_form(response.user.local.technical);
            fill_qualities_form(response.user.local.qualities);
            fill_languages_form(response.user.local.languages);
        }
    });
}

// clear everything
function clear_all() {
    $("input[type='text']").val("");
    $("input[type='number']").val("");
    $("textarea").val("");
}


//==================== FILL IN ALL FORM VALUES =======================
//====================================================================

function fill_user_form(doc) {
    $('input[name="security_email"]').val(doc.email);
    $('input[name="security_link"]').val(doc.link);

    //$('input[name="user_image"]').val(doc.basic.user_image);
    $('input[name="basic_name"]').val(doc.basic.name);
    $('input[name="basic_occupation"]').val(doc.basic.occupation);

    $('textarea[name="social_address"]').val(doc.social.address);
    $('input[name="social_email"]').val(doc.social.email);
    $('input[name="social_phone"]').val(doc.social.phone);
    $('input[name="social_skype"]').val(doc.social.skype);
    $('input[name="social_website"]').val(doc.social.website);
    $('input[name="social_linkedin"]').val(doc.social.linkedin);
    $('input[name="social_twitter"]').val(doc.social.twitter);
    $('input[name="social_github"]').val(doc.social.github);
    $('input[name="social_facebook"]').val(doc.social.facebook);
}

function fill_education_form(doc) {
    var table_body = $('#education_body');
    table_body.html('');

    doc.forEach(function (education) {
        var html =
            '<tr>\
               <th class="col1 id_column">' + education.id + '</th>\
               <td class="col2">' + education.degree + '</td>\
               <td class="col3">\
                   <button class="btn btn-outline-secondary btn-sm edit_education" title="Edit" data-toggle="modal" data-target="#education_modal">\
                       <i class="fa fa-pencil-square-o"></i>\
                   </button>&nbsp;\
                   <button class="btn btn-outline-danger btn-sm delete_education" title="Delete">\
                       <i class="fa fa-remove"></i>\
                   </button>\
               </td>\
            </tr>\
            ';

        table_body.append(html);
    });


    $('#education_id').empty();
    $('#education_id').append('<option value="" disabled selected class="form-control">Select order..</option>');
    for (var i = 1; i <= user_data.education.length + 1; i++) {
        $('#education_id').append('<option value="' + i + '">' + i + '</option>');
    }
}

function fill_experience_form(doc) {
    var table_body = $('#experience_body');
    table_body.html('');

    doc.forEach(function (experience) {
        var html =
            '<tr>\
               <th class="col1 id_column">' + experience.id + '</th>\
               <td class="col2">' + experience.work + '</td>\
               <td class="col3">\
                   <button class="btn btn-outline-secondary btn-sm edit_button edit_experience" title="Edit" data-toggle="modal" data-target="#experience_modal">\
                       <i class="fa fa-pencil-square-o"></i>\
                   </button>&nbsp;\
                   <button class="btn btn-outline-danger btn-sm delete_experience" title="Delete">\
                       <i class="fa fa-remove"></i>\
                   </button>\
               </td>\
            </tr>\
            ';

        table_body.append(html);
    });

    $('#experience_id').empty();
    $('#experience_id').append('<option value="" disabled selected class="form-control">Select order..</option>');
    for (var i = 1; i <= user_data.experience.length + 1; i++) {
        $('#experience_id').append('<option value="' + i + '">' + i + '</option>');
    }
}

function fill_project_form(doc) {
    var table_body = $('#project_body');
    table_body.html('');

    doc.forEach(function (project) {
        var html =
            '<tr>\
               <th class="col1 id_column">' + project.id + '</th>\
               <td class="col2">' + project.title + '</td>\
               <td class="col3">\
                   <button class="btn btn-outline-secondary btn-sm image_project" title="Image" data-toggle="modal" data-target="#project_image_modal">\
                       <i class="fa fa-picture-o"></i>\
                   </button>\
                   <button class="btn btn-outline-secondary btn-sm edit_button edit_project" title="Edit" data-toggle="modal" data-target="#project_modal">\
                       <i class="fa fa-pencil-square-o"></i>\
                   </button>&nbsp;\
                   <button class="btn btn-outline-danger btn-sm delete_project" title="Delete">\
                       <i class="fa fa-remove"></i>\
                   </button>\
               </td>\
            </tr>\
            ';

        table_body.append(html);
    });

    $('#project_id').empty();
    $('#project_id').append('<option value="" disabled selected class="form-control">Select order..</option>');
    for (var i = 1; i <= user_data.projects.length + 1; i++) {
        $('#project_id').append('<option value="' + i + '">' + i + '</option>');
    }

}

function fill_other_form(doc) {
    $('textarea[name="statement_input"]').val(doc.statement);

    var table_body = $('#achievements_body');
    table_body.html('');

    doc.achievements.forEach(function (achievement) {
        var html =
            '<tr>\
               <th class="col1 id_column">' + achievement.id + '</th>\
               <td class="col2">' + achievement.title + '</td>\
               <td class="col3">\
                   <button class="btn btn-outline-secondary btn-sm edit_button edit_achievement" title="Edit">\
                       <i class="fa fa-pencil-square-o"></i>\
                   </button>&nbsp;\
                   <button class="btn btn-outline-danger btn-sm delete_achievement" title="Delete">\
                       <i class="fa fa-remove"></i>\
                   </button>\
               </td>\
            </tr>\
            ';

        table_body.append(html);
    });

    $('#achievement_id').empty();
    $('#achievement_id').append('<option value="" disabled selected class="form-control">Select order..</option>');
    for (var i = 1; i <= user_data.achievements.length + 1; i++) {
        $('#achievement_id').append('<option value="' + i + '">' + i + '</option>');
    }
}

function fill_technical_form(doc) {
    var table_body = $('#technical_body');
    table_body.html('');

    doc.forEach(function (technical) {
        var html =
            '<tr>\
               <th class="col1 id_column">' + technical.id + '</th>\
               <td class="col2">' + technical.title + '&nbsp;&nbsp; = &nbsp;&nbsp;' + parseInt(technical.percentage) + '%</td>\
               <td class="col3">\
                   <button class="btn btn-outline-secondary btn-sm edit_button edit_technical" title="Edit" data-toggle="modal" data-target="#skills_modal">\
                       <i class="fa fa-pencil-square-o"></i>\
                   </button>&nbsp;\
                   <button class="btn btn-outline-danger btn-sm delete_technical" title="Delete">\
                       <i class="fa fa-remove"></i>\
                   </button>\
               </td>\
            </tr>\
            ';

        table_body.append(html);
    });

    $('#technical_id').empty();
    $('#technical_id').append('<option value="" disabled selected class="form-control">Select order..</option>');
    for (var i = 1; i <= user_data.technical.length + 1; i++) {
        $('#technical_id').append('<option value="' + i + '">' + i + '</option>');
    }
}

function fill_qualities_form(doc) {
    var table_body = $('#qualities_body');
    table_body.html('');

    doc.forEach(function (qualities) {
        var html =
            '<tr>\
               <th class="col1 id_column">' + qualities.id + '</th>\
               <td class="col2">' + qualities.title + '&nbsp;&nbsp; = &nbsp;&nbsp;' + parseInt(qualities.percentage) + '%</td>\
               <td class="col3">\
                   <button class="btn btn-outline-secondary btn-sm edit_button edit_qualities" title="Edit" data-toggle="modal" data-target="#skills_modal">\
                       <i class="fa fa-pencil-square-o"></i>\
                   </button>&nbsp;\
                   <button class="btn btn-outline-danger btn-sm delete_qualities" title="Delete">\
                       <i class="fa fa-remove"></i>\
                   </button>\
               </td>\
            </tr>\
            ';

        table_body.append(html);
    });

    $('#qualities_id').empty();
    $('#qualities_id').append('<option value="" disabled selected class="form-control">Select order..</option>');
    for (var i = 1; i <= user_data.qualities.length + 1; i++) {
        $('#qualities_id').append('<option value="' + i + '">' + i + '</option>');
    }
}

function fill_languages_form(doc) {
    var table_body = $('#languages_body');
    table_body.html('');

    doc.forEach(function (languages) {
        var html =
            '<tr>\
               <th class="col1 id_column">' + languages.id + '</th>\
               <td class="col2">' + languages.title + '&nbsp;&nbsp; = &nbsp;&nbsp;' + parseInt(languages.percentage) + '%</td>\
               <td class="col3">\
                   <button class="btn btn-outline-secondary btn-sm edit_button edit_languages" title="Edit" data-toggle="modal" data-target="#skills_modal">\
                       <i class="fa fa-pencil-square-o"></i>\
                   </button>&nbsp;\
                   <button class="btn btn-outline-danger btn-sm delete_languages" title="Delete">\
                       <i class="fa fa-remove"></i>\
                   </button>\
               </td>\
            </tr>\
            ';

        table_body.append(html);
    });

    $('#languages_id').empty();
    $('#languages_id').append('<option value="" disabled selected class="form-control">Select order..</option>');
    for (var i = 1; i <= user_data.languages.length + 1; i++) {
        $('#languages_id').append('<option value="' + i + '">' + i + '</option>');
    }
}


function get_row_id(obj) {
    var $row = $(obj).closest("tr");
    var $text = $row.find(".id_column").text();

    return ($text);
}


//Count characters in personal statement
function count_statement_chars() {
    var text_max = 1500;
    $('#statement_char_remaining').html(text_max + ' remaining');

    $('#statement_textarea_input').keyup(function () {
        var text_length = $('#statement_textarea_input').val().length;
        var text_remaining = text_max - text_length;

        $('#statement_char_remaining').html(text_remaining + ' characters remaining');

    });
}

function preview_clicked() {
    initialize();
    if (user_data.link && user_data.link.length > 0) {
        var url = '/' + user_data.link;
        window.open(url, '_blank');
    } else {
        alert("Set your custom link first");
    }
}

//check if both passwords match
function match_registration_passwords() {
    var password = document.getElementsByName('security_newpass')[0];
    var password_confirm = document.getElementsByName('security_newpass_confirm')[0];

    if (password.value != password_confirm.value) {
        password_confirm.setCustomValidity("Passwords do not match!");
        return false;
    } else {
        password_confirm.setCustomValidity("");
        return true;
    }
}