import bcrypt from "bcryptjs";

const storedHash = "$2a$10$FzctZMAh9MhgMS26pja7v.jlg5VcPmeTY9qyNbwlQ9xuvtcUtbnPi";
const newHash = "$2a$10$LsEIr0Tx1Qxv8TRKuAIvz.Flruwrd1ZTcDAHHt.bi69wYkV5DoOFq";
const password = "Password@123";

const isMatch = await bcrypt.compare(password, storedHash);
console.log("Password matches hash:", isMatch);

const isMatchNew = await bcrypt.compare(password, newHash);
console.log("Password matches new hash:", isMatchNew);
