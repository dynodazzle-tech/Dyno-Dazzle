import express, { Request, Response } from 'express';
import { getAllProjects } from '../services/projectService';
import { getSiteSettings } from '../services/settingsService';

const router = express.Router();

// Public: Get all active projects for website showcase
router.get('/projects', (req: Request, res: Response) => {
  try {
    const projects = getAllProjects(false);
    res.json({ success: true, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to load projects' });
  }
});

// Public: Get site settings (banner, contact info)
router.get('/settings', (req: Request, res: Response) => {
  try {
    const settings = getSiteSettings();
    res.json({
      success: true,
      data: {
        companyName: settings.companyName,
        tagline: settings.tagline,
        email: settings.email,
        phone: settings.phone,
        whatsapp: settings.whatsapp,
        workingHours: settings.workingHours,
        announcementBanner: settings.announcementBanner,
        socialLinks: settings.socialLinks,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to load site settings' });
  }
});

export default router;
