import { Module } from '@nestjs/common';
import { BlogModule } from './blog/blog.module';
import { EventsModule } from './events/events.module';
import { ResourcesModule } from './resources/resources.module';
import { SubscribersModule } from './subscribers/subscribers.module';
import { AuthModule } from './auth/auth.module';
import { UploadsModule } from './uploads/uploads.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { ContactModule } from './contact/contact.module';
import { FormsModule } from './forms/forms.module';
import { CaptchaModule } from './captcha/captcha.module';
import { AppController } from './app.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule,
    BlogModule,
    EventsModule,
    ResourcesModule,
    SubscribersModule,
    UploadsModule,
    NewsletterModule,
    ContactModule,
    FormsModule,
    CaptchaModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
