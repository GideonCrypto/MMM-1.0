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
    const { getPortfolios, getMarks, userIdStore, getTransaction, getStaking } = commonData
    const { marks, portfolios, libData, transactions, drops } = storeToRefs(commonData)

    const reqData = useCommonReqStore()//store with common requests
    const { updateStaking, sellStakingReward } = reqData
    // 

    async function submitForm() {
        if (!modal.validate()) {
            return
        } else {            
            await sellStakingReward({
                type: 'sell',
                assetId: currentTrasnsaction.value.coinToReceive,
                date: formData.value.date,
                quantity: +formData.value.value,
                price: formData.value.price,
                markId: formData.value.markId.length > 0 ? formData.value.markId.toString() : null,
                portfolioId: formData.value.portfolioId,
                source: "staking",
                fee: formData.value.fee >= 0 && Number(formData.value.fee) ? formData.value.fee : 0
            }, userIdStore)

            await updateStaking({
                id: currentTrasnsaction.value.id,
                assetId: currentTrasnsaction.value.assetId,
                date: formData.value.date, 
                value: currentTrasnsaction.value.value,
                reward: currentTrasnsaction.value.reward,
                rewardSold: currentTrasnsaction.value.rewardSold + formData.value.value,
                assetToReceive: currentTrasnsaction.value.coinToReceive,
                markId: formData.value.markId.length > 0 ? formData.value.markId.toString() : null,
            }, userIdStore)

            console.log('Submitting data', formData.value)

            await getStaking()// update staking list
            await getTransaction(currentTrasnsaction.value.assetId)// update trs list
        }
        modal.close()
    }



    onMounted(async () => {
        await getPortfolios()
        await getMarks()
        modal.setMarksList(marks.value)
    })
</script>

<template>
    <form @submit.prevent="submitForm">
        <h2>Sell staking reward</h2>

        <div class="form-row"><!-- Date -->
            <div class="form-group">
                <label>Date</label>
                <input type="datetime-local" v-model="modal.formData.date" />
                <small v-if="modal.errors.date">{{ modal.errors.date }}</small>
            </div>
        </div>

        <div class="form-row"><!-- Price/Value/Fee -->
            <div class="form-group">
                <label>Price</label>
                <input type="number" v-model="modal.formData.price" />
                <small v-if="modal.errors.price">{{ modal.errors.price }}</small>
            </div>

            <div class="form-group">
                <label>Value</label>
                <input type="number" v-model="modal.formData.value" />
                <small v-if="modal.errors.price">{{ modal.errors.value }}</small>
            </div>

            <div class="form-group">
                <label>Fee</label>
                <input type="number" v-model="modal.formData.fee" />
                <small v-if="modal.errors.fee">{{ modal.errors.fee }}</small>
            </div>
        </div>

        <div class="form-row"><!-- Marks/Portfolio -->
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

            <div class="form-group">
                <label>Portfolio</label>
                <select v-model="modal.formData.portfolioId" name="portfolios">
                    <option disabled value="">Select</option>
                    <option v-for="item in portfolios" :key="item.id" :value="item.id"> {{ item.name }} </option>
                </select>
                <small v-if="modal.errors.portfolioId">{{ modal.errors.portfolioId }}</small>
            </div>
        </div>

        <div class="buttons">
            <button type="button" @click="modal.close">Close</button>
            <button type="submit">Submit</button>
        </div>
    </form>
</template>

<style src="./modalForms.css" scoped></style>