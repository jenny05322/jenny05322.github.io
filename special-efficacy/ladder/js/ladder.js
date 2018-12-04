$(function () {
    var manPos = Math.floor(Math.random() * 5);
    $(window)
        .load(function () {
            initManPos();
            initAnswerPos();

            // 點問號會做的事情
            $('#answer div').click(function (obj) {
                obj = $(this);
                drawAnswer('.answer-' + manPos + ' div', 0, function () {
                    // 結果
                    var answer = [4, 3, 1, 2, 0];

                    if ($('#answer div').index(obj) == answer[manPos]) {
                        $('#myModal .modal-body').text('恭喜！您選對了！');
                        $('#myModal').modal('show');
                    } else {
                        $('#myModal .modal-body').text('很抱歉！您選錯答案！');
                        $('#myModal').modal('show');
                    }
                });
            });
        })
        .resize(function () {
            initManPos();
            initAnswerPos();
        });

    // 初始化聖誕老人位置
    function initManPos() {
        $('#man span').css({
            'z-index': 'auto',
            'margin-left': ($('#man').width() * 0.2 * manPos) + ($('#man').width() * 0.1) - ($('#man span').width() / 2) + 5
        });
    }

    // 初始化問號圖片位置
    function initAnswerPos() {
        $('#answer div').each(function (index) {
            if (index == 0) {
                $(this).css({
                    'z-index': 'auto',
                    'margin-left': $('#answer').width() * 0.1 - ($(this).width() / 2) + 5
                });
            } else {
                $(this).css({
                    'z-index': 'auto',
                    'margin-left': $('#answer').width() * 0.2 - $(this).width()
                });
            }
        });
    }

    // 畫答案動畫
    function drawAnswer(selector, index, callback) {
        $(selector).eq(index).animate({
            opacity: 1
        }, 100, function () {
            if (index == $(selector).length - 1) {
                callback();
            } else {
                drawAnswer(selector, index + 1, callback);
            }
        });
    }

    // 再玩一次
    $('#myModal').on('hidden.bs.modal', function (e) {
        // 把路線清除
        $('.answer-' + manPos + ' div').css({
            opacity: 0
        });

        // 重設聖誕老人位置
        manPos = Math.floor(Math.random() * 5);
        initManPos();
    });
});