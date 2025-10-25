import bcrypt from "bcryptjs";

const storedHash = "$2a$10$QFZ1n1j1Y5xCw1m5H2v4WeZ7mN0m4Zr6jO0sE3qvF0R2pH3G8x1nW";
const password = "Password@123";

const isMatch = await bcrypt.compare(password, storedHash);
console.log("Password matches hash:", isMatch);
