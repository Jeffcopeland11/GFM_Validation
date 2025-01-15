import axios from 'axios';
    import { getDistance } from 'geolib';
    import { load } from 'dotenv';
    load();

    class FireData {
      static async getActiveFires() {
        try {
          const response = await axios.get(
            'https://api.fire.ca.gov/incidents'
          );
          return response.data;
        } catch (error) {
          console.error('Error fetching fire data:', error);
          return [];
        }
      }
    }

    class PeopleSearch {
      static async verifyPerson(name, address) {
        try {
          const response = await axios.get(
            `https://api.peopledatalabs.com/v5/person/enrich`,
            {
              params: {
                name: name,
                location: address,
                api_key: process.env.PEOPLE_DATA_LABS_KEY
              }
            }
          );
          return response.data;
        } catch (error) {
          console.error('Error verifying person:', error);
          return null;
        }
      }
    }

    export class CampaignVerifier {
      static async verifyCampaign(campaign) {
        const { name, address, location } = campaign;
        
        // Convert location string to coordinates if needed
        const coords = typeof location === 'string' ? 
          this.parseLocation(location) : location;

        const personData = await PeopleSearch.verifyPerson(name, address);
        if (!personData) {
          return { valid: false, reason: 'Person not found' };
        }

        const fires = await FireData.getActiveFires();
        const isInFireZone = fires.some(fire => {
          const distance = getDistance(
            { latitude: coords.lat, longitude: coords.lng },
            { latitude: fire.latitude, longitude: fire.longitude }
          );
          return distance < 5000;
        });

        if (!isInFireZone) {
          return { valid: false, reason: 'Address not in fire zone' };
        }

        return { valid: true };
      }

      static parseLocation(location) {
        const [lat, lng] = location.split(',').map(Number);
        return { lat, lng };
      }
    }
