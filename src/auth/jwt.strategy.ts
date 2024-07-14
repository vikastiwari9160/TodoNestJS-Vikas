import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { strategy, ExtractJwt } from 'passport-jwt';
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(strategy) {
    constructor(private readonly databaseService: DatabaseService) {
        super({
            jwtFormRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: "Secret"
        })
    }

    async validation(payload: { email: string }) {
        const user = await this.databaseService.user.findUnique({
            where: {
                email: payload.email
            }
        })
        return user;
    }
}