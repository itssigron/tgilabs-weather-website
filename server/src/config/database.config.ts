import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export default (): { database: TypeOrmModuleOptions } => ({
  database: {
    type: process.env.DB_TYPE as any,
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    entities: [join(require.main.path, '/**/*.entity{.ts,.js}')],
    autoLoadEntities: true
  }
});