import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { LogService } from '../services/log.service';
import * as QRCode from 'qrcode';
import * as fs from 'fs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const QrCode = require('qrcode-reader');
import * as Jimp from 'jimp';
import { join } from 'path';
import { EnumStatus } from '../enum/enum-status';

@Injectable()
export class PositionService {
  private logger = new LogService(PositionService.name);

  async api_generateQrcode(createPositionDto: CreatePositionDto, Req: any) {
    const tag = this.api_generateQrcode.name;
    try {
      const res = {
        resCode: EnumStatus.success,
        resData: await this.generateQrcode(createPositionDto, Req),
        msg: '',
      };
      return res;
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async generateQrcode(createPositionDto: CreatePositionDto, Req: any) {
    const tag = this.generateQrcode.name;
    try {
      const imagePath = [];

      for (let i = 0; i < 23; i++) {
        if (!fs.existsSync(`public/qrcode/${i + 1}.png`)) {
          const index = i + 1;
          const payload = `https://opd-evaluate.flowmisite.com/form/${index}`;
          const option = {
            color: {
              dark: '#000000', // สีตัว QRcode ตรงนี้กำหนดไว้เป็นสีน้ำ
              light: '#FFFFFF', // สีพื้นหลัง
            },
          };
          // const randomChars =
          //   'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
          const name = `${index}`;
          // for (let i = 0; i < 10; i++) {
          //   name += randomChars.charAt(
          //     Math.floor(Math.random() * randomChars.length),
          //   );
          // }
          QRCode.toFile(`public/qrcode/${name}.png`, payload, option, (err) => {
            if (err) throw err;
            console.log('done');
          });
        } else {
          const num = i + 1;
          const buffer = fs.readFileSync(
            join(__dirname, '../../', `public/qrcode/${num}.png`),
          );
          // console.log('buffer ->', buffer);
          Jimp.read(buffer, async function (err, image) {
            if (err) {
              console.error(err);
              // TODO handle error
            }
            const qr = new QrCode();
            qr.callback = function (err, value) {
              if (err) {
                console.error(err);
                // TODO handle error
              }
              console.log(value.result);

              if (
                value.result !== `${createPositionDto.domain}/form/${i + 1}`
              ) {
                fs.unlinkSync(`public/qrcode/${i + 1}.png`);
                const index = i + 1;
                const payload = `${createPositionDto.domain}/form/${index}`;
                const option = {
                  color: {
                    dark: '#000000', // สีตัว QRcode ตรงนี้กำหนดไว้เป็นสีน้ำ
                    light: '#FFFFFF', // สีพื้นหลัง
                  },
                };
                // const randomChars =
                //   'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                const name = `${index}`;
                // for (let i = 0; i < 10; i++) {
                //   name += randomChars.charAt(
                //     Math.floor(Math.random() * randomChars.length),
                //   );
                // }
                QRCode.toFile(
                  `public/qrcode/${name}.png`,
                  payload,
                  option,
                  (err) => {
                    if (err) throw err;
                    console.log('done');
                  },
                );
              }
            };
            qr.decode(image.bitmap);
          });
        }
        imagePath.push({
          path: `${Req.protocol + '://' + Req.get('host')}/qrcode/${i + 1}.png`,
        });
      }
      return imagePath;
    } catch (error) {
      this.logger.error(`${tag} -> `, error);
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    // console.log(createPositionDto.domain);
  }

  findAll() {
    return `This action returns all position`;
  }

  findOne(id: number) {
    return `This action returns a #${id} position`;
  }

  update(id: number, updatePositionDto: UpdatePositionDto) {
    return `This action updates a #${id} position`;
  }

  remove(id: number) {
    return `This action removes a #${id} position`;
  }
}
