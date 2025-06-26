import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || !(await bcrypt.compare(password, user.password)))
     return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id,  name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    return res.json({ token, user });
  } catch (err) {
    return res.status(500).json({ message: "Login error", error: err });
  }
};
