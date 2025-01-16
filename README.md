# Campaign Verification System

    const INPUT_CSV = './data/campaigns.csv';
    const OUTPUT_CSV = './data/reports/report_' + 
      new Date().toISOString().replace(/[:.]/g, '-') + '.csv';

    export async function runVerification() {
      try {
        console.log('Starting verification process...');
        const campaigns = await CSVProcessor.readCSV(INPUT_CSV);
        
        const results = await Promise.all(
          campaigns.map(async campaign => ({
            campaign,
            ...await CampaignVerifier.verifyCampaign(campaign)
          }))
        );

        await Reporter.generateReport(results, OUTPUT_CSV);
        console.log('Verification process completed successfully');
        return results;
      } catch (error) {
        console.error('Error during verification:', error);
        throw error;
      }
    }

    // Schedule to run every 6 hours
    if (process.env.NODE_ENV !== 'production') {
      cron.schedule('0 */6 * * *', () => {
        console.log('Running scheduled verification...');
        runVerification();
      });
    }
