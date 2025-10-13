import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

export function loadEnvironment() {
    // Try to load root .env
    const rootEnvPath = path.resolve(process.cwd(), '.env');

    if (fs.existsSync(rootEnvPath)) {
        dotenv.config({ path: rootEnvPath });
        console.log('✅ Loaded root .env file');
    } else {
        console.warn('⚠️ Root .env file not found');
    }

    // Optionally, also load service-specific overrides
    const serviceEnvPath = path.resolve(__dirname, '../../../.env');
    if (fs.existsSync(serviceEnvPath)) {
        dotenv.config({ path: serviceEnvPath, override: false });
    }
}