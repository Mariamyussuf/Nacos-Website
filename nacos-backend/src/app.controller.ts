import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHealth() {
    return {
      status: 'online',
      message: 'NACOS Bells Chapter API is running smoothly 🚀',
      version: '1.0.0',
      college: 'College of Information and Communications Technology, Bells University of Technology',
      documentation: 'https://github.com/Mariamyussuf/Nacos-Website',
      endpoints: {
        blogs: '/api/blogs',
        events: '/api/events',
        resources: '/api/resources',
        banner: '/api/banner',
        contact: '/api/contact',
        subscribers: '/api/subscribe',
      },
    };
  }
}
