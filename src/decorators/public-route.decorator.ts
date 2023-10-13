import { SetMetadata } from '@nestjs/common';
import { AUTH } from '@constants/auth.constant';

export const Public = () => SetMetadata(AUTH.IS_PUBLIC, true);