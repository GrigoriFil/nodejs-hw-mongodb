import Joi from 'joi';

export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const refreshSession = async (refreshToken) => {
  const session = await Session.findOne({ refreshToken });
  if (!session || new Date() > session.refreshTokenValidUntil) {
    throw createHttpError(401, 'Session not found or expired');
  }

  await Session.deleteOne({ _id: session._id });

  const newSessionData = createSession();
  return Session.create({
    userId: session.userId,
    ...newSessionData,
  });
};