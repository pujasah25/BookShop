import bcrypt from "bcrypt";
// while register
export const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (err, salt) => { // hashed the password, 12 is the strength
      if (err) {
        reject(err);
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  });
};
// while login
export const comparePassword = (password, hashed) => {
  return bcrypt.compare(password, hashed);
};

