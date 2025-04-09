import { Request, Response } from 'express';
import { storage } from '../storage';

// Constants for settings keys
export const FOOTBALL_API_KEY = 'FOOTBALL_API_KEY';

// Get a specific setting value
export async function getSetting(req: Request, res: Response) {
  try {
    const { key } = req.params;
    if (!key) {
      return res.status(400).json({ error: 'Key parameter is required' });
    }
    
    const value = await storage.getSetting(key);
    return res.status(200).json({ key, value });
  } catch (error) {
    console.error('Error getting setting:', error);
    return res.status(500).json({ error: 'Failed to retrieve setting' });
  }
}

// Update a setting value
export async function updateSetting(req: Request, res: Response) {
  try {
    const { key } = req.params;
    const { value } = req.body;
    
    if (!key) {
      return res.status(400).json({ error: 'Key parameter is required' });
    }
    
    if (value === undefined) {
      return res.status(400).json({ error: 'Value is required in request body' });
    }
    
    await storage.setSetting(key, value);
    return res.status(200).json({ key, value, message: 'Setting updated successfully' });
  } catch (error) {
    console.error('Error updating setting:', error);
    return res.status(500).json({ error: 'Failed to update setting' });
  }
}

// Get all settings (for admin use)
export async function getAllSettings(req: Request, res: Response) {
  try {
    // In an actual implementation, you would add a method to retrieve all settings
    // For now, we'll just get the API key
    const apiKey = await storage.getSetting(FOOTBALL_API_KEY);
    
    return res.status(200).json({
      [FOOTBALL_API_KEY]: apiKey
    });
  } catch (error) {
    console.error('Error getting all settings:', error);
    return res.status(500).json({ error: 'Failed to retrieve settings' });
  }
}