import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private authService: AuthService) {
    super();
  }

  serializeUser(user: any, done: (err: Error | null, user: any) => void): void {
    done(null, user.id);
  }

  async deserializeUser(
    id: string,
    done: (err: Error | null, payload: any) => void,
  ): Promise<void> {
    try {
      const user = await this.authService.findById(id);
      done(null, user);
    } catch (err) {
      done(err as Error, null);
    }
  }
}
