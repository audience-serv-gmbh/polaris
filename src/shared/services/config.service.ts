import * as dotenv from "dotenv";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

dotenv.config();

export class ConfigService {
  public get(key: string): string {
    return process.env[key];
  }
  
  public getNumber(key: string): number {
    return Number(process.env[key]);
  }
  
  get numberHashRound(): number {
    return 10;
  }

  get defaultUserRoleId(): string {
    return '2';
  }

  get nodeEnv(): string {
    return this.get('NODE_ENV') || 'development';
  }
  
  get hostUrl() {
    return this.get("HOST");
  }
  
  get typeOrmConfig(): TypeOrmModuleOptions {
    let entities = [__dirname + "/../../entities/**/*.entity{.ts,.js}"];
    
    if ((module as any).hot) {
      const entityContext = (require as any).context("./../../entities", true, /\.entity\.ts$/);
      entities = entityContext.keys().map((id) => {
        const entityModule = entityContext(id);
        const [entity] = Object.values(entityModule);
        return entity;
      });
    }
  
    return {
      entities,
      keepConnectionAlive: true,
      type: 'mysql',
      host: this.get('TYPEORM_HOST'),
      port: this.getNumber('TYPEORM_PORT'),
      username: this.get('TYPEORM_USERNAME'),
      password: this.get('TYPEORM_PASSWORD'),
      database: this.get('TYPEORM_DATABASE'),
      synchronize: true,
      // logging: process.env.NODE_ENV === 'development',
      logging: false,
    };
  }
}