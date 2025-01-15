import { CampaignVerifier } from './verification.js';
    import { CSVProcessor } from './utils/csvProcessor.js';
    import { Reporter } from './utils/reporter.js';

    const INPUT_CSV = './data/campaigns.csv';
    const OUTPUT_CSV = './data/reports/report_' + 
      new Date().toISOString().replace(/[:.]/g, '-') + '.csv';

    async function main() {
      try {
        const campaigns = await CSVProcessor.readCSV(INPUT_CSV);
        
        const results = await Promise.all(
          campaigns.map(async campaign => ({
            campaign,
            ...await CampaignVerifier.verifyCampaign(campaign)
          }))
        );

        await Reporter.generateReport(results, OUTPUT_CSV);
        console.log('Verification completed. Report saved to:', OUTPUT_CSV);
      } catch (error) {
        console.error('Error:', error);
      }
    }

    main();
