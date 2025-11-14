import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCommonDataStore = defineStore('useCommonDataStore', () => {
    const marks = ref([])// current marks from db
    const portfolios = ref([])// current portfolios from db
    const assetSuggestions = ref<any[]>([])// asset suggestions for search asset
    const libData = ref<any[]>([])// current lib data about asset from db
    const userIdStore = "08ffce73-4e68-4c90-8e09-c77722dc6c80"// current user id

    async function getMarks() {
        const response = await axios.post(`http://localhost:3005/marks/getMarks`,
            {
                userId: userIdStore
            }
        )

        marks.value = response.data
    }// get current marks data by user

    async function getPortfolios() {
        const response = await axios.post(`http://localhost:3005/portfolio/getPortfolios`,
            {
                userId: userIdStore
            }
        )

        portfolios.value = response.data
    }// get current portfolio data by user

    async function getAssetsNames(type: string, value: string) {
        if (!value || value.length < 2) {
            assetSuggestions.value = [];
            return;
        }

        try {
            let url = '';

            if (type === 'name') {
                url = `http://localhost:3005/library/libraryByName/${encodeURIComponent(value)}`;
            } else if (type === 'geckoId') {
                url = `http://localhost:3005/library/libraryByGeckoId/${encodeURIComponent(value)}`;
            } else {
                throw new Error('Invalid type');
            }

            const response = await axios.get(url);
            const data = response.data;

            assetSuggestions.value = Array.isArray(data) ? data : (data ? [data] : []);

            libData.value = []
            libData.value = assetSuggestions.value
        } catch (err: any) {
            if (err?.response) {
                console.error('[getAssetsNames] err.response.status:', err.response.status);
                console.error('[getAssetsNames] err.response.data:', err.response.data);
            } else if (err?.request) {
                console.error('[getAssetsNames] err.request (no response):', err.request);
            } else {
                console.error('[getAssetsNames] unknown error:', err);
            }
            assetSuggestions.value = [];
        }
    }// get asset for suggestion and creation

    return {
        // vars
        marks,
        portfolios,
        assetSuggestions,
        libData,
        userIdStore,
        // funcs
        getPortfolios,
        getMarks,
        getAssetsNames,
    }
})