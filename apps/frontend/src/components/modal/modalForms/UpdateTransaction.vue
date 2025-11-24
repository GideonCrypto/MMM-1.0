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
    const { getPortfolios, getMarks, getAssetsNames, assetSuggestions, userIdStore, getTransaction, getAssets, changeBlockView } = commonData
    const { marks, portfolios, libData, transactions } = storeToRefs(commonData)

    const reqData = useCommonReqStore()//store with common requests
    const { updateTransaction, deleteItem } = reqData
    // 
    const searchType = ref('name')

    async function submitForm() {
        if (!modal.validate()) {
            return
        } else {
            await updateTransaction({
                id: currentTrasnsaction.value.id,
                type: formData.value.type,
                assetId: currentTrasnsaction.value.assetId,
                date: formData.value.date,
                quantity: formData.value.quantity,
                price: formData.value.price,
                markId: formData.value.markId ? formData.value.markId.toString() : null,
                portfolioId: formData.value.portfolioId,
                source: formData.value.source ? formData.value.source : null,
                fee: formData.value.fee
            }, userIdStore)
            console.log('Submitting data', formData.value)

            await getTransaction(currentTrasnsaction.value.assetId)// update trs list
        }
        modal.close()
    }

    async function deleteTrs() {
        await deleteItem(`transactions/${currentTrasnsaction.value.id}`)// delete trs

        if (transactions.value.length === 1) {
            if (transactions.value[0].assetId === currentTrasnsaction.value.assetId) {
                await deleteItem(`assets/${currentTrasnsaction.value.assetId}`)// delete asset
                await getAssets()// update assets list
                changeBlockView()// get to assets page
            }
        }// delete asset if it last trs

        await getTransaction(currentTrasnsaction.value.assetId)// update trs list
        modal.close()
    }// delete trs and asset if trs is last

    onMounted(async () => {
        await getPortfolios()
        await getMarks()
        modal.setMarksList(marks.value)
    })
</script>

<template>
    <form @submit.prevent="submitForm">
        <h2>Update transaction</h2>

        <div class="form-row"><!-- Type/Date -->
            <div class="form-group">
                <label>Type</label>
                <select name="type" v-model="modal.formData.type" >
                    <option disabled value="">Select</option>
                    <option value="buy">buy</option>
                    <option value="sell">sell</option>
                </select>
                <small v-if="modal.errors.type">{{ modal.errors.type }}</small>
            </div>

            <div class="form-group">
                <label>Date</label>
                <input type="datetime-local" v-model="modal.formData.date" />
                <small v-if="modal.errors.date">{{ modal.errors.date }}</small>
            </div>
        </div>

        <div class="form-row"><!-- Quantity/Price/Fee -->
            <div class="form-group">
                <label>Quantity</label>
                <input type="number" v-model="modal.formData.quantity" />
                <small v-if="modal.errors.quantity">{{ modal.errors.quantity }}</small>
            </div>

            <div class="form-group">
                <label>Price</label>
                <input type="number" v-model="modal.formData.price" />
                <small v-if="modal.errors.price">{{ modal.errors.price }}</small>
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
            <button type="button" @click="deleteTrs">Delete</button>
            <button type="submit">Submit</button>
        </div>
    </form>
</template>

<style src="./modalForms.css" scoped></style>