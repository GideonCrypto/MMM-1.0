import axios from 'axios'
import { defineStore } from 'pinia'

export const useCommonReqStore = defineStore('useCommonReqStore', () => {
    // ------------------------------------------------------------------
    // this store used for post and delete requests
    // ------------------------------------------------------------------
    // -------------------------------------------- vars
    const url = 'http://localhost:3005/'
    // --------------------------------------------
    // -------------------------------------------- api req
    async function createAsset(assetData: {name: string, symbol: string, geckoId: string, date: number}, userIdStore: string) {
        const response = await axios.post(`${url}assets/createAsset`,
            {
                userId: userIdStore,
                name: assetData.name,
                symbol: assetData.symbol,
                marketId: assetData.geckoId,
                price: 100,
                timestamp: assetData.date,
            }
        )

        return response.data
    }

    async function createTransaction(assetData: {
            type: string, 
            assetId: string,
            date: number, 
            quantity: number,
            price: number,
            markId: string,
            portfolioId: string,
            source: string,
            fee: number
        }, userIdStore: string) {
        const response = await axios.post(`${url}transactions/createTransaction`,
            {
                userId: userIdStore,
                type: assetData.type,
                assetId: assetData.assetId,
                timestamp: assetData.date,
                quantity: assetData.quantity,
                price: assetData.price,
                marks: assetData.markId,
                notes: null,
                portfolio: assetData.portfolioId,
                source: "spot",
                fee: assetData.fee
            }
        )
        
        return response.data
    }

    async function updateTransaction(assetData: {
            id: string, 
            type: string, 
            assetId: string,
            date: number, 
            quantity: number,
            price: number,
            markId: string,
            portfolioId: string,
            source: string,
            fee: number
        }, userIdStore: string) {
        const response = await axios.patch(`${url}transactions/updateTransaction`,
            {
                id: assetData.id,
                userId: userIdStore,
                type: assetData.type,
                assetId: assetData.assetId,
                timestamp: assetData.date,
                quantity: assetData.quantity,
                price: assetData.price,
                marks: assetData.markId,
                notes: null,
                portfolio: assetData.portfolioId,
                source: "spot",
                fee: assetData.fee
            }
        )
        
        return response.data
    }
    // --------------------------------------------
    // -------------------------------------------- unified del req
    async function deleteItem(route: string) {
        await axios.delete(`${url + route}`)
    }//delete by id + adress

    return {
        createAsset,
        createTransaction,
        updateTransaction,
        deleteItem,
    }
})