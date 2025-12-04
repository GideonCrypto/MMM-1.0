<script setup lang="ts">
    import { onMounted, ref, watch } from 'vue'
    import { useModalStore } from '../../../store/useModalStore'
    import { useCommonDataStore } from '../../../store/commonDataStore'
    import { useCommonReqStore } from '../../../store/useCommonReqStore'
    import { storeToRefs } from 'pinia'
    import axios from 'axios'

    // store
    const modal = useModalStore()//store for modal control and validation
    const { isOpen, formData } = storeToRefs(modal)
    const { close } = modal

    const commonData = useCommonDataStore()//store with common used data
    const { getPortfolios, getMarks, getAssetsNames, assetSuggestions, userIdStore, getTransaction, getAssets } = commonData
    const { marks, portfolios, libData, assets, doubleSuggestion } = storeToRefs(commonData)

    const reqData = useCommonReqStore()//store with common requests
    const { createAsset, createTransaction } = reqData
    // 

    const searchType = ref('name')
    let isAssetExist = false

    async function submitForm() {
        if (!modal.validate()) {// check valid data in form
            return
        } else {
            await getAssets()

            assets.value.forEach(e => {
                if (e.marketId === libData.value[0].geckoId) {
                    isAssetExist = true

                    if (isAssetExist) {
                        createTransaction({
                            type: formData.value.type,
                            assetId: e.id,
                            date: formData.value.date,
                            quantity: formData.value.quantity,
                            price: formData.value.price,
                            markId: formData.value.markId.length > 0 ? formData.value.markId : null,
                            portfolioId: formData.value.portfolioId,
                            source: "spot",
                            fee: formData.value.fee >= 0 && Number(formData.value.fee) ? formData.value.fee : 0
                        }, userIdStore)
                        getTransaction(e.id)
                    }// if asset exist create trs
                    return
                }
            });// check is asset created

            if (!isAssetExist) {
                const asset = await createAsset({
                        name: libData.value[0].name,
                        symbol: libData.value[0].symbol,
                        geckoId: libData.value[0].geckoId,
                        date: formData.value.date,
                    } ,userIdStore)

                await getAssets()// update assets list in store for ref render
                await createTransaction({
                    type: formData.value.type,
                    assetId: asset.id,
                    date: formData.value.date,
                    quantity: formData.value.quantity,
                    price: formData.value.price,
                    markId: formData.value.markId.length > 0 ? formData.value.markId : null,
                    portfolioId: formData.value.portfolioId,
                    source: "spot",
                    fee: formData.value.fee >= 0 && Number(formData.value.fee) ? formData.value.fee : 0
                }, userIdStore)
                await getTransaction(asset.id)// update transaction list in store for ref render
            }// if asset not exist create it and trs
        }
        modal.close()
        isAssetExist = false
    }

    function selectAsset(asset: any) {
        modal.formData.assetId = asset.id
        commonData.assetSuggestions = []
    }// select asset from search

    watch(() => modal.formData.asset,
        (newValue) => {
            if (newValue && newValue.length > 1) {
                doubleSuggestion.value = false;
                getAssetsNames(searchType.value, newValue)
            } else {
                assetSuggestions.length = 0
            }
        }
    )// watch for asset search and suggestions

    onMounted(() => {
        getPortfolios()
        getMarks()
    })// get fresh data for modal window
</script>

<template>
    <form @submit.prevent="submitForm">
        <h2>Add transaction</h2>

        <div class="form-row"><!-- SearchType/Asset -->
            <div class="form-group">
                <label>Search by:</label>
                <select v-model="searchType" name="searchType">
                    <option value="name">Name</option>
                    <option value="geckoId">Gecko ID</option>
                </select>
            </div>

            <div class="form-group">
                <label>Asset</label>
                <input type="text" v-model="modal.formData.asset" @input="getAssetsNames(searchType, modal.formData.asset)"/>

                <ul v-if="commonData.assetSuggestions.length" class="suggestions">
                    <li v-for="asset in commonData.assetSuggestions" :key="asset.id" @click="selectAsset(asset)" >
                        {{ asset.name }} ({{ asset.symbol }})
                    </li>
                </ul>

                <small v-if="modal.errors.assetId">{{ modal.errors.assetId }}</small>
            </div>
        </div>

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
                <select v-model="modal.formData.markId" name="marks">
                    <option disabled value="">Select</option>
                    <option v-for="item in marks" :key="item.id" :value="item.id">
                        {{ item.name }}
                    </option>
                </select>
            </div>

            <div class="form-group">
                <label>Portfolio</label>
                <select v-model="modal.formData.portfolioId" name="portfolios">
                    <option disabled value="">Select</option>
                    <option v-for="item in portfolios" :key="item.id" :value="item.id">
                        {{ item.name }}
                    </option>
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