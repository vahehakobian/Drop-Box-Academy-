import { FileRepository } from './file.repository';
import {Injectable, StreamableFile} from '@nestjs/common';
import { FileDto } from 'modules/common/modules/files/files.dto';
import fs from 'fs'
import { join } from 'path'
import { Response } from 'express';
@Injectable()
export class FileService {
    constructor (private readonly fileRepository: FileRepository) {}
    async create(files, user) {
        return await  files.map(async(file) => {
            await this.fileRepository.save(
                {
                    path:file.path,
                    name: file.originalname,
                    shareLink: `localhost:3000/${file.path}`,
                    user: user
                }
            )
        })
    }
    async getUserAllFiles(id: string): Promise<FileDto[]> {
        return  (await this.fileRepository.findAllById(id)).toDtos();   
    }
    async getOne(userId: string,id: string): Promise<FileDto> {
        return await (await this.fileRepository.findOneBy({id:id,userId:userId})).toDto()
    }
    async delete(id: string) {
        const file = await this.fileRepository.findOne({
            where:{id}
        })
        fs.unlinkSync(file.path)
        return await this.fileRepository.delete(id);
    }
    async getShareLink(id: string) {
        const file = await this.fileRepository.findOne({
            where: {id}
        })
        return `localhost:3000/uploads/${file.path}`
    }
    async downloadFile(userId: string,id: string,response: Response) {
        const tmp = (await this.fileRepository.findOneBy({id:id,userId:userId})).toDto()
        const file = fs.readFileSync(join(process.cwd(), tmp.path))
        const ext = tmp.path.substring(tmp.path.lastIndexOf('.')+ 1)
        response.contentType(ext)
        
        return new StreamableFile(file)
    }
}