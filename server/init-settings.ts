import { db } from './db';
import { settings } from '@shared/schema';
import { eq } from 'drizzle-orm';

async function initSettings() {
  try {
    console.log('Initializing settings...');
    
    // Get the API key from the environment
    const apiKey = process.env.FOOTBALL_API_KEY;
    
    if (!apiKey) {
      console.log('No FOOTBALL_API_KEY found in environment variables');
      return;
    }
    
    console.log('Found FOOTBALL_API_KEY in environment, setting it in the database');
    
    // Check if the setting already exists
    const existingSetting = await db.select()
      .from(settings)
      .where(eq(settings.key, 'FOOTBALL_API_KEY'))
      .limit(1);
    
    if (existingSetting.length > 0) {
      // Update the existing setting
      await db.update(settings)
        .set({ value: apiKey })
        .where(eq(settings.key, 'FOOTBALL_API_KEY'));
      
      console.log('Updated FOOTBALL_API_KEY in settings table');
    } else {
      // Insert a new setting
      await db.insert(settings)
        .values({ key: 'FOOTBALL_API_KEY', value: apiKey });
      
      console.log('Inserted FOOTBALL_API_KEY into settings table');
    }
    
    console.log('Settings initialization complete');
  } catch (error) {
    console.error('Error initializing settings:', error);
  } finally {
    process.exit(0);
  }
}

initSettings();