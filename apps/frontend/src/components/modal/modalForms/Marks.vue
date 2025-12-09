<script setup lang="ts">
    import { onMounted, ref, watch } from 'vue'
    import { useModalStore } from '../../../store/useModalStore'
    import { useCommonDataStore } from '../../../store/commonDataStore'
    import { useCommonReqStore } from '../../../store/useCommonReqStore'
    import { storeToRefs } from 'pinia'
    import axios from 'axios'

    // store
    const modal = useModalStore()//store for modal control and validation
    const { isOpen } = storeToRefs(modal)
    const { close } = modal

    const commonData = useCommonDataStore()//store with common used data
    const { getMarks, userIdStore } = commonData
    const { marks } = storeToRefs(commonData)

    const reqData = useCommonReqStore()//store with common requests
    const { createMark, deleteItem } = reqData
    // 
    const funcType = ref(null)// radio btn for func type
    const name = ref(null)// name for add func
    const itemId = ref(null)// id for delete func

    async function submitForm() {
        if (funcType.value == 'add') {
            if (name.value == null) {
                return
            } else {
                await createMark(name.value, userIdStore)
            }
        } else if (funcType.value == 'delete') {
            if (itemId.value == null) {
                return
            } else {                
                await deleteItem(`marks/${itemId.value}`)
            }
        }

        getMarks()// update marks list in store
        modal.close()
    }
</script>

<template>
    <form @submit.prevent="submitForm">
        <h2>Marks menu</h2>

        <div class="form-row"><!-- Type -->
            <div class="form-group">
                <h5>Choose action type:</h5>
                <br>
                <label>
                    <input type="radio" value="add" v-model="funcType">
                    add mark
                </label>
                <label>
                    <input type="radio" value="delete" v-model="funcType">
                    delete mark
                </label>
            </div>
        </div>

        <div class="form-row"><!-- Name -->
            <div class="form-group" v-if="funcType == 'add'">
                <label>Enter name</label>
                <input type="text" v-model="name">
            </div>
            <div class="form-group" v-else-if="funcType == 'delete'">
                <label>Choose mark to delete</label>
                <select v-model="itemId" name="marks">
                    <option disabled value="">Select mark</option>
                    <option v-for="item in marks" :key="item.id" :value="item.id">
                        {{ item.name }}
                    </option>
                </select>
                <br>
                <small>All transactions will lose they mark tag</small>
            </div>
        </div>

        <div class="buttons">
            <button type="button" @click="modal.close">Close</button>
            <button type="submit" v-if="funcType == 'add'">Submit</button>
            <button type="submit" v-else-if="funcType == 'delete'">Delete</button>
        </div>
    </form>
</template>

<style src="./modalForms.css" scoped></style>