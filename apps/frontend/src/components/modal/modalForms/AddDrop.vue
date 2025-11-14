<script setup lang="ts">
    import { ref } from 'vue'
    import { useModalStore } from '../../../store/useModalStore'
    import { useCommonDataStore } from '../../../store/commonDataStore'
    import { storeToRefs } from 'pinia'

    const modal = useModalStore()
    const { isOpen } = storeToRefs(modal)
    const { close } = modal

    const commonData = useCommonDataStore()
    const { getPortfolios } = commonData

    function submitForm() {
    if (!modal.validate()) return
        modal.close()
    }
</script>

<template>
    <form @submit.prevent="submitForm">
        <h2>Add drop</h2>

        <div class="form-group">
            <label>Asset</label>
            <input type="text" v-model="modal.formData.asset" />
            <small v-if="modal.errors.asset">{{ modal.errors.asset }}</small>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label>Type</label>
                <select>
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

        <div class="form-row">
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

        <div class="form-row">
            <div class="form-group">
                <label>Marks</label>
                <select>
                    <option disabled value="">Select</option>
                    <option value="buy">test1</option>
                    <option value="sell">test2</option>
                </select>
                <small v-if="modal.errors.marks">{{ modal.errors.marks }}</small>
            </div>

            <div class="form-group">
                <label>Portfolio</label>
                <select>
                    <option disabled value="">Select</option>
                    <option value="buy">main</option>
                    <option value="sell">day</option>
                </select>
                <small v-if="modal.errors.portfolio">{{ modal.errors.portfolio }}</small>
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