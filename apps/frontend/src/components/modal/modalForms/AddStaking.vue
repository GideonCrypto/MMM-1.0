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
    const { getPortfolios, getMarks, getAssetsNames, assetSuggestions, assetSuggestionsStaking, userIdStore, getAssets, getStaking } = commonData
    const { marks, portfolios, libData, libDataSecond, assets, doubleSuggestion } = storeToRefs(commonData)

    const reqData = useCommonReqStore()//store with common requests
    const { createAsset, createStaking } = reqData
    // 

    const searchType = ref('name')
    let isAssetExist = false
    let isRewarAssetExist = false
    let assetId = null
    let assetIdReward = null

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
                    isRewarAssetExist = true
                    assetIdReward = asset.id
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

            if (!isRewarAssetExist) {
                const assetReward = await createAsset({
                    name: libDataSecond.value[0].name,
                    symbol: libDataSecond.value[0].symbol,
                    geckoId: libDataSecond.value[0].geckoId,
                    date: formData.value.date,
                } ,userIdStore)
                assetIdReward = assetReward.id
            }// create asset if not exist
            
            const staking = await createStaking({
                assetId: assetId,
                date: formData.value.date, 
                value: formData.value.value,
                reward: formData.value.reward,
                rewardSold: 0,
                assetToReceive: assetIdReward,
                markId: formData.value.markId.length > 0 ? formData.value.markId : null,
            }, userIdStore);
        }

        await getStaking()// get fresh data for store
        modal.close()
        isAssetExist = false
        isRewarAssetExist = false
    }

    function selectAsset(asset: any) {
        modal.formData.assetId = asset.id
        commonData.assetSuggestions = []
    }// select asset from search

    function selectRewardAsset(asset: any) {
        modal.formData.assetIdReward = asset.id
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

    watch(() => modal.formData.assetReward,
        (newValue) => {
            if (newValue && newValue.length > 1) {
                doubleSuggestion.value = true;
                getAssetsNames(searchType.value, newValue)
            } else {
                assetSuggestionsStaking.length = 0
            }
        }
    )// watch for asset search and suggestions for reward asset

    onMounted(() => {
        getPortfolios()
        getMarks()
    })// get fresh data for modal window
</script>

<template>
    <form @submit.prevent="submitForm">
        <h2>Add staking</h2>

        <div class="form-row"><!-- SearchType/Staking Asset -->
            <div class="form-group">
                <label>Asset to stake:</label>
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

        <div class="form-row"><!-- SearchType/Reward Asset -->
            <div class="form-group">
                <label>Asset to receive:</label>
                <select v-model="searchType" name="searchType">
                    <option value="name">Name</option>
                    <option value="geckoId">Gecko ID</option>
                </select>
            </div>

            <div class="form-group">
                <label>Asset</label>
                <input type="text" v-model="modal.formData.assetReward" @input="getAssetsNames(searchType, modal.formData.assetReward)"/>

                <ul v-if="commonData.assetSuggestionsStaking.length" class="suggestions">
                    <li v-for="assetReward in commonData.assetSuggestionsStaking" :key="assetReward.id" @click="selectRewardAsset(assetReward)" >
                        {{ assetReward.name }} ({{ assetReward.symbol }})
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
                <label>Reward</label>
                <input type="number" v-model="modal.formData.reward" />
                <small v-if="modal.errors.reward">{{ modal.errors.reward }}</small>
            </div>

            <div class="form-group">
                <label>Value</label>
                <input type="number" v-model="modal.formData.value" />
                <small v-if="modal.errors.value">{{ modal.errors.value }}</small>
            </div>
        </div>

        <div class="form-row"><!-- Marks -->
            <div class="form-group">
                <label>Marks</label>
                <select v-model="modal.formData.markId" name="marks">
                    <option disabled value="">Select</option>
                    <option v-for="item in marks" :key="item.id" :value="item.id">
                        {{ item.name }}
                    </option>
                </select>
            </div>
        </div>

        <div class="buttons">
            <button type="button" @click="modal.close">Close</button>
            <button type="submit">Submit</button>
        </div>
    </form>
</template>

<style src="./modalForms.css" scoped></style>