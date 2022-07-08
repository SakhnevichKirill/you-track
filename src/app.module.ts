import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
    envFilePath: `.${process.env.NODE_ENV}.env`,
      validationOptions: {
        allowUnknown: false,
        abortEarly: false
      },
      cache: true,
      isGlobal: true
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
