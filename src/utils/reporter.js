import fs from 'fs';
    import { CSVProcessor } from './csvProcessor.js';

    export class Reporter {
      static async generateReport(results, outputPath) {
        const report = results.map(result => ({
          campaignId: result.campaign.id,
          organizer: result.campaign.name,
          status: result.valid ? 'Valid' : 'Invalid',
          reason: result.reason || '',
          timestamp: new Date().toISOString()
        }));

        await CSVProcessor.writeCSV(outputPath, report);
        console.log(`Report generated at ${outputPath}`);
      }
    }
