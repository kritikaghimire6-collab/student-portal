import bcrypt from "bcryptjs";

const hash = await bcrypt.hash("Password@123", 10);
console.log(hash);

// To verify:
const isMatch = await bcrypt.compare("Password@123", hash);
console.log("Verification:", isMatch);
