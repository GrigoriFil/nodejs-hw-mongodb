import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import { sendMail } from '../utils/sendMail.js';

const createSession = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 хвилин
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 днів
  };
};

export const registerUser = async (payload) => {
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }
  return User.create(payload);
};

export const loginUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });
  if (!user || !(await user.comparePassword(payload.password))) {
    throw createHttpError(401, 'Invalid email or password');
  }

  await Session.deleteOne({ userId: user._id });

  const session = createSession(user._id);

  return Session.create({
    userId: user._id,
    ...session,
  });
};

export const refreshSession = async (refreshToken) => {
  const decodedToken = jwt.verify(refreshToken, process.env.JWT_SECRET);
  const session = await Session.findOne({
    userId: decodedToken.userId,
    refreshToken,
  });

  if (!session || new Date() > session.refreshTokenValidUntil) {
    throw createHttpError(401, 'Session not found or expired');
  }

  await Session.deleteOne({ _id: session._id });

  const newSessionData = createSession(session.userId);
  return Session.create({
    userId: session.userId,
    ...newSessionData,
  });
};

export const logoutUser = async (refreshToken) => {
  await Session.deleteOne({ refreshToken });
};

export const requestResetToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: '5m',
  });

  const resetPasswordUrl = `${process.env.APP_DOMAIN}/reset-password?token=${resetToken}`;

  await sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Reset your password',
    html: `<p>To reset your password, click on this link: <a href="${resetPasswordUrl}">${resetPasswordUrl}</a></p>`,
  });
};

export const resetPassword = async (payload) => {
  let decodedToken;
  try {
    decodedToken = jwt.verify(payload.token, process.env.JWT_SECRET);
  } catch (err) {
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  const user = await User.findOne({ email: decodedToken.email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  user.password = payload.password;
  await user.save();

  await Session.deleteMany({ userId: user._id });
};