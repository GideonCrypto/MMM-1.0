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
    const { getPortfolios, getMarks, getAssetsNames, assetSuggestions, userIdStore, getTransaction, getAssets, getDrops } = commonData
    const { marks, portfolios, libData, assets, doubleSuggestion } = storeToRefs(commonData)

    const reqData = useCommonReqStore()//store with common requests
    const { createAsset, createTransaction, createDrop } = reqData
    // 

    const searchType = ref('name')
    let isAssetExist = false

    async function submitForm() {
        let assetId: string = null
        let trsId: string = null
        if (!modal.validate()) {// check valid data in form
            return
        } else {
            await getAssets()

            for (const e of assets.value) {
                if (e.marketId === libData.value[0].geckoId) {
                    isAssetExist = true;

                    if (isAssetExist) {
                        const createdTrs = await createTransaction({
                            type: 'buy',
                            assetId: e.id,
                            date: formData.value.date,
                            quantity: formData.value.value,
                            price: formData.value.price,
                            markId: formData.value.markId.length > 0 ? formData.value.markId : null,
                            portfolioId: formData.value.portfolioId,
                            source: "drop",
                            fee: 0
                        }, userIdStore);

                        trsId = createdTrs.id;
                        assetId = e.id
                    }// if asset exist create trs

                    break;
                }
            }// check is asset created

            if (!isAssetExist) {
                const asset = await createAsset({
                    name: libData.value[0].name,
                    symbol: libData.value[0].symbol,
                    geckoId: libData.value[0].geckoId,
                    date: formData.value.date,
                } ,userIdStore)

                const createdTrs = await createTransaction({
                    type: 'buy',
                    assetId: asset.id,
                    date: formData.value.date,
                    quantity: formData.value.value,
                    price: formData.value.price,
                    markId: formData.value.markId.length > 0 ? formData.value.markId : null,
                    portfolioId: formData.value.portfolioId,
                    source: "drop",
                    fee: 0
                }, userIdStore)

                trsId = createdTrs.id;
                assetId = asset.id

                await getAssets()// update assets list in store for ref render
            }// if asset not exist create it and trs
        }

        await createDrop({
            assetId: assetId,
            date: formData.value.date,
            value: formData.value.value,
            price: formData.value.price,
            markId: formData.value.markId.length > 0 ? formData.value.markId : null,
            transaction: trsId
        }, userIdStore)

        await getDrops()
        await getTransaction(assetId)
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
        <h2>Add drop</h2>

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
                <label>Date</label>
                <input type="datetime-local" v-model="modal.formData.date" />
                <small v-if="modal.errors.date">{{ modal.errors.date }}</small>
            </div>
        </div>

        <div class="form-row"><!-- Quantity/Price/Fee -->
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