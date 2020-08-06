import File from '../models/File';

class FileController {
  async store(req, res) {
    try {
      const { originalname: name, key: path } = req.file;

      const file = await File.create({
        name,
        path,
      });

      return res.json(file);
    } catch (err) {
      return console.log(err);
    }
  }
}

export default new FileController();
