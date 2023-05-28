import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpInterceptor } from './common/http.interceptor';
import { HttpFilter } from './common/http.filter';
import { AuthGuard } from './common/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new HttpInterceptor());
  app.useGlobalFilters(new HttpFilter());
  app.useGlobalGuards(new AuthGuard());
  await app.listen(3000);
}

bootstrap();
