import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EnumStatus } from '../enum/enum-status';
import { LogService } from '../services/log.service';
import { User } from '../db/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const lineNotify = require('line-notify-nodejs')(
  'fffWyyviRrkHiRGBQvZjDCdDYpvAp7jc2sx4xa8RQBW',
);

@Injectable()
export class UserService {
  private logger = new LogService(UserService.name);

  constructor(
    @Inject('USERS_REPOSITORY')
    private userDB: typeof User,
  ) {}
  async api_addData(createUserDto: CreateUserDto) {
    const res = {
      resCode: EnumStatus.success,
      resData: await this.addData(createUserDto),
      msg: '',
    };
    return res;
  }
  async addData(createUserDto: CreateUserDto) {
    const tag = this.addData.name;
    try {
      const userData = {
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        form: createUserDto.form,
      };
      let a = `\n= รายละเอียดกรอกมาจากจุด ${createUserDto.form} =\n`;
      a += 'ชื่อ : ';
      a += `${createUserDto.firstName}\n`;
      a += 'นามสกุล : ';
      a += `${createUserDto.lastName}\n`;

      lineNotify.notify({
        message: a,
      });
      return await this.userDB.create(userData);
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
