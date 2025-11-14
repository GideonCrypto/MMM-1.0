<script setup lang="ts">
    import { onMounted, ref, watch } from 'vue'
    import { useModalStore } from '../../../store/useModalStore'
    import { useCommonDataStore } from '../../../store/commonDataStore'
    import { storeToRefs } from 'pinia'
    import axios from 'axios'

    // store
    const modal = useModalStore()//store for modal control and validation
    const { isOpen, formData } = storeToRefs(modal)
    const { close } = modal

    const commonData = useCommonDataStore()//store with common used data
    const { getPortfolios, getMarks, getAssetsNames, assetSuggestions, userIdStore } = commonData
    const { marks, portfolios, libData } = storeToRefs(commonData)
    // 

    const searchType = ref('name')
    let isAssetExist = false

    async function submitForm() {
        if (!modal.validate()) {// check valid data in form
            return
        } else {
            const assets = await axios.post(`http://localhost:3005/assets/getAssets`,
                {
                    userId: userIdStore
                }
            )

            assets.data.forEach(e => {
                if (e.marketId === libData.value[0].geckoId) {
                    isAssetExist = true

                    if (isAssetExist) {
                        createTransaction(e, formData)
                    }// if asset exist create trs
                    return
                }
            });// check is asset created

            if (!isAssetExist) {
                const createAsset = await axios.post(`http://localhost:3005/assets/createAsset`,
                    {
                        userId: userIdStore,
                        name: libData.value[0].name,
                        symbol: libData.value[0].symbol,
                        marketId: libData.value[0].geckoId,
                        price: 100,
                        timestamp: formData.value.date,
                    }
                )

                createTransaction(createAsset, formData)
            }// if asset not exist create it and trs
        }
        modal.close()
        isAssetExist = false
    }

    async function createTransaction(asset: any, trs: any) {
        const createTransaction = await axios.post(`http://localhost:3005/transactions/createTransaction`,
            {
                userId: userIdStore,
                type: trs.value.type,
                assetId: asset.id,
                timestamp: trs.value.date,
                quantity: trs.value.quantity,
                price: trs.value.price,
                marks: trs.value.markId ? trs.value.markId : null,
                notes: null,
                portfolio: trs.value.portfolioId,
                source: "spot",
                fee: trs.value.fee
            }
        )
    }

    function selectAsset(asset: any) {
        modal.formData.assetId = asset.id
        commonData.assetSuggestions = []
    }// select asset from search

    watch(() => modal.formData.asset,
        (newValue) => {
            if (newValue && newValue.length > 1) {
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

<style lang="postcss" scoped>

</style>