var slider = function (sliderElement) {

  var pages = [];
  var currentSlide = 1;
  var isChanging = false;
  var keyUp = { 38: 1, 33: 1 };
  var keyDown = { 40: 1, 34: 1 };

  var init = function () {

    document.body.classList.add('slider__body');

    // control scrolling
    whatWheel = 'onwheel' in document.createElement('div') ? 'wheel' : document.onmousewheel !== undefined ? 'mousewheel' : 'DOMMouseScroll';
    window.addEventListener(whatWheel, function (e) {
      var direction = e.wheelDelta || e.deltaY;
      if (direction > 0) {
        changeSlide(-1);
      } else {
        changeSlide(1);
      }
    });

    // allow keyboard input
    window.addEventListener('keydown', function (e) {
      if (keyUp[e.keyCode]) {
        changeSlide(-1);
      } else if (keyDown[e.keyCode]) {
        changeSlide(1);
      }
    });

    // page change animation is done
    detectChangeEnd() && document.querySelector(sliderElement).addEventListener(detectChangeEnd(), function () {
      if (isChanging) {
        setTimeout(function () {
          isChanging = false;
          window.location.hash = document.querySelector('[data-slider-index="' + currentSlide + '"]').id;
        }, 400);
      }
    });

    // set up page and build visual indicators
    document.querySelector(sliderElement).classList.add('slider__container');
    var indicatorContainer = document.createElement('div');
    indicatorContainer.classList.add('slider__indicators');

    var index = 1;
    [].forEach.call(document.querySelectorAll(sliderElement + ' > *'), function (section) {

      var indicator = document.createElement('a');
      indicator.classList.add('slider__indicator')
      indicator.setAttribute('data-slider-target-index', index);
      indicatorContainer.appendChild(indicator);

      section.classList.add('slider__page');
      pages.push(section);
      section.setAttribute('data-slider-index', index++);
    });

    document.body.appendChild(indicatorContainer);
    document.querySelector('a[data-slider-target-index = "' + currentSlide + '"]').classList.add('slider__indicator--active');


    // stuff for touch devices
    var touchStartPos = 0;
    var touchStopPos = 0;
    var touchMinLength = 90;
    document.addEventListener('touchstart', function (e) {
      e.preventDefault();
      if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel') {
        var touch = e.touches[0] || e.changedTouches[0];
        touchStartPos = touch.pageY;
      }
    }, { passive: false });
    document.addEventListener('touchend', function (e) {
      e.preventDefault();
      if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel') {
        var touch = e.touches[0] || e.changedTouches[0];
        touchStopPos = touch.pageY;
      }
      if (touchStartPos + touchMinLength < touchStopPos) {
        changeSlide(-1);
      } else if (touchStartPos > touchStopPos + touchMinLength) {
        changeSlide(1);
      }
    });
  };


  // prevent double scrolling
  var detectChangeEnd = function () {
    var transition;
    var e = document.createElement('foobar');
    var transitions = {
      'transition': 'transitionend',
      'OTransition': 'oTransitionEnd',
      'MozTransition': 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd'
    };

    for (transition in transitions) {
      if (e.style[transition] !== undefined) {
        return transitions[transition];
      }
    }
    return true;
  };


  // handle css change
  var changeCss = function (obj, styles) {
    for (var _style in styles) {
      if (obj.style[_style] !== undefined) {
        obj.style[_style] = styles[_style];
      }
    }
  };

  // handle page/section change
  var changeSlide = function (direction) {

    // already doing it or last/first page, staph plz
    if (isChanging || (direction == 1 && currentSlide == pages.length) || (direction == -1 && currentSlide == 1)) {
      return;
    }

    // change page
    currentSlide += direction;
    isChanging = true;
    changeCss(document.querySelector(sliderElement), {
      transform: 'translate3d(0, ' + -(currentSlide - 1) * 100 + '%, 0)'
    });

    // change dots
    document.querySelector('a.slider__indicator--active').classList.remove('slider__indicator--active');
    document.querySelector('a[data-slider-target-index="' + currentSlide + '"]').classList.add('slider__indicator--active');
  };

  // go to spesific slide if it exists
  var gotoSlide = function (where) {
    var target = document.querySelector(where).getAttribute('data-slider-index');
    //console.log("Target ", target);
    //console.log("CurrentSlide ", currentSlide);
    if (target != currentSlide && document.querySelector(where)) {
      changeSlide(target - currentSlide);
    }
  };

  // if page is loaded with hash, go to slide
  if (location.hash) {
    setTimeout(function () {
      window.scrollTo(0, 0);
      //console.log("location.hash", location.hash);
      gotoSlide(location.hash);
    }, 1);
  };

  // we have lift off
  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('onload', init(), false);
  }

  (document).addEventListener("click", function () {
    if (document.activeElement.className == "pres") {
      gotoSlide("#presentacion");
    }
    if (document.activeElement.className == "noso") {
      gotoSlide("#nosotros");
    }
    if (document.activeElement.className == "prod") {
      gotoSlide("#Productos");
    }
    if (document.activeElement.className == "serv") {
      gotoSlide("#Servicios");
    }
    if (document.activeElement.className == "cont") {
      gotoSlide("#contacto");
    }
  })

  // expose gotoSlide function
  return {
    gotoSlide: gotoSlide
  }
};

/*
    (".slider__indicator").click(function(){
      console.log('$(this).val():', (this).val());
    });


    console.log('$(this).val():', $(this).val());
    console.log("DAC ", document.activeElement.className);
    //if (document.activeElement.className == "slider__indicator") {
    var indice = a.getAttribute("data-slider-target-index");
    console.log("Indice: ", indice);
    //}



    <div class="slider__indicators">
      <a class="slider__indicator slider__indicator--active" data-slider-target-index="1"></a>
      <a class="slider__indicator" data-slider-target-index="2"></a>
      <a class="slider__indicator" data-slider-target-index="3"></a>
      <a class="slider__indicator" data-slider-target-index="4"></a>
      <a class="slider__indicator" data-slider-target-index="5"></a>
      <a class="slider__indicator" data-slider-target-index="6"></a>
    </div>
*/


