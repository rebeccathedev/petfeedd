const REST = require("./REST");

class Sounds extends REST {
  model = "Sound";

  async bulkUpdate(request, response) {
    request.body = JSON.parse(request.body.body);

    if (Array.isArray(request.body)) {
      for (const i in request.body) {
        if (Object.hasOwnProperty.call(request.body, i)) {
          const sound = request.body[i];
          if (sound.file && request.files['file.' + sound.file]) {
            let uploadFile = request.files['file.' + sound.file];
            uploadFile.mv('./uploads/' + uploadFile.name);

            delete sound.file;
            sound.sound = uploadFile.name;
          }
        }
      }
    }

    return super.bulkUpdate(request, response);
  }
}

module.exports = Sounds;
