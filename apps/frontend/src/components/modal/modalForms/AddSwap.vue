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
    const { getAssetsNames, assetSuggestions, assetSuggestionsStaking, userIdStore, getAssets, getSwaps } = commonData
    const { libData, libDataSecond, assets, doubleSuggestion } = storeToRefs(commonData)

    const reqData = useCommonReqStore()//store with common requests
    const { createAsset, createSwap } = reqData
    // 

    const searchType = ref('name')
    let isAssetExist = false
    let isAssetToReceive = false
    let assetId = null
    let assetToReceive = null

    async function submitForm() {
        if (!modal.validate()) {// check valid data in form
            return
        } else {
            await getAssets()

            const id1 = libData.value[0].geckoId
            const id2 = libDataSecond.value[0].geckoId

            for (const asset of assets.value) {
                if (asset.marketId === id1) {
                    isAssetExist = true
                    assetId = asset.id
                    break
                }
            }// check existing asset

            for (const asset of assets.value) {
                if (asset.marketId === id2) {
                    isAssetToReceive = true
                    assetToReceive = asset.id
                    break
                }
            }// check existing asset

            if (!isAssetExist) {
                const asset = await createAsset({
                    name: libData.value[0].name,
                    symbol: libData.value[0].symbol,
                    geckoId: libData.value[0].geckoId,
                    date: formData.value.date,
                } ,userIdStore)
                assetId = asset.id
            }// create asset if not exist

            if (!isAssetToReceive) {
                const assetReward = await createAsset({
                    name: libDataSecond.value[0].name,
                    symbol: libDataSecond.value[0].symbol,
                    geckoId: libDataSecond.value[0].geckoId,
                    date: formData.value.date,
                } ,userIdStore)
                assetToReceive = assetReward.id
            }// create asset if not exist

            await createSwap({
                assetIdChange: assetId,
                assetIdReceive: assetToReceive,
                fee: formData.value.fee,
                changeAmount: formData.value.changeAmount,
                receiveAmount: formData.value.receiveAmount,
                priceChange: formData.value.priceChange,
                priceReceive: formData.value.priceReceive,
                date: formData.value.date
            }, userIdStore);
        }

        await getSwaps()
        await getAssets()

        modal.close()
        isAssetExist = false
        isAssetToReceive = false
    }

    function selectAsset(asset: any) {
        modal.formData.assetIdChange = asset.id
        commonData.assetSuggestions = []
    }// select asset from search

    function selectRewardAsset(asset: any) {
        modal.formData.assetIdReceive = asset.id
        commonData.assetSuggestionsStaking = []
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

    watch(() => modal.formData.assetReceive,
        (newValue) => {
            if (newValue && newValue.length > 1) {
                doubleSuggestion.value = true;
                getAssetsNames(searchType.value, newValue)
            } else {
                assetSuggestionsStaking.length = 0
            }
        }
    )// watch for asset search and suggestions for reward asset
</script>

<template>
    <form @submit.prevent="submitForm">
        <h2>Add swap</h2>

        <div class="form-row"><!-- SearchType/Change Asset -->
            <div class="form-group">
                <label>Asset to change:</label>
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

                <small v-if="modal.errors.assetIdChange">{{ modal.errors.assetIdChange }}</small>
            </div>
        </div>

        <div class="form-row"><!-- SearchType/Receive Asset -->
            <div class="form-group">
                <label>Asset to receive:</label>
                <select v-model="searchType" name="searchType">
                    <option value="name">Name</option>
                    <option value="geckoId">Gecko ID</option>
                </select>
            </div>

            <div class="form-group">
                <label>Asset</label>
                <input type="text" v-model="modal.formData.assetReceive" @input="getAssetsNames(searchType, modal.formData.assetReceive)"/>

                <ul v-if="commonData.assetSuggestionsStaking.length" class="suggestions">
                    <li v-for="assetReceive in commonData.assetSuggestionsStaking" :key="assetReceive.id" @click="selectRewardAsset(assetReceive)" >
                        {{ assetReceive.name }} ({{ assetReceive.symbol }})
                    </li>
                </ul>

                <small v-if="modal.errors.assetIdReceive">{{ modal.errors.assetIdReceive }}</small>
            </div>
        </div>

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
                <input type="number" v-model="modal.formData.changeAmount" step="0.000000000001"/>
                <small v-if="modal.errors.changeAmount">{{ modal.errors.changeAmount }}</small>
            </div>

            <div class="form-group">
                <label>Price</label>
                <input type="number" v-model="modal.formData.priceChange" step="0.000000000001"/>
                <small v-if="modal.errors.priceChange">{{ modal.errors.priceChange }}</small>
            </div>
        </div>

        <div class="form-row"><!-- Quantity/Price/ (receive)) -->
            <div class="form-group">
                <label>Receive amount</label>
                <input type="number" v-model="modal.formData.receiveAmount" step="0.000000000001"/>
                <small v-if="modal.errors.receiveAmount">{{ modal.errors.receiveAmount }}</small>
            </div>

            <div class="form-group">
                <label>Price</label>
                <input type="number" v-model="modal.formData.priceReceive" step="0.000000000001"/>
                <small v-if="modal.errors.priceReceive">{{ modal.errors.priceReceive }}</small>
            </div>
        </div>

        <div class="form-row"><!-- Fee -->
            <div class="form-group">
                <label>Fee</label>
                <input type="number" v-model="modal.formData.fee" step="0.000000000001"/>
                <small v-if="modal.errors.fee">{{ modal.errors.fee }}</small>
            </div>
        </div>
        

        <div class="buttons">
            <button type="button" @click="modal.close">Close</button>
            <button type="submit">Submit</button>
        </div>
    </form>
</template>

<style src="./modalForms.css" scoped></style>