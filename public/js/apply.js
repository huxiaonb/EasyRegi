Zepto(function($){

    (function initAnimation() {
      var main = $('#mainContent');
      main.css({left : '40rem'});
      main.animate({left : '0'}, 200);
    })()



    $('input').on('focus',function(event){
        var target = event.target;
        resetErrorBox(target.name);
    });

    $('input').on('blur',function(event){
        var target = event.target;
        completeGraduationDate(target.name);
    });
    isDigit('main-apply-form');

    $('input[name=pic]').on('change', function (e) {
        var target = e.target;
        console.log(target.files);
        console.log(!!target.files);
        if (!!target.files[0] && target.files[0].size > 5 * 1024 * 1024) {
            console.log(target.files[0]);
            $('abbr[name=pic-tooltip]').attr('title', '照片大小不能超过5MB');
            applyTooltip(window, ['pic']);
            $('abbr[name=pic-tooltip]').mouseover();
            target.files = null;
            return false;
        } else {
            console.log(target.value);
            if(!!target.files[0] && !!target.files[0].name){
                var imageReg = /\.(jpg|jpeg|png|JPG|PNG)$/;
                if(!imageReg.test(target.files[0].name)){
                    $('abbr[name=pic-tooltip]').attr('title', '请使用JPG或PNG格式');
                    applyTooltip(window, ['pic']);
                    $('abbr[name=pic-tooltip]').mouseover();
                    return false;
                }
            }
            var filename = target.value;
            filename = filename.substring(filename.lastIndexOf('\\') + 1);
            $('#filename').html(filename || '添加照片');
        }

    });
});

function completeGraduationDate(name) {
    var queryInputExp = '';
    if(!!name){
        queryInputExp = 'input[name=' + name + ']';
    }
    if(name === 'graduationFromDate') {
        var inputObj = $(queryInputExp);
        if(inputObj.length !== 0){
            var year = inputObj.val();
            if(year.length === 2){
                var currentDate = new Date();
                var currentYear = currentDate.getFullYear().toString();
                year = currentYear.substring(0,2) + year;
                inputObj.val(year);
            }
        }
    } else if(name === 'graduationToDate'){
        var inputObj = $(queryInputExp);
        if(inputObj.length !== 0){
            var month = inputObj.val();
            if(month.length === 1 && parseInt(month) > 0){
                month = '0' + month;
                inputObj.val(month);
            }
        }
    }
};

function submit(){
    var form = $('form');
    var validateFlag = true;
    var notPassedFiledName = [];
    form.find('input').each(function(idx, ele){
        if(!validateInput(ele.name)){
            validateFlag = false;
            notPassedFiledName.push(ele.name);
        }
    });
    if(validateFlag){
        console.log('submit');
        form[0].submit();
    }else{
        applyTooltip(window, notPassedFiledName);
        console.log('not submit');
    }
};

function showErrorIfNotPassValidation(inputObj) {
    inputObj.val('');
    inputObj.parent().addClass('has-error');
    return false;
}
function validateInput(name){
    var queryInputExp = '';
    if(!!name) {
        queryInputExp = '[name=' + name + ']';
    }
    var inputObj = $(queryInputExp);
    var validateResult = true;
    if (inputObj.length !== 0){
        var minLength = 0;
        if(null !== inputObj.attr('data-min-length') && undefined !== inputObj.attr('data-min-length')){
            minLength = inputObj.attr('data-min-length');
            minLength = parseInt(minLength);
            if(isNaN(minLength)){
                minLength = 0;
            }
        }
        if(inputObj.val().length === 0 && minLength === 0){
            return validateResult;
        }
        if(inputObj.val().length < minLength) {
            showErrorIfNotPassValidation(inputObj);
            validateResult = false;
        }

        var re = '';
        if(null !== inputObj.attr('data-regex') && undefined !== inputObj.attr('data-regex')){
            re = inputObj.attr('data-regex');
            re = re.substring(re.indexOf('/') + 1, re.lastIndexOf('/') < 0 ? re.length : re.lastIndexOf('/'));
            var reAttr = '';
            if(null !== inputObj.attr('data-regex-attr') && undefined !== inputObj.attr('data-regex-attr')){
                reAttr = inputObj.attr('data-regex-attr');
            }
            re = new RegExp(re, reAttr);
        }
        if(re === '' || re.test(inputObj.val())){
            console.log('true');
        } else {
            showErrorIfNotPassValidation(inputObj);
            validateResult = false;
        }



        var maxLength = 0;
        if(null !== inputObj.attr('data-max-length') && undefined !== inputObj.attr('data-max-length')){
            maxLength = inputObj.attr('data-max-length');
            maxLength = parseInt(maxLength);
            if(isNaN(maxLength)){
                maxLength = 0;
            }
        }
        if(maxLength !== 0 && inputObj.val().length > maxLength) {
            showErrorIfNotPassValidation(inputObj);
            validateResult = false;
        }

    }
    return validateResult;
};
function isDigit(id){
    var data = $("#"+id+" input[isDigit]");
    data.each(function(){
        $(this).bind('keypress', function (evt) {
            var char = String.fromCharCode(evt.keyCode);
            if (!/^(\d*|-)\.{0,1}\d{0,2}$/.test(char)) {
                evt.preventDefault();
            }
        });
        $(this).bind('afterpaste', function () {
            $(this).val($(this).val().replace(/[^\d-\.]/g,''));
        });
        $(this).bind('keyup', function () {
            $(this).val($(this).val().replace(/[^\d-\.]/g,''));
        });
    })
};
function resetErrorBox(name){
    var queryInputExp = "input[name=" + name + "]";
    var inputObj = $(queryInputExp);
    if(inputObj.length !== 0){
        if(inputObj.parent().hasClass('has-error')){
            inputObj.parent().removeClass('has-error');
        }
    }
};
function applyTooltip(win, notPassedFiledName) {
    var queryExp = '',
        nameArray = [],
        target  = false,
        tooltip = false,
        tip;

    notPassedFiledName.forEach(function(name){
        if(!!name){
            nameArray.push('[name=' + name + '-tooltip]');
        }
    });
    queryExp = nameArray.join(',');
    var targets = $(queryExp);

    targets.one('mouseover', function() {
        target  = $(this);
        tip     = target.attr('title');
        tooltip = $('<div class="tooltip"></div>');

        if (!tip || tip === '') {
            return false;
        }

        target.removeAttr('title');
        tooltip.css('opacity', 0).html(tip).appendTo('body');

        var initTooltip = function() {
            if ($(win).width() < tooltip.width() * 1.5) {
                tooltip.css('max-width', $(win).width() / 2);
            } else {
                tooltip.css('max-width', 340);
            }

            var posLeft = target.offset().left + (target.width() / 2) - (tooltip.width() / 2),
                posTop = target.offset().top - tooltip.height() - 20;

            if (posLeft < 0) {
                posLeft = target.offset().left + target.width() / 2 - 20;
                tooltip.addClass('left');
            } else {
                tooltip.removeClass('left');
            }

            if (posLeft + tooltip.width() > $(win).width()) {
                posLeft = target.offset().left - tooltip.width() + target.width() / 2 + 20;
                tooltip.addClass('right');
            } else {
                tooltip.removeClass('right');
            }

            if (posTop < 0) {
                posTop = target.offset().top + target.height();
                tooltip.addClass('top');
            } else {
                tooltip.removeClass('top');
            }

            tooltip.css({
                left: posLeft,
                top: posTop
            }).animate({
                translateY: '10px',
                opacity: 1
            }, 50);
        };

        initTooltip();
        $(win).resize(initTooltip);

        var removeTooltip = function() {
            tooltip.animate({
                translateY: '-10px',
                opacity: 0
            }, 50, 'linear', function() {
                $(this).remove();
            });

            target.attr('title', tip);
        };

        target.one('mouseout', removeTooltip);
        tooltip.one('click', removeTooltip);
    });
};
