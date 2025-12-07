<script setup lang="ts">
    import { useModalStore } from '../../../store/useModalStore'
    import { useCommonDataStore } from '../../../store/commonDataStore'
    import { useCommonReqStore } from '../../../store/useCommonReqStore'
    import { storeToRefs } from 'pinia'
    import axios from 'axios'

    // store
    const modal = useModalStore()//store for modal control and validation
    const { isOpen, formData, currentTrasnsaction } = storeToRefs(modal)
    const { close } = modal

    const commonData = useCommonDataStore()//store with common used data
    const { userIdStore, getAssets, getSwaps, getTransaction } = commonData
    const { assets, transactions } = storeToRefs(commonData)

    const reqData = useCommonReqStore()//store with common requests
    const { updateSwap, deleteItem } = reqData
    // 

    async function submitForm() {
        if (!modal.validate()) {// check valid data in form
            return
        } else {
            await getAssets()

            await updateSwap({
                id: currentTrasnsaction.value.id,
                assetIdChange: currentTrasnsaction.value.assetIdChange,
                assetIdReceive: currentTrasnsaction.value.assetIdReceive,
                fee: formData.value.fee,
                changeAmount: formData.value.changeAmount,
                receiveAmount: formData.value.receiveAmount,
                priceChange: formData.value.priceChange,
                priceReceive: formData.value.priceReceive,
                timestamp: formData.value.date,
                sellTransactionId: currentTrasnsaction.value.sellTransactionId,
                buyTransactionId: currentTrasnsaction.value.buyTransactionId
            }, userIdStore);
        }

        await getSwaps()

        modal.close()
    }

    async function deleteSwap() {
        await deleteItem(`swaps/${currentTrasnsaction.value.id}`)// delete swap and trs on backend

        const assetId = await getTransaction(currentTrasnsaction.value.assetIdChange)
        if (transactions.value.length < 1) {
            await deleteItem(`assets/${currentTrasnsaction.value.assetIdChange}`)// delete asset
        }// check for asset to change

        const assetIdReward = await getTransaction(currentTrasnsaction.value.assetIdReceive)
        if (transactions.value.length < 1) {
            await deleteItem(`assets/${currentTrasnsaction.value.assetIdReceive}`)// delete asset
        }// check for asset to receive
        
        await getAssets()// update asset list
        await getSwaps()// update swaps list
        modal.close()
    }// delete swap and asset if it has no trs
</script>

<template>
    <form @submit.prevent="submitForm">
        <h2>Update swap</h2>

        <div class="form-row"><!-- Date -->
            <div class="form-group">
                <label>Date</label>
                <input type="datetime-local" v-model="modal.formData.date" />
                <small v-if="modal.errors.date">{{ modal.errors.date }}</small>
            </div>
        </div>

        <div class="form-row"><!-- Quantity/Price (change) -->
            <div class="form-group">
                <label>Change amount</label>
                <input type="number" v-model="modal.formData.changeAmount" />
                <small v-if="modal.errors.changeAmount">{{ modal.errors.changeAmount }}</small>
            </div>

            <div class="form-group">
                <label>Price</label>
                <input type="number" v-model="modal.formData.priceChange" />
                <small v-if="modal.errors.priceChange">{{ modal.errors.priceChange }}</small>
            </div>
        </div>

        <div class="form-row"><!-- Quantity/Price/ (receive)) -->
            <div class="form-group">
                <label>Receive amount</label>
                <input type="number" v-model="modal.formData.receiveAmount" />
                <small v-if="modal.errors.receiveAmount">{{ modal.errors.receiveAmount }}</small>
            </div>

            <div class="form-group">
                <label>Price</label>
                <input type="number" v-model="modal.formData.priceReceive" />
                <small v-if="modal.errors.priceReceive">{{ modal.errors.priceReceive }}</small>
            </div>
        </div>

        <div class="form-row"><!-- Fee -->
            <div class="form-group">
                <label>Fee</label>
                <input type="number" v-model="modal.formData.fee" />
                <small v-if="modal.errors.fee">{{ modal.errors.fee }}</small>
            </div>
        </div>
        
        <div class="buttons">
            <button type="button" @click="modal.close">Close</button>
            <button type="button" @click="deleteSwap">Delete</button>
            <button type="submit">Submit</button>
        </div>
    </form>
</template>

<style src="./modalForms.css" scoped></style>