import axios, { AxiosInstance } from "axios";

class DDragonAPI {

    public static async getLatestVersion() {
        return await axios.get(`https://ddragon.leagueoflegends.com/api/versions.json`)
            .then((response) => response.data[0])
    }

    public static async getUnitDataList() {
        return await axios.get(`https://raw.communitydragon.org/latest/game/data/characters/`)
            .then((response) => response.data)
    }

    public static async getUnitData(
        { unitName }: { unitName: string }
    ) {
        return await axios.get(`https://raw.communitydragon.org/latest/game/data/characters/${unitName}/${unitName}.bin.json`)
            .then((response) => response.data)
    }

}

export default DDragonAPI;