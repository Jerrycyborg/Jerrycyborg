import { Router } from 'express';
import familyRoutes from './parent';
import childRoutes from './child';
import caregiverRoutes from './caregiver';
import adminRoutes from './admin';
import webhookRoutes from './webhooks';
import paymentsRoutes from './payments';

export const router = Router();

router.use('/', familyRoutes);
router.use('/', childRoutes);
router.use('/', caregiverRoutes);
router.use('/admin', adminRoutes);
router.use('/', paymentsRoutes);
router.use('/', webhookRoutes);
