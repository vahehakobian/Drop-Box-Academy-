import { diskStorage } from 'multer';
import path from 'path';
import { v4 as uuid } from 'uuid';

export class StorageProvider {
    static UPLOADS_PATH = './uploads';


    static FILE_DIR_PATH () {

    }
    static uploadFileOptions = (imagePath: string) => ({
        storage: diskStorage({
            destination: imagePath,
            filename: (req, file, cb) => {
                const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuid();
                const extension: string = path.parse(file.originalname).ext;
                cb(null, `${filename}${extension}`)
            }
            
        })
        
    })


    static FilesOptions = this.uploadFileOptions(this.UPLOADS_PATH);
}
