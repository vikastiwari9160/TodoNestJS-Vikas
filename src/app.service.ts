import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHello(): string {
        return 'Hello! Please redirect to Swagger for using the todo app';
    }
}