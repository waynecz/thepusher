jQuery(document).ready(function ($) {
    //change this value if you want to change the speed of the scale effect
    var scaleSpeed                   = 0.3,
        //change this value if you want to set a different initial opacity for the .cd-half-block
        boxShadowOpacityInitialValue = 0.7,
        animating                    = false;

    //check the media query
    var MQ = window.getComputedStyle(document.querySelector('body'), '::before').getPropertyValue('content').replace(/"/g, "");
    $(window).on('resize', function () {
        MQ = window.getComputedStyle(document.querySelector('body'), '::before').getPropertyValue('content').replace(/"/g, "");
    });

    //bind the animation to the window scroll event
    triggerAnimation();
    $(window).on('scroll', function () {
        triggerAnimation();
    });

    //move to next/previous section
    $('.cd-vertical-nav .cd-prev').on('click', function () {
        prevSection();
    });
    $('.cd-vertical-nav .cd-next').on('click', function () {
        nextSection();
    });
    $(document).keydown(function (event) {
        if (event.which == '38') {
            prevSection();
            event.preventDefault();
        } else if (event.which == '40') {
            nextSection();
            event.preventDefault();
        }
    });

    function triggerAnimation() {
        if (MQ == 'desktop') {
            //if on desktop screen - animate sections
            (!window.requestAnimationFrame) ? animateSection() : window.requestAnimationFrame(animateSection);
        } else {
            //on mobile - remove the style added by jQuery
            $('.cd-section').find('.cd-block').removeAttr('style').find('.cd-half-block').removeAttr('style');
        }
        //update navigation arrows visibility
        checkNavigation();
    }

    function animateSection() {
        var scrollTop    = $(window).scrollTop(),
            windowHeight = $(window).height(),
            windowWidth  = $(window).width();

        $('.cd-section').each(function () {
            var actualBlock = $(this),
                offset      = scrollTop - actualBlock.offset().top,
                scale       = 1,
                translate   = windowWidth / 2 + 'px',
                opacity,
                boxShadowOpacity;

            if (offset >= -windowHeight && offset <= 0) {
                //move the two .cd-half-block toward the center - no scale/opacity effect
                scale = 1,
                    opacity = 1,
                    translate = (windowWidth * 0.5 * (-offset / windowHeight)).toFixed(0) + 'px';

            } else if (offset > 0 && offset <= windowHeight) {
                //the two .cd-half-block are in the center - scale the .cd-block element and reduce the opacity
                translate = 0 + 'px',
                    scale = (1 - ( offset * scaleSpeed / windowHeight)).toFixed(5),
                    opacity = ( 1 - ( offset / windowHeight) ).toFixed(5);

            } else if (offset < -windowHeight) {
                //section not yet visible
                scale = 1,
                    translate = windowWidth / 2 + 'px',
                    opacity = 1;

            } else {
                //section not visible anymore
                opacity = 0;
            }

            boxShadowOpacity = parseInt(translate.replace('px', '')) * boxShadowOpacityInitialValue / 20;

            //translate/scale section blocks
            scaleBlock(actualBlock.find('.cd-block'), scale, opacity);

            var directionFirstChild  = ( actualBlock.is(':nth-of-type(even)') ) ? '-' : '+';
            var directionSecondChild = ( actualBlock.is(':nth-of-type(even)') ) ? '+' : '-';
            if (actualBlock.find('.cd-half-block')) {
                translateBlock(actualBlock.find('.cd-half-block').eq(0), directionFirstChild + translate, boxShadowOpacity);
                translateBlock(actualBlock.find('.cd-half-block').eq(1), directionSecondChild + translate, boxShadowOpacity);
            }
            //this is used to navigate through the sections
            ( offset >= 0 && offset < windowHeight ) ? actualBlock.addClass('is-visible') : actualBlock.removeClass('is-visible');
        });
    }

    function translateBlock(elem, value, shadow) {
        var position = Math.ceil(Math.abs(value.replace('px', '')));

        if (position >= $(window).width() / 2) {
            shadow = 0;
        } else if (position > 20) {
            shadow = boxShadowOpacityInitialValue;
        }

        elem.css({
            '-moz-transform'   : 'translateX(' + value + ')',
            '-webkit-transform': 'translateX(' + value + ')',
            '-ms-transform'    : 'translateX(' + value + ')',
            '-o-transform'     : 'translateX(' + value + ')',
            'transform'        : 'translateX(' + value + ')',
            'box-shadow'       : '0px 0px 40px rgba(0,0,0,' + shadow + ')'
        });
    }

    function scaleBlock(elem, value, opac) {
        elem.css({
            '-moz-transform'   : 'scale(' + value + ')',
            '-webkit-transform': 'scale(' + value + ')',
            '-ms-transform'    : 'scale(' + value + ')',
            '-o-transform'     : 'scale(' + value + ')',
            'transform'        : 'scale(' + value + ')',
            'opacity'          : opac
        });
    }

    function nextSection() {
        if (!animating) {
            if ($('.cd-section.is-visible').next().length > 0) smoothScroll($('.cd-section.is-visible').next());
        }
    }

    function prevSection() {
        if (!animating) {
            var prevSection = $('.cd-section.is-visible');
            if (prevSection.length > 0 && $(window).scrollTop() != prevSection.offset().top) {
                smoothScroll(prevSection);
            } else if (prevSection.prev().length > 0 && $(window).scrollTop() == prevSection.offset().top) {
                smoothScroll(prevSection.prev('.cd-section'));
            }
        }
    }

    function checkNavigation() {
        ( $(window).scrollTop() < $(window).height() / 2 ) ? $('.cd-vertical-nav .cd-prev').addClass('inactive') : $('.cd-vertical-nav .cd-prev').removeClass('inactive');
        ( $(window).scrollTop() > $(document).height() - 3 * $(window).height() / 2 ) ? $('.cd-vertical-nav .cd-next').addClass('inactive') : $('.cd-vertical-nav .cd-next').removeClass('inactive');
    }

    function smoothScroll(target) {
        animating = true;
        $('body,html').animate({'scrollTop': target.offset().top}, 500, function () {
            animating = false;
        });
    }
});

$(function () {
    /*
     * 频率控制 返回函数连续调用时，fn 执行频率限定为每多少时间执行一次
     * @param fn {function}  需要调用的函数
     * @param delay  {number}    延迟时间，单位毫秒
     * @param immediate  {bool} 给 immediate参数传递false 绑定的函数先执行，而不是delay后后执行。
     * @return {function}实际调用函数
     */
    var throttle = function (fn, delay, immediate, debounce) {
        var curr      = +new Date(),//当前事件
            last_call = 0,
            last_exec = 0,
            timer     = null,
            diff, //时间差
            context,//上下文
            args,
            exec      = function () {
                last_exec = curr;
                fn.apply(context, args);
            };
        return function () {
            curr = +new Date();
            context = this,
                args = arguments,
                diff = curr - (debounce ? last_call : last_exec) - delay;
            clearTimeout(timer);
            if (debounce) {
                if (immediate) {
                    timer = setTimeout(exec, delay);
                } else if (diff >= 0) {
                    exec();
                }
            } else {
                if (diff >= 0) {
                    exec();
                } else if (immediate) {
                    timer = setTimeout(exec, -diff);
                }
            }
            last_call = curr;
        }
    };

    /*
     * 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 delay，fn 才会执行
     * @param fn {function}  要调用的函数
     * @param delay   {number}    空闲时间
     * @param immediate  {bool} 给 immediate参数传递false 绑定的函数先执行，而不是delay后后执行。
     * @return {function}实际调用函数
     */

    var debounce = function (fn, delay, immediate) {
        return throttle(fn, delay, immediate, true);
    };

    var getMouseXY = function (e) {
        var x = 0, y = 0;
        if (e.pageX || e.pageY) {
            x = e.pageX;
            y = e.pageY;
        } else if (e.clientX || e.clientY) {
            x = e.clientX +
                document.documentElement.scrollLeft +
                document.body.scrollLeft;
            y = e.clientY +
                document.documentElement.scrollTop +
                document.body.scrollTop;
        }
        return {x: x, y: y};
    };

    var granimInstance = new Granim({
        element: '#gran',
        name   : 'granim',
        opacity: [0.5, 0.7],
        states : {
            "default-state": {
                gradients: [
                    ['#000000', '#434343'],
                    ['#70e1f5', '#ffd194'],
                    ['#FF5F6D', '#FFC371'],
                    ['#EECDA3', '#EECDA3'],
                    ['#E6DADA', '#274046'],
                    ['#1CD8D2', '#93EDC7']
                ]
            }
        }
    });

    var canvas   = $('#a_a_a'),
        logo     = $('#logo'),
        cpx      = $(window).width() / 2,
        cpy      = $(window).height() / 2,
        bn       = 15;

    var moveLogo = function (e) {
        var pos = getMouseXY(e);
        var rX  = (pos.x - cpx) / (cpx / bn),
            rY  = (cpy - pos.y) / (cpy / bn);

        logo.get(0).style.transform = 'rotateY(' + rX + 'deg) rotateX(' + rY + 'deg)';
        console.log(rX, rY)

    };

    canvas.on('mousemove', function (e) {
        throttle(moveLogo(e), 30, false)
    })
});