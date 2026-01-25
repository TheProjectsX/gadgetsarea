import { UserJwtPayload } from "../app/middlewares/cookieAuth";

declare global {
    namespace Express {
        interface Request {
            user: UserJwtPayload;
        }
    }
}
