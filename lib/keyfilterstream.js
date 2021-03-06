
var Transform = require("./streamwrapper").Transform;

var counter = 0;

function KeyFilterStream(options) {
  if (!(this instanceof KeyFilterStream)) {
    return new KeyFilterStream(options);
  }

  options.objectMode = true;

  Transform.call(this, options);

  this.start = options.start;
  
  var that = this;
  this.counter = counter++;

  this.once("pipe", function(source) {
    that.source = source;
  });

  this._destroyed = false;
}

KeyFilterStream.prototype = Object.create(
  Transform.prototype,
  { constructor: { value: KeyFilterStream } }
);

KeyFilterStream.prototype._transform = function(data, encoding, done) {

  if (this._destroyed || data.key.indexOf(this.start) < 0) {
    this.source.destroy();
  } else {
    this.push(JSON.parse(data.value));
  }

  done();
};

KeyFilterStream.prototype.destroy = function() {
  this._destroyed = true;
};

module.exports = KeyFilterStream;
