<script setup lang="ts">
    import { onMounted, ref, computed, watch } from 'vue'
    import { useModalStore } from '../../../store/useModalStore'
    import { useCommonDataStore } from '../../../store/commonDataStore'
    import { useCommonReqStore } from '../../../store/useCommonReqStore'
    import { storeToRefs } from 'pinia'
    import axios from 'axios'

    // store
    const modal = useModalStore() // store for modal control and validation
    const { isOpen, formData, currentTrasnsaction } = storeToRefs(modal)
    const { close } = modal

    const commonData = useCommonDataStore() // store with common used data
    const { getPortfolios, getMarks, userIdStore, getTransaction, getAssets, getStaking } = commonData
    const { marks, portfolios, libData, transactions, staking } = storeToRefs(commonData)

    const reqData = useCommonReqStore()//store with common requests
    const { updateStaking, deleteItem } = reqData
    // 

    async function submitForm() {
        if (!modal.validate()) {
            return
        } else {
            await updateStaking({
                id: currentTrasnsaction.value.id,
                assetId: currentTrasnsaction.value.assetId,
                date: formData.value.date, 
                value: formData.value.value,
                reward: formData.value.reward,
                rewardSold: currentTrasnsaction.value.rewardSold,
                assetToReceive: currentTrasnsaction.value.coinToReceive,
                markId: formData.value.markId.length > 0 ? formData.value.markId.toString() : null,
            }, userIdStore)

            console.log('Submitting data', formData.value)

            await getStaking()// update staking list
            await getTransaction(currentTrasnsaction.value.assetId)// update trs list
        }
        modal.close()
    }

    async function deleteStaking() {
        const assetId = await getTransaction(currentTrasnsaction.value.assetId)
        if (transactions.value.length < 1) {
            await deleteItem(`assets/${currentTrasnsaction.value.assetId}`)// delete asset
        }// check for staked asset

        const assetIdReward = await getTransaction(currentTrasnsaction.value.coinToReceive)
        if (transactions.value.length < 1) {
            await deleteItem(`assets/${currentTrasnsaction.value.assetId}`)// delete asset
        }// check for reward asset
        
        await deleteItem(`staking/${currentTrasnsaction.value.id}`)// delete staking
        
        await getAssets()// update asset list
        await getStaking()// update staking list
        modal.close()
    }// delete staking and asset if it has no trs

    onMounted(async () => {
        await getPortfolios()
        await getMarks()
        modal.setMarksList(marks.value)
    })
</script>

<template>
    <form @submit.prevent="submitForm">
        <h2>Update staking</h2>

        <div class="form-row"><!-- Date -->
            <div class="form-group">
                <label>Date</label>
                <input type="datetime-local" v-model="modal.formData.date" />
                <small v-if="modal.errors.date">{{ modal.errors.date }}</small>
            </div>
        </div>

        <div class="form-row"><!-- Value/Reward -->
            <div class="form-group">
                <label>Value</label>
                <input type="number" v-model="modal.formData.value" />
                <small v-if="modal.errors.value">{{ modal.errors.value }}</small>
            </div>

            <div class="form-group">
                <label>Reward</label>
                <input type="number" v-model="modal.formData.reward" />
                <small v-if="modal.errors.reward">{{ modal.errors.reward }}</small>
            </div>
        </div>

        <div class="form-row"><!-- Marks -->
            <div class="form-group">
                <label>Marks</label>
                <select v-model="modal.currentMarkId" @change="modal.addMark">
                    <option disabled value="">Select</option>
                    <option v-for="m in modal.availableMarks" :key="m.id" :value="m.id"> {{ m.name }} </option>
                </select>
                <div class="selected-marks">
                    <span v-for="mark in modal.selectedMarks" :key="mark.id" class="selected-mark" @click="modal.removeMark(mark)"> {{ mark.name }} ✕ </span>
                </div>
            </div>
        </div>

        <div class="buttons">
            <button type="button" @click="modal.close">Close</button>
            <button type="button" @click="deleteStaking">Delete</button>
            <button type="submit">Submit</button>
        </div>
    </form>
</template>

<style src="./modalForms.css" scoped></style>