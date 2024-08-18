import * as bcrypt from 'bcrypt';

function encryptPwd(password: string): string {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

function comparePwd(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export { encryptPwd, comparePwd };
