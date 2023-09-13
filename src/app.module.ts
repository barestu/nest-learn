import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'secret123',
      database: 'nestjs_development',
      entities: [],
      synchronize: true, // TODO: Turn off in production
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
