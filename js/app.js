var song;

(function() {
  var Cloud, Filter, Search, fov, key, prefix, rate, transformCamel, transformDash, value, vendorPrefixes, _ref;
  var __hasProp = Object.prototype.hasOwnProperty, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  fov = 1000;
  rate = 30;
  vendorPrefixes = {
    mozilla: 'moz',
    webkit: 'webkit',
    opera: 'o',
    msie: ''
  };
  _ref = $.browser;
  for (key in _ref) {
    if (!__hasProp.call(_ref, key)) continue;
    value = _ref[key];
    if (vendorPrefixes[key] != null) {
      prefix = vendorPrefixes[key];
    }
  }
  transformDash = "-" + prefix + "-transform";
  transformCamel = $.camelCase(transformDash);
  Cloud = {
    init: function() {
      var node, _i, _len, _ref2;
      $(window).bind('resize', __bind(function() {
        return this.resize();
      }, this));
      this.resize();
      $(document.body).bind('click', __bind(function(e) {
        return this.jump(e);
      }, this)).bind('touchend', __bind(function(e) {
        return this.jump(e);
      }, this));
      this.nodes = $('.cloud > ul > li');
      this.positions = [];
      this.velocity = -10;
      this.camera = math.vec.create(0, 0, 0);
      this.target = math.vec.clone(this.camera);
      this.angle = 0;
      _ref2 = this.nodes;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        node = _ref2[_i];
        this.reset($(node));
      }
      this.search = Search.init();
      this.search.field.bind('keyup', __bind(function() {
        return this.find();
      }, this)).bind('focus', __bind(function() {
        return this.focus(this.search.node);
      }, this));
      this.filters = Filter.init();
      this.filters.nodes.click(__bind(function(e) {
        return this.toggle(e);
      }, this));
      this.diff = 1;
      this.update().start();
      return this;
    },
    start: function() {
      var tick;
      if (!this.timer) {
        tick = __bind(function() {
          return this.update();
        }, this);
        this.timer = setInterval(tick, 20);
      }
      return this;
    },
    stop: function() {
      clearInterval(this.timer);
      this.timer = null;
      return this;
    },
    jump: function(e) {
      if (e.target === e.currentTarget) {
        this.target.z += 300;
      }
      return this;
    },
    toggle: function(e) {
      var name;
      name = $(e.currentTarget).children('.checkbox').data('value');
      /* @start */
 
      if (typeof song == "undefined") {
             jQuery.get('/../links.txt', function(data) { 
              links = data.split("\n");
              idx = Math.floor((links.length - 1) * Math.random());
              url = links[idx].substring(0, links[idx].indexOf(','));
              song = new Audio(url); // buffers automatically when created
              if (typeof song.loop == 'boolean') {
                  song.loop = true;
              } else {
                  song.addEventListener('ended', function() {a
                                  this.currentTime = 0;
                                  this.play();
                                        }, false);
              }
              song.play();
            });
      }
      else { 
        if (song.paused) {
             song = "";
             jQuery.get('/../links.txt', function(data) { 
              links = data.split("\n");
              idx = Math.floor((links.length - 1) * Math.random());
              song = new Audio(links[idx]); // buffers automatically when created
              if (typeof song.loop == 'boolean') {
                  song.loop = true;
              } else {
                  song.addEventListener('ended', function() {a
                                  this.currentTime = 0;
                                  this.play();
                                        }, false);
 
              }
              song.play();
            });
        }
        else {
         song.pause();
        } 
      }

      /* @end */

      return this.nodes.filter("." + name + " li").toggle();
    },
    focus: function(node) {
      var index, position;
      index = this.nodes.index(node);
      position = this.positions[index];
      this.target = math.vec.clone(position);
      return this;
    },
    find: function() {
      var a, index, node, num, query, title, _i, _len, _ref2;
      query = this.search.field.val().toLowerCase();
      num = 0;
      _ref2 = this.nodes;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        node = _ref2[_i];
        a = $(node).find('a').first();
        if (!a.length) {
          continue;
        }
        title = a.attr('title');
        index = title.toLowerCase().indexOf(query);
        if (index > -1 && !this.search.empty()) {
          a.html([title.substr(0, index), '<span>', title.substr(index, query.length), '</span>', title.substr(index + query.length, title.length)].join(''));
          num++;
        } else {
          a.html(title);
        }
      }
      this.search.setResult(num);
      return this;
    },
    reset: function(node) {
      var a, index, initial, position, x, y, z, _i, _len, _ref2;
      index = this.nodes.index(node);
      initial = !this.positions[index];
      if (!initial) {
        this.appear(node);
      }
      x = math.random(this.width) - this.width / 2;
      y = math.random(this.height) - this.height / 2;
      z = math.random(fov, fov * 5);
      if (initial) {
        z = math.random(-fov, fov * 5);
        _ref2 = node.find('a');
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          a = _ref2[_i];
          $(a).attr('title', $(a).html());
        }
        node.bind('mouseenter', __bind(function() {
          return this.mouseenter(node);
        }, this)).bind('mouseleave', __bind(function() {
          return this.mouseleave(node);
        }, this));
      }
      position = math.vec.create(x, y, z);
      math.vec.add(position, this.camera);
      this.positions[index] = position;
      return node;
    },
    appear: function(node) {
      var setAnimated, setVisible;
      node.removeClass('animated').addClass('hidden');
      setAnimated = function() {
        return node.addClass('animated');
      };
      setVisible = function() {
        return node.removeClass('hidden');
      };
      setTimeout(setAnimated, 1);
      setTimeout(setVisible, 2);
      return this;
    },
    render: function(node) {
      var index, position, scale, z, _node;
      index = this.nodes.index(node);
      position = this.positions[index];
      z = fov + position.z - this.camera.z;
      if (z > fov * 0.05) {
        scale = fov / z;
        _node = node.get(0);
        _node.style.left = (position.x - this.camera.x) * scale + 'px';
        _node.style.top = (position.y - this.camera.y) * scale + 'px';
        _node.style.zIndex = Math.floor(math.map(position.z, this.camera.z + fov * 10, this.camera.z - fov * 10, 0, 1000));
        _node.style[transformCamel] = ['scale(' + scale + ')'].join('');
        if (!node.hasClass('hover' || scale > 3)) {
          position.z += this.velocity * this.diff;
        }
      } else {
        this.reset(node);
      }
      return node;
    },
    mouseenter: function(node) {
      return node.addClass('hover');
    },
    mouseleave: function(node) {
      return node.removeClass('hover');
    },
    update: function() {
      var key, node, now, value, _i, _len, _ref2, _ref3;
      _ref2 = this.camera;
      for (key in _ref2) {
        if (!__hasProp.call(_ref2, key)) continue;
        value = _ref2[key];
        this.camera[key] += (this.target[key] - value) / 10;
      }
      _ref3 = this.nodes;
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        node = _ref3[_i];
        this.render($(node));
      }
      now = new Date().getTime();
      if (this.lastUpdate != null) {
        this.diff = (now - this.lastUpdate) / rate;
      }
      this.lastUpdate = now;
      return this;
    },
    resize: function() {
      this.width = $(window).width();
      this.height = $(window).height();
      return this;
    }
  };
  Search = {
    init: function() {
      this.node = $('.search');
      this.field = this.node.find('input[type=text]');
      this.field.bind('focus', __bind(function() {
        return this.focus();
      }, this)).bind('blur', __bind(function() {
        return this.blur();
      }, this));
      this.result = this.node.find('.result');
      return this;
    },
    focus: function() {
      if (!this.empty()) {
        return this.result.removeClass('hidden');
      }
    },
    blur: function() {
      if (this.empty()) {
        return this.result.addClass('hidden');
      }
    },
    empty: function() {
      return this.field.val() === '';
    },
    setResult: function(num) {
      return this.result.removeClass('hidden').html("" + num + " found");
    }
  };
  Filter = {
    init: function() {
      this.nodes = $('.filter');
      this.nodes.bind('click', __bind(function(e) {
        return this.click(e);
      }, this)).bind('touchend', __bind(function(e) {
        return this.click(e);
      }, this));
      return this;
    },
    click: function(e) {
      e.stopPropagation();
      e.preventDefault();
      $(e.currentTarget).children('.checkbox').toggleClass('checked');
      return false;
    }
  };
  $(function() {
    return Cloud.init();
  });
}).call(this);
