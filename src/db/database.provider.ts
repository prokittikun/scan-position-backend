/* eslint-disable prettier/prettier */
import { Sequelize } from 'sequelize-typescript';
import { User } from './entities/user.entity';
// import { Reserve } from './entities/reserve.entity';
// import { Room } from './entities/room.entity';

export const Database = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '',
        database: 'form_data',
      });
      sequelize.addModels([User]);
    //   sequelize.addModels([Room]);
    //   sequelize.addModels([Reserve]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
