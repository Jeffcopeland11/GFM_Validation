export class WordPressIntegration {
    static async postResults(results) {
      const wpUrl = process.env.WORDPRESS_URL;
      const wpToken = process.env.WORDPRESS_TOKEN;

      if (!wpUrl || !wpToken) {
        console.log('WordPress integration not configured');
        return;
      }

      try {
        const response = await fetch(`${wpUrl}/wp-json/wp/v2/posts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${wpToken}`
          },
          body: JSON.stringify({
            title: 'Verification Results',
            content: JSON.stringify(results, null, 2),
            status: 'publish'
          })
        });

        if (!response.ok) {
          throw new Error('WordPress API error');
        }

        console.log('Results posted to WordPress successfully');
      } catch (error) {
        console.error('Error posting to WordPress:', error);
      }
    }
  }
