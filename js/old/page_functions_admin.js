function toggleAboutContent(content) {
    $('.pure-menu-list .pure-menu-item .pure-button').removeClass('pure-button');

    switch (content) {
        case 'about':
            $('#requirements').hide();
            $('#about').fadeIn();
            break;
        case 'requirements':
            $('#about').hide();
            $('#requirements').fadeIn();
            break;
    }
}

function checkRequirements() {
    loader = '<img src="' + baseUrl + '/images/progress.gif" width="32" height="32"/>';
    cross = '<img src="' + baseUrl + '/images/icon-cross-128.png" width="32" height="32"/>';
    check = '<img src="' + baseUrl + '/images/icon-check-128.png" width="32" height="32"/>';

    php_version = $('#req_php_version');
    db_pdo = $('#req_db_pdo');
    db_con = $('#req_db_con');


    $(php_version).html(loader);
    $(db_pdo).html(loader);
    $(db_con).html(loader);
    $(req_lfm_api).html(loader);
    $(req_yt_api).html(loader);


    $.ajax(
        'php/admin/check_requirements.php?check=true', {
            dataType: 'json',
            method: 'GET',
            success: function (responseData) {
                //console.log(responseData);

                icon = (responseData.req_php_version == true) ? check : cross;
                $(php_version).html(icon);

                icon = (responseData.req_db_pdo == true) ? check : cross;
                $(db_pdo).html(icon);

                icon = (responseData.req_db_con == true) ? check : cross;
                $(db_con).html(icon);

                icon = (responseData.req_lfm_api == true) ? check : cross;
                $(req_lfm_api).html(icon);

                icon = (responseData.req_yt_api == true) ? check : cross;
                $(req_yt_api).html(icon);
            },
            error: function () {
                $(php_version).html(cross);
                $(db_pdo).html(cross);
                $(db_con).html(cross);
            }
        }
    );
}

function pageInit() {

    /**
     tinymce.init({
		selector:'textarea' ,
		branding: false,
		theme: 'modern',
		forced_root_block : false,
		force_br_newlines : true,
		force_p_newlines : false,
		toolbar: false,
		menubar: false,
		mode: 'none',
		setup: null
	});
     **/

    editors = $('.texteditor');
    for (cnt = 0; cnt < editors.length; cnt++) {
        //console.log(editors[cnt]);
        CodeMirror.fromTextArea(editors[cnt], {
            lineNumbers: true,
            mode: 'properties'
        });
    }

    checkRequirements();
}
