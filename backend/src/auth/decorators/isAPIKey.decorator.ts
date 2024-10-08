import { SetMetadata } from '@nestjs/common';

export const IS_API_KEY = 'isApiKey';
export const AllowApiKey = () => SetMetadata(IS_API_KEY, true);
