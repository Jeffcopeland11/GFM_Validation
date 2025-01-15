import fs from 'fs';
    import csv from 'csv-parser';

    export class CSVProcessor {
      static async readCSV(filePath) {
        return new Promise((resolve, reject) => {
          const results = [];
          fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
        });
      }

      static async writeCSV(filePath, data) {
        const header = Object.keys(data[0]).join(',');
        const rows = data.map(obj => 
          Object.values(obj).map(value => 
            `"${value.toString().replace(/"/g, '""')}"`
          ).join(',')
        ).join('\n');

        return fs.promises.writeFile(filePath, `${header}\n${rows}`);
      }
    }
