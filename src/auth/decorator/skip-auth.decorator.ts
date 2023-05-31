import { SetMetadata } from '@nestjs/common';
import { IS_SKIP_AUTH } from '../constants/constants';

export const SkipAuth = (isSkip = true) => SetMetadata(IS_SKIP_AUTH, isSkip);
