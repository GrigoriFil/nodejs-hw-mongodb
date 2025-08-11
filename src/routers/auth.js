import { Router } from 'express';
import {
  registerController,
  loginController,
  refreshController,
  logoutController,
} from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  registerUserSchema,
  loginUserSchema,
} from '../validation/auth.js';
import { requestResetEmailController } from '../controllers/auth.js';
import { requestResetEmailSchema } from '../validation/auth.js';
import { resetPasswordController } from '../controllers/auth.js';
import { resetPasswordSchema } from '../validation/auth.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerController),
);

router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginController),
);

router.post('/refresh', ctrlWrapper(refreshController));

router.post('/logout', ctrlWrapper(logoutController));

router.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

export default router;