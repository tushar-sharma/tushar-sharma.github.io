(function() {
  var math, prev, root;
  root = this;
  prev = root.math;
  if (typeof exports !== 'undefined') {
    math = exports;
  } else {
    math = root.math = {};
  }
  math.noConflict = function() {
    root.math = prev;
    return this;
  };
  math.random = function(a, b) {
    if (b == null) {
      b = 0;
    }
    return a + Math.random() * (b - a);
  };
  math.lerp = function(a, b, bias) {
    if (bias == null) {
      bias = 0.5;
    }
    return a + bias * (b - a);
  };
  math.map = function(n, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * ((n - low1) / (high1 - low1));
  };
  math.sq = function(n) {
    return n * n;
  };
  math.deg = function(n) {
    return n * 180 / Math.PI;
  };
  math.rad = function(n) {
    return n * Math.PI / 180;
  };
  math.vec = {
    create: function(x, y, z, w) {
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      if (z == null) {
        z = 0;
      }
      if (w == null) {
        w = 1;
      }
      return {
        x: x,
        y: y,
        z: z,
        w: w
      };
    },
    clone: function(v) {
      return {
        x: v.x,
        y: v.y,
        z: v.z,
        w: v.w
      };
    },
    add: function(a, b) {
      a.x += b.x;
      a.y += b.y;
      a.z += b.z;
      return a;
    },
    sub: function(a, b) {
      a.x -= b.x;
      a.y -= b.y;
      a.z -= b.z;
      return a;
    },
    mult: function(v, k) {
      a.x *= k;
      a.y *= k;
      a.z *= k;
      return a;
    },
    mag: function(v) {
      return Math.sqrt(math.sq(v.x) + math.sq(v.y) + math.sq(v.z));
    },
    norm: function(v) {
      var mag;
      mag = math.vec.mag(v);
      if (mag === 1) {
        return math.vec.create(v.x, v.y, v.z);
      } else if (!mag) {
        return math.vec.create();
      } else {
        mag = 1 / mag;
        return math.vec.create(v.x * mag, v.y * mag, v.z * mag);
      }
    },
    cross: function(a, b) {
      var x, y, z;
      x = a.y * b.z - a.z * b.y;
      y = a.z * b.x - a.x * b.z;
      z = a.x * b.y - a.y * b.x;
      return math.vec.create(x, y, z);
    },
    dot: function(a, b) {
      return a.x * b.x + a.y * b.y + a.z * b.z;
    }
  };
  math.matrix = {
    create: function(size) {
      var i, j, result;
      if (size == null) {
        size = 4;
      }
      result = [];
      for (i = 0; 0 <= size ? i < size : i > size; 0 <= size ? i++ : i--) {
        result[i] = [];
        for (j = 0; 0 <= size ? j < size : j > size; 0 <= size ? j++ : j--) {
          result[i][j] = 0;
        }
      }
      return result;
    },
    identity: function(size) {
      var i, j, k, result;
      if (size == null) {
        size = 4;
      }
      result = [];
      k = 0;
      for (i = 0; 0 <= size ? i < size : i > size; 0 <= size ? i++ : i--) {
        result[i] = [];
        for (j = 0; 0 <= size ? j < size : j > size; 0 <= size ? j++ : j--) {
          result[i][j] = j === k ? 1 : 0;
        }
        k++;
      }
      return result;
    },
    translate: function(m, x, y, z) {
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      if (z == null) {
        z = 0;
      }
      return math.matrix.mult(m, [[1, 0, 0, x], [0, 1, 0, y], [0, 0, 1, z], [0, 0, 0, 1]]);
    },
    mult: function(a, b) {
      var i, j, k, result, size, w;
      size = a.length;
      result = math.matrix.create(size);
      if (typeof b === 'number') {
        for (i = 0; 0 <= size ? i < size : i > size; 0 <= size ? i++ : i--) {
          w = b.w ? a[i][3] * b : 0;
          result[i] = a[i][0] * b + a[i][1] * b + a[i][2] * b + w;
        }
      } else if (b.toString() === '[object Object]') {
        for (i = 0; 0 <= size ? i < size : i > size; 0 <= size ? i++ : i--) {
          w = b.w ? a[i][3] * b.w : 0;
          result[i] = a[i][0] * b.x + a[i][1] * b.y + a[i][2] * b.z + w;
        }
      } else {
        for (i = 0; 0 <= size ? i < size : i > size; 0 <= size ? i++ : i--) {
          for (j = 0; 0 <= size ? j < size : j > size; 0 <= size ? j++ : j--) {
            for (k = 0; 0 <= size ? k < size : k > size; 0 <= size ? k++ : k--) {
              result[i][k] += a[i][j] * b[j][k];
            }
          }
        }
      }
      return result;
    }
  };
}).call(this);
