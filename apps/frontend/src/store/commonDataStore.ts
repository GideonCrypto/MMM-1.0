import axios from 'axios'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useCommonDataStore = defineStore('useCommonDataStore', () => {
    // ------------------------------------------------------------------
    // this store used for geting and transform common data from db
    // ------------------------------------------------------------------
    const viewBlock = ref(false)
    const marks = ref([])// current marks from db
    const portfolios = ref([])// current portfolios from db
    const assets = ref([])// current assets from db by userId
    const drops = ref([])// current drops from db by userId
    const staking = ref([])// current drops from db by userId
    const swaps = ref([])// current swaps from db by userId
    const transactions = ref([])// current asset transactions from db by userId ans assetId
    const assetSuggestions = ref<any[]>([])// asset suggestions for search asset
    const doubleSuggestion = ref(false)// toggler for asset suggestion
    const assetSuggestionsStaking = ref<any[]>([])// asset suggestions for search asset staking reward
    const libData = ref<any[]>([])// current lib data about asset from db
    const libDataSecond = ref<any[]>([])// second current lib data about asset from db for staking and swaps
    const userIdStore = "08ffce73-4e68-4c90-8e09-c77722dc6c80"// current user id
    // -------------------------------------------- api req
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

            if (doubleSuggestion.value) {
                assetSuggestionsStaking.value = Array.isArray(data) ? data : (data ? [data] : []);
            } else {
                assetSuggestions.value = Array.isArray(data) ? data : (data ? [data] : []);
            }

            if (doubleSuggestion.value) {
                libDataSecond.value = assetSuggestionsStaking.value
            } else {
                libData.value = assetSuggestions.value
            }
        } catch (err: any) {
            if (err?.response) {
                console.error('[getAssetsNames] err.response.status:', err.response.status);
                console.error('[getAssetsNames] err.response.data:', err.response.data);
            } else if (err?.request) {
                console.error('[getAssetsNames] err.request (no response):', err.request);
            } else {
                console.error('[getAssetsNames] unknown error:', err);
            }

            assetSuggestionsStaking.value = [];
            assetSuggestions.value = [];
        }
    }// get asset for suggestion and creation

    async function getAssets() {
        const response = await axios.post(`http://localhost:3005/assets/getAssets`,
            {
                userId: userIdStore
            }
        )

        assets.value = response.data
    }// get current assets by user

    async function getTransaction(assetId: string) {
        const response = await axios.post(`http://localhost:3005/transactions/getTransactions`,
            {
                userId: userIdStore,
                assetId: assetId
            }
        )
        transactions.value = response.data
    }// get current assets by user

    async function getDrops() {
        const response = await axios.get(`http://localhost:3005/drops/dropUser/${userIdStore}`)
        drops.value = response.data
    }// get current drops by user

    async function getStaking() {
        const response = await axios.get(`http://localhost:3005/staking/stakingUser/${userIdStore}`)
        staking.value = response.data
    }// get current staking by user

    async function getSwaps() {
        const response = await axios.post(`http://localhost:3005/swaps/getSwaps/`,
            {
                userId: userIdStore
            }
        )

        swaps.value = response.data
    }// get current swaps by user

    // --------------------------------------------
    // -------------------------------------------- dictionary
    function useDict(listRef: any, idField = 'id', valueField = 'name') {
        return computed(() =>
            Object.fromEntries(
                listRef.value.map(item => [item[idField], item[valueField]])
            )
        )
    }// dictionary for names

    const dictPortfolios = useDict(portfolios, 'id', 'name')//create dictionary for portfolio
    const dictMarks = useDict(marks, 'id', 'name')//create dictionary for marks
    const dictAssets = useDict(assets, 'id', 'name')//create dictionary for assets
    // --------------------------------------------
    // -------------------------------------------- togglers
    function changeBlockView() {
        viewBlock.value = !viewBlock.value
    }// change view from asset to trs
    return {
        // vars
        marks,
        portfolios,
        assetSuggestions,
        assetSuggestionsStaking,
        doubleSuggestion,
        libData,
        libDataSecond,
        userIdStore,
        assets,
        drops,
        staking,
        swaps,
        transactions,
        dictPortfolios,
        dictMarks,
        dictAssets,
        viewBlock,
        // funcs
        getPortfolios,
        getMarks,
        getAssetsNames,
        getAssets,
        getTransaction,
        changeBlockView,
        getDrops,
        getStaking,
        getSwaps,
    }
})