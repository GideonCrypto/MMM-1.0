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
    const { getPortfolios, getMarks, assetSuggestions, userIdStore, getDrops } = commonData
    const { marks, portfolios, libData, transactions } = storeToRefs(commonData)

    const reqData = useCommonReqStore()//store with common requests
    const { updateDrop } = reqData
    //
    async function submitForm() {
        if (!modal.validate()) {
            return
        } else {
            await updateDrop({
                id: currentTrasnsaction.value.id,
                date: formData.value.date,
                value: formData.value.value,
                price: formData.value.price,
                markId: formData.value.markId.length > 0 ? formData.value.markId.toString() : null,
                transaction: currentTrasnsaction.value.transactions,
            }, userIdStore)
            console.log('Submitting data', formData.value)

            await getDrops()// update drops list
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
        <h2>Update drop</h2>

        <div class="form-row"><!-- Date -->
            <div class="form-group">
                <label>Date</label>
                <input type="datetime-local" v-model="modal.formData.date" />
                <small v-if="modal.errors.date">{{ modal.errors.date }}</small>
            </div>
        </div>

        <div class="form-row"><!-- Value/Price -->
            <div class="form-group">
                <label>Price</label>
                <input type="number" v-model="modal.formData.price" step="0.000000000001"/>
                <small v-if="modal.errors.price">{{ modal.errors.price }}</small>
            </div>

            <div class="form-group">
                <label>Value</label>
                <input type="number" v-model="modal.formData.value" step="0.000000000001"/>
                <small v-if="modal.errors.value">{{ modal.errors.value }}</small>
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
            <button type="submit">Submit</button>
        </div>
    </form>
</template>

<style src="./modalForms.css" scoped></style>