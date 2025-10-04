import { UserModel } from './user.model';

export interface AuthStateModel {
  user: UserModel | null;
  token: string | null;
}
