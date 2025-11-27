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
    // assets
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
    // transactions
    async function createTransaction(assetData: {
            type: string, 
            assetId: string,
            date: number, 
            quantity: number,
            price: number,
            markId: string | null,
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
                source: assetData.source ? assetData.source : "spot",
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
    // drops
    async function createDrop(dropData: {
            assetId: string,
            date: number, 
            value: number,
            price: number,
            markId: string,
            transaction: string,
        }, userIdStore: string) {
        const response = await axios.post(`${url}drops/createDrop`,
            {
                userId: userIdStore,
                assetId: dropData.assetId,
                timestamp: dropData.date,
                value: dropData.value,
                price: dropData.price,
                sold: 0,
                marks: dropData.markId,
                notes: null,
                fee: null,
                transactions: dropData.transaction
            }
        )
        
        return response.data
    }

    async function updateDrop(dropData: {
            id: string,
            date: number, 
            value: number,
            price: number,
            markId: string,
            transaction: string,
            sold?: number,
            fee?: number,
        }, userIdStore: string) {
        const response = await axios.patch(`${url}drops/updateDrop`,
            {
                id: dropData.id,
                userId: userIdStore,
                timestamp: dropData.date,
                value: dropData.value,
                price: dropData.price,
                sold: dropData.sold ? dropData.sold : 0,
                marks: dropData.markId,
                notes: null,
                fee: dropData.fee ? dropData.fee : 0,
                transactions: dropData.transaction
            }
        )
        
        return response.data
    }
    // --------------------------------------------
    // -------------------------------------------- unified req
    async function deleteItem(route: string) {
        await axios.delete(`${url + route}`)
    }//delete item from db by id + adress
    // --------------------------------------------
    return {
        // assets
        createAsset,
        //  transactions
        createTransaction,
        updateTransaction,
        //drops
        createDrop,
        updateDrop,
        // unified req
        deleteItem,
    }
})