import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { RAResponse } from "../../utils/RAresponse";
import RAError from "../../utils/RAerror";
import { User } from "../../types/user";
import { addDays } from "date-fns";
import Logger from "../../utils/logger";

const prisma = new PrismaClient();

export async function createNewUser(req: RATypes.Request): Promise<RAResponse> {
  const { email, name, dob, password } = req.body;
  try {
    const { exist, error } = await isEmailExists(email);

    if (error) {
      throw new RAError(500, "Something went wrong!");
    }
    if (exist) {
      throw new RAError(409, "Email exists");
    }

    const salt = await bcrypt.genSalt(Number(process.env.AUTH_PASSWORD_SALT));
    const hashedPassword = await bcrypt.hash(password, salt);

    await prisma.tbl_users.create({
      data: {
        email: email,
        name: name,
        dob: dob,
        sys_role: "USER", // defaults to USER role
        updated_at: new Date().toISOString(),
        tbl_auth: {
          create: [{ password: hashedPassword }],
        },
      },
    });

    return new RAResponse("user created");
  } catch (error) {
    Logger.error(error);
    throw error;
  }
}

export async function login(req: RATypes.Request, res): Promise<RAResponse> {
  const { email, password } = req.body;
  try {
    const user = await prisma.tbl_users.findUnique({
      where: {
        email,
      },
      include: {
        tbl_auth: {
          select: {
            password: true,
          },
          take: 1,
        },
      },
    });
    if (!user) throw new RAError(401, "Invalid email or password");

    const verifiedPassword = await bcrypt.compare(
      password,
      user.tbl_auth[0].password
    );
    if (!verifiedPassword) throw new RAError(401, "Invalid email or password");

    const { access_token, refresh_token } = await generateToken(user);

    res.cookie("token", refresh_token, {
      httpOnly: true,
      sameSite: "Strict",
      secure: true,
      maxAge: 604800000,
    });

    return new RAResponse("Success", { access_token: access_token }, 200);
  } catch (error) {
    Logger.error(error);
    throw error;
  }
}

export async function isEmailExists(
  email: string
): Promise<{ exist: boolean; error: boolean }> {
  try {
    const user = await prisma.tbl_users.findUnique({
      where: {
        email: email,
      },
    });
    if (user) {
      return { exist: true, error: false };
    }
    return { exist: false, error: false };
  } catch {
    return { exist: false, error: true };
  }
}

export async function generateToken(
  user: User
): Promise<{ access_token: string; refresh_token: string }> {
  try {
    const payload = { _id: user.id, email: user.email, role: user.sys_role };

    const _accessToken = jwt.sign(
      payload,
      String(process.env.AUTH_ACCESS_TOKEN_PRIVATE_KEY),
      { expiresIn: "14m" }
    );
    const _refreshToken = jwt.sign(
      payload,
      String(process.env.AUTH_REFRESH_TOKEN_PRIVATE_KEY),
      { expiresIn: "30d" }
    );

    const updatedRefreshToken = await prisma.tbl_auth.updateMany({
      where: {
        user_id: user.id,
      },
      data: {
        refresh_token: _refreshToken,
        expiry_at: addDays(new Date(), 30),
      },
    });
    if (updatedRefreshToken) {
      return { access_token: _accessToken, refresh_token: _refreshToken };
    }
    throw new RAError(500, "Something went wrong!");
  } catch (error) {
    Logger.error(error);
    throw error;
  }
}
