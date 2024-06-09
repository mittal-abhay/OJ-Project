import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuid } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirCodes = path.join(__dirname, './codes');


const generateFile =  async (language, code) => {

    if (!fs.existsSync(dirCodes)) {
        fs.mkdirSync(dirCodes, { recursive: true });
    }
    const jobId = uuid();
    let filename;
    let filepath;
    let dir;
    switch (language) {
      case "c++":
      case "cpp":
        {
          filename = `${jobId}.cpp`;
          dir = path.join(dirCodes, "cpp");
        }
        break;
      case "c":
        {
          filename = `${jobId}.c`;
          dir = path.join(dirCodes, "c");
        }
        break;
      case "py":
      case "python":
        {
          filename = `${jobId}.py`;
          dir = path.join(dirCodes, "py");
        }
        break;
      case "java":
        {
          filename = `${jobId}.java`;
          dir = path.join(dirCodes, "java");
        }
        break;
      default:
        throw new Error(`Unsupported language: ${language}`);
    }
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    filepath = path.join(dir, filename);
    fs.writeFileSync(filepath, code);
    return filepath;
};

export default generateFile ;
