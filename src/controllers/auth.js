import createHttpError from 'http-errors';
import {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
} from '../services/auth.js';
import { requestResetToken } from '../services/auth.js';
import { resetPassword } from '../services/auth.js';

export const registerController = async (req, res) => {
  const user = await registerUser(req.body);

  const responseData = user.toObject();
  delete responseData.password;

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: responseData,
  });
};

export const loginController = async (req, res) => {
  const session = await loginUser(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken: session.accessToken },
  });
};

export const refreshController = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    throw createHttpError(401, 'Refresh token is required');
  }

  const newSession = await refreshSession(refreshToken);

  res.cookie('refreshToken', newSession.refreshToken, {
    httpOnly: true,
    expires: newSession.refreshTokenValidUntil,
  });

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken: newSession.accessToken },
  });
};

export const logoutController = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (refreshToken) {
    await logoutUser(refreshToken);
  }
  res.clearCookie('refreshToken');
  res.status(204).send();
};

export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);

  res.json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);

  res.json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};