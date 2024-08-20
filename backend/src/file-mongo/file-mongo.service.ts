import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ObjectId } from 'typeorm';
import { FileMongo } from './file-mongo.entity';
import { parseCreateFileMongoDto } from './dto/create-file-mongo.dto';

@Injectable()
export class FileMongoService {
  constructor(
    @InjectRepository(FileMongo, 'mongoConnection')
    private fileRepository: Repository<FileMongo>,
  ) {}

  async create(createFileDto: Partial<FileMongo>): Promise<FileMongo> {
    const parsedDto = parseCreateFileMongoDto(createFileDto);
    const newFile = this.fileRepository.create({
      parent_id: parsedDto.parent_id,
      file_name: parsedDto.file_name,
    });
    return this.fileRepository.save(newFile);
  }

  findAll(): Promise<FileMongo[]> {
    return this.fileRepository.find();
  }

  async findFilesByParent(parent_id: string): Promise<FileMongo[] | null> {
    const files = await this.fileRepository.find({
      where: { parent_id: parent_id },
    });
    return files;
  }

  findOne(id: string): Promise<FileMongo | null> {
    const _id = new ObjectId(id);
    return this.fileRepository.findOneBy({ _id });
  }

  async remove(id: string): Promise<void> {
    await this.fileRepository.delete(id);
  }
}
