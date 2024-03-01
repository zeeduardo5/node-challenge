import axios from 'axios';
import { LOGIN_URL } from '../constants';
import { CredentialsPayload, User } from '../types';

export class LoginController {
  async login(credentials: CredentialsPayload): Promise<User> {
    let user = (
      await axios.post<User>(LOGIN_URL, JSON.stringify(credentials), {
        headers: {
          'Content-Type': 'application/json',
        },
      })
    ).data;

    user = this.extractRequiredProductProperties(user);
    return user;
  }

  private extractRequiredProductProperties(user: User): User {
    return {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      token: user.token,
    };
  }
}
