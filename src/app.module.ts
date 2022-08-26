import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PositionModule } from './position/position.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './db/database.module';
import { LogService } from './services/log.service';

@Module({
  imports: [PositionModule, UserModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService, LogService],
})
export class AppModule {}
