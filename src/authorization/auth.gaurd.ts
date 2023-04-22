import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import {
  auth,
  requiredScopes,
  InvalidTokenError,
  UnauthorizedError,
} from 'express-oauth2-jwt-bearer';
import { promisify } from 'util';

export const checkScopes = requiredScopes('admin');

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  issuerBaseURL = this.configService.get('AUTH0_URL');
  audiance = this.configService.get('AUDIENCE');

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const validateAccessToken = promisify(auth({
        audience: this.audiance,
        issuerBaseURL: this.issuerBaseURL
    }));

    try {
      await validateAccessToken(request, response);

      return true;
    } catch (error) {
      if (error instanceof InvalidTokenError) {
        throw new UnauthorizedException('Bad credentials');
      }

      if (error instanceof UnauthorizedError) {
        throw new UnauthorizedException('Requires authentication');
      }

      throw new InternalServerErrorException();
    }
  }
}

/*
Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Iko0VVhtWTJtTF94THhFemJrVHllciJ9.eyJpc3MiOiJodHRwczovL3d0aXgtZGV2LnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw2M2YyYzUzNTBiY2E3MDQ5OTI1OTJiYWIiLCJhdWQiOlsiaHR0cHM6Ly9sb2NhbGhvc3Q6ODAwMCIsImh0dHBzOi8vd3RpeC1kZXYudXMuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTY4MjIwMjM1NywiZXhwIjoxNjgyMjg4NzU3LCJhenAiOiJyaWlDY3J4RDBvN043b0FycWdXVFRUbmlNbVlNNldpTCIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgYWRtaW4iLCJwZXJtaXNzaW9ucyI6WyJhZG1pbiJdfQ.wBlhoc_lvCvCiI2WoFa5gxd6uIvKgIXeD-ufyfe7mCHt-pXBphOrVZEdUnum0lvDH5X_cjJjWse5HV9Clpk9D0Np1H9-1ScqXUg_8HnZj21D8Gy6phi-jakzu4epxpDArC-YUHI727aUJbjJEpG3jrln7OV7I5hvyuFKgbHEo9wVEEsMp8a9nYmEWrPEReGnfuDzzx3mMX8lvae9o83117iu_QAL4YiI5StRgCso5CFZeRTnJ8k-ipo55YPXjCs6rB6-6yCKsMxksm6r1rF8yqKqpSjrSO6nESYHCD3vlyeuR3JtTZlWJ6Tdqu8gsHsXnqE_ifG_4-s6sZrC5zEhzQ
*/