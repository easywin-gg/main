import fs from 'fs';
import DDragonAPI from '../api/DDragonAPI';
import { downloadUnitData, transformUnitDataToJson } from '../utils/unitDataUtils';

class CDN {

    public static readonly MAIN_FOLDER_PATH = `${process.env.APPDATA}/rank1`;

    async start() {
        if (!fs.existsSync(CDN.MAIN_FOLDER_PATH)) {
            console.log(`[CDN] Creating main folder...`);
            fs.mkdirSync(CDN.MAIN_FOLDER_PATH);
            fs.writeFileSync(`${CDN.MAIN_FOLDER_PATH}/version.txt`, '0.0.0', {
                encoding: 'utf-8',
                flag: 'w'
            });
        }

        console.log(`[CDN] Checking for updates...`);
        const latestVersion = await DDragonAPI.getLatestVersion();
        const cachedVersion = fs.readFileSync(`${CDN.MAIN_FOLDER_PATH}/version.txt`, {
            encoding: 'utf-8'
        });

        if (latestVersion !== cachedVersion) {
            console.log(`[CDN] Updating...`);
            await this.downloadAndTransformUnitData();

            fs.writeFileSync(`${CDN.MAIN_FOLDER_PATH}/version.txt`, latestVersion, {
                encoding: 'utf-8',
                flag: 'w'
            });

            console.log(`[CDN] Updated to version ${latestVersion}`);
        } else {
            console.log(`[CDN] No updates available`);
        }
    }

    private async downloadAndTransformUnitData() {
        console.log(`[CDN] Downloading unit data...`);
        const units = await DDragonAPI.getUnitDataList()
            .then((page)=> page.split('\n') 
            .filter((x: string) => x.includes('<a href="'))
            .map((x: string) => x.split('title="')[1]?.split('"')[0].trim())
            .filter(Boolean));

        await downloadUnitData(units);
        await transformUnitDataToJson();
    }
}

export default CDN;