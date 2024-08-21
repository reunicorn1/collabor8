import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ObjectId } from 'typeorm';
import { FileMongo } from './file-mongo.entity';
import { parseCreateFileMongoDto, CreateFileOutDto, parseUpdateFileMongoDto,
  UpdateFileOutDto
} from './dto/create-file-mongo.dto';

@Injectable()
export class FileMongoService {
  constructor(
    @InjectRepository(FileMongo, 'mongoConnection')
    private fileRepository: Repository<FileMongo>,
  ) {}

  async create(createFileDto: CreateFileOutDto): Promise<FileMongo> {
    const parsedDto = parseCreateFileMongoDto(createFileDto);
    const newFile = this.fileRepository.create({
      parent_id: parsedDto.parent_id,
      file_name: parsedDto.file_name,
      project_id: parsedDto.project_id,
      file_content: parsedDto.file_content,
    });
    return await this.fileRepository.save(newFile);
  }

  async findAll(): Promise<FileMongo[]> {
    return await this.fileRepository.find();
  }

  async findFilesByParent(parent_id: string): Promise<FileMongo[] | null> {
    const files = await this.fileRepository.find({
      where: { parent_id: parent_id },
    });
    return files;
  }

  async findOne(id: string): Promise<FileMongo | null> {
    const _id = new ObjectId(id);
    return await this.fileRepository.findOneBy({ _id });
  }

  async update(id: string, updateFileDto: UpdateFileOutDto): Promise<FileMongo> {
    const parsedDto = parseCreateFileMongoDto(updateFileDto);
    const file = await this.findOne(id);
    if (!file) {
      throw new Error('File not found');
    }
    file.file_name = parsedDto.file_name;
    file.file_content = parsedDto.file_content;
    file.updated_at = new Date();
    return await this.fileRepository.save(file);
  }



  async remove(id: string): Promise<void> {
    await this.fileRepository.delete(id);
  }
}
