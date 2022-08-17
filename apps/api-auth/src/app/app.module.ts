import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// https://www.codementor.io/@supertokens/how-to-hash-salt-and-verify-passwords-in-nodejs-python-golang-and-java-1sqko521bp
// https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
// import * as argon2 from "argon2";
// import * as crypto from "crypto";
//
// const hashingConfig = { // based on OWASP cheat sheet recommendation#s (as of March, 2022)
//   parallelism: 1,
//   memoryCost: 64000, // 64 mb
//   timeCost: 3 // number of iterations
// }
//
// async function hashPassword(password: string) {
//   let salt = crypto.randomBytes(16);
//   return await argon2.hash(password, {
//     ...hashingConfig,
//     salt,
//   })
// }
