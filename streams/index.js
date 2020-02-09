const fs = require("fs");
const { Readable } = require("stream");
const moment = require("moment");

class MyReadableStream extends Readable {
  _read(size) {
    this.timeoutId = setTimeout(() => {
      this.push(moment().format("MMMM Do YYYY, h:mm:ss a") + "\n");
    }, 1000);
  }
}

const outReadStream = new MyReadableStream();

outReadStream.pipe(fs.createWriteStream("out.txt"));
