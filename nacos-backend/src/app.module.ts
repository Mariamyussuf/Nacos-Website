import { Module } from '@nestjs/common';
import { BlogModule } from './blog/blog.module';
import { EventsModule } from './events/events.module';
import { ResourcesModule } from './resources/resources.module';
import { SubscribersModule } from './subscribers/subscribers.module';
import { AuthModule } from './auth/auth.module';
import { UploadsModule } from './uploads/uploads.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { ContactModule } from './contact/contact.module';
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
  ],
})
export class AppModule {}


