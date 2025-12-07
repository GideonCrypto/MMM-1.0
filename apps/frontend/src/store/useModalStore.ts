import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'

export enum ModalForms {
    AddTransaction = 'AddTransaction',
    UpdateTransaction = 'UpdateTransaction',
    AddDrop = 'AddDrop',
    UpdateDrop = 'UpdateDrop',
    SellDrop = 'SellDrop',
    AddStaking = 'AddStaking',
    UpdateStaking = 'UpdateStaking',
    SellStakingReward = 'SellStakingReward',
    AddSwap = 'AddSwap',
    UpdateSwap = 'UpdateSwap',
}

export const useModalStore = defineStore('useModalStore', () => {
    // ------------------------------------------------------------------
    // this store used for modal windows and operations there
    // ------------------------------------------------------------------
    const isOpen = ref(false)
    const currentModal = ref<ModalForms | null>(null)
    const currentTrasnsaction = ref()

    const formData = reactive<Record<string, any>>({})
    const errors = reactive<Record<string, string>>({})

    // -------------------------------------------- marks multiselect logic
    const selectedMarks = ref<Array<{ id: string; name: string }>>([])//choosed marks
    const currentMarkId = ref("")// current choosed mark

    
    const availableMarks = computed(() => {
        if (!allMarks.value) return []
        return allMarks.value.filter(
            m => !selectedMarks.value.find(s => s.id === m.id)
        )
    })// available marks (without choosed)

    const allMarks = ref<any[]>([])

    function setMarksList(list: any[]) {
        allMarks.value = list

        if (Array.isArray(formData.markId)) {
            selectedMarks.value = allMarks.value.filter(m =>
                formData.markId.includes(m.id)
            )
        }
    }

    function addMark() {
        if (!currentMarkId.value) return

        const mark = allMarks.value.find(m => m.id === currentMarkId.value)
        if (!mark) return

        if (!selectedMarks.value.find(m => m.id === mark.id)) {
            selectedMarks.value.push(mark)
        }

        currentMarkId.value = ""
        formData.markId = selectedMarks.value.map(m => m.id)
    }

    function removeMark(mark: { id: string }) {
        selectedMarks.value = selectedMarks.value.filter(m => m.id !== mark.id)
        formData.markId = selectedMarks.value.map(m => m.id)
    }
    // --------------------------------------------
    // -------------------------------------------- validating rules
    const validationRules = {
        [ModalForms.AddTransaction]: {
            assetId: (val: string) => (!val ? 'Введите Asset' : null),
            date: (val: number) => (!val ? 'Введите Date' : null),
            portfolioId: (val: any) => (!val ? 'Введите Portfolio' : null),
            quantity: (val: number) => (!val ? 'Введите Quantity' : null),
            price: (val: number) => (!val ? 'Введите Price' : null),
            fee: (val: number) => (val === null || val === undefined ? 'Введите Fee' : null),
            type: (val: string) => (!val ? 'Введите Type' : null),
        },
        [ModalForms.UpdateTransaction]: {
            assetId: (val: string) => (!val ? 'Введите Asset' : null),
            date: (val: number) => (!val ? 'Введите Date' : null),
            portfolioId: (val: any) => (!val ? 'Введите Portfolio' : null),
            quantity: (val: number) => (!val ? 'Введите Quantity' : null),
            price: (val: number) => (!val ? 'Введите Price' : null),
            fee: (val: number) => (val === null || val === undefined ? 'Введите Fee' : null),
            type: (val: string) => (!val ? 'Введите Type' : null),
        },
        [ModalForms.AddDrop]: {
            assetId: (val: string) => (!val ? 'Введите Asset' : null),
            date: (val: number) => (!val ? 'Введите Date' : null),
            value: (val: number) => (val === null || val === undefined ? 'Введите value' : null),
            price: (val: number) => (!val ? 'Введите Price' : null),
            portfolioId: (val: any) => (!val ? 'Введите Portfolio' : null),
        },
        [ModalForms.UpdateDrop]: {
            date: (val: number) => (!val ? 'Введите Date' : null),
            value: (val: number) => (val === null || val === undefined ? 'Введите value' : null),
            price: (val: number) => (!val ? 'Введите Price' : null),
        },
        [ModalForms.SellDrop]: {
            date: (val: number) => (!val ? 'Введите Date' : null),
            value: (val: number) => (val === null || val === undefined ? 'Введите value' : null),
            price: (val: number) => (!val ? 'Введите Price' : null),
            fee: (val: number) => (val === null || val === undefined ? 'Введите Fee' : null),
        },
        [ModalForms.AddStaking]: {
            assetId: (val: string) => (!val ? 'Введите Asset to stake' : null),
            assetIdReward: (val: string) => (!val ? 'Введите Asset to receive' : null),
            date: (val: number) => (!val ? 'Введите Date' : null),
            value: (val: number) => (!val ? 'Введите Value' : null),
            reward: (val: number) => (!val ? 'Введите Reward' : null),
        },
        [ModalForms.UpdateStaking]: {
            date: (val: number) => (!val ? 'Введите Date' : null),
            value: (val: number) => (!val ? 'Введите Value' : null),
            reward: (val: number) => (!val ? 'Введите Reward' : null),
        },
        [ModalForms.SellStakingReward]: {
            date: (val: number) => (!val ? 'Введите Date' : null),
            value: (val: number) => (!val ? 'Введите value' : null),
            price: (val: number) => (!val ? 'Введите Price' : null),
            fee: (val: number) => (val === null || val === undefined ? 'Введите Fee' : null),
            portfolioId: (val: any) => (!val ? 'Введите Portfolio' : null),
        },
        [ModalForms.AddSwap]: {
            assetIdChange: (val: string) => (!val ? 'Введите Asset to change' : null),
            assetIdReceive: (val: string) => (!val ? 'Введите Asset to receive' : null),
            fee: (val: number) => (!val ? 'Введите Fee' : null),
            changeAmount: (val: number) => (!val ? 'Введите Change amount' : null),
            receiveAmount: (val: number) => (!val ? 'Введите Receive amount' : null),
            priceChange: (val: number) => (!val ? 'Введите Price' : null),
            priceReceive: (val: number) => (!val ? 'Введите Price' : null),
            date: (val: number) => (!val ? 'Введите Date' : null)
        },
        [ModalForms.UpdateSwap]: {
            fee: (val: number) => (!val ? 'Введите Fee' : null),
            changeAmount: (val: number) => (!val ? 'Введите Change amount' : null),
            receiveAmount: (val: number) => (!val ? 'Введите Receive amount' : null),
            priceChange: (val: number) => (!val ? 'Введите Price' : null),
            priceReceive: (val: number) => (!val ? 'Введите Price' : null),
            date: (val: number) => (!val ? 'Введите Date' : null)
        },
    }

    const defaultFormData: Record<ModalForms, Record<string, any>> = {
        [ModalForms.AddTransaction]: {
            assetId: '',
            asset: '',
            type: '',
            date: '',
            quantity: '',
            price: '',
            fee: '',
            markId: [],
            portfolioId: '',
            source: ''
        },
        [ModalForms.UpdateTransaction]: {},
        [ModalForms.AddDrop]: {
            assetId: '',
            asset: '',
            date: '',
            quantity: '',
            price: '',
            value: '',
            markId: [],
            portfolioId: '',
        },
        [ModalForms.UpdateDrop]: {},
        [ModalForms.SellDrop]: {
            date: '',
            price: '',
            markId: [],
            portfolioId: '',
            fee: '',
            value: '', 
        },
        [ModalForms.AddStaking]: {
            assetId: '',
            assetIdReward: '',
            asset: '',
            assetReward: '',
            date: '',
            reward: '',
            value: '',
            markId: [],
        },
        [ModalForms.UpdateStaking]: {},
        [ModalForms.SellStakingReward]: {
            date: '',
            price: '',
            markId: [],
            portfolioId: '',
            fee: '',
            value: '', 
        },
        [ModalForms.AddSwap]: {
            asset: '',
            assetReceive: '',
            assetIdChange: '',
            assetIdReceive: '',
            fee: '',
            changeAmount: '',
            receiveAmount: '',
            priceChange: '',
            priceReceive: '',
            date: ''
        },
        [ModalForms.UpdateSwap]: {},
    }
// --------------------------------------------
    function timeConverter(date: Date) {
        const timestamp = date.toISOString()
        return timestamp
    }
// -------------------------------------------- modal logic
    function open(form: ModalForms, initialData: Record<string, any> = {}) {
        currentModal.value = form
        isOpen.value = true

        Object.assign(formData, defaultFormData[form])// reset form to default
        const t = currentTrasnsaction.value

        if (form === ModalForms.UpdateTransaction && currentTrasnsaction.value) {//if UpdateTransaction do autofill
            Object.assign(formData, {
                id: t.id ?? '',
                assetId: t.assetId ?? '',
                type: t.type ?? '',
                quantity: t.quantity ?? '',
                price: t.price ?? '',
                fee: t.fee ?? '',
                source: t.source ?? '',
                portfolioId: t.portfolio ?? '',
                markId: Array.isArray(t.marks)
                    ? t.marks
                    : t.marks
                    ? t.marks.split(',').map(m => m.trim())
                    : [],
                // date to datetime-local
                date: t.timestamp
                    ? new Date(t.timestamp).toISOString().slice(0, 16)
                    : ''
            })
        } else if (form === ModalForms.UpdateDrop && currentTrasnsaction.value) {//if UpdateDrop do autofill
            Object.assign(formData, {
                id: t.id ?? '',
                assetId: t.assetId ?? '',
                value: t.value ?? '',
                price: t.price ?? '',
                markId: Array.isArray(t.marks)
                    ? t.marks
                    : t.marks
                    ? t.marks.split(',').map(m => m.trim())
                    : [],
                // date to datetime-local
                date: t.timestamp
                    ? new Date(t.timestamp).toISOString().slice(0, 16)
                    : ''
            })
        } else if (form === ModalForms.UpdateStaking && currentTrasnsaction.value) {
            Object.assign(formData, {
                value: t.value ?? '',
                reward: t.reward ?? '',
                markId: Array.isArray(t.marks)
                    ? t.marks
                    : t.marks
                    ? t.marks.split(',').map(m => m.trim())
                    : [],
                // date to datetime-local
                date: t.timestamp
                    ? new Date(t.timestamp).toISOString().slice(0, 16)
                    : ''
            })
        } else if (form === ModalForms.UpdateSwap && currentTrasnsaction.value) {
            Object.assign(formData, {
                fee: t.fee ?? '',
                changeAmount: t.changeAmount ?? '',
                receiveAmount: t.receiveAmount ?? '',
                priceChange: t.priceChange ?? '',
                priceReceive: t.priceReceive ?? '',
                // date to datetime-local
                date: t.timestamp
                    ? new Date(t.timestamp).toISOString().slice(0, 16)
                    : ''
            })
        }

        Object.assign(formData, initialData)// init data

        resetErrors()

        if (Array.isArray(formData.markId) && allMarks.value?.length > 0) {
            selectedMarks.value = allMarks.value.filter(m =>
                formData.markId.includes(m.id)
            )
        }// marks
    }

    function close() {
        isOpen.value = false
        currentModal.value = null

        resetForm()
        resetErrors()

        selectedMarks.value = []
        currentMarkId.value = ""
        formData.markId = []
    }

    function validate(): boolean {
        if (!currentModal.value) return false
        const rules = validationRules[currentModal.value]
        let isValid = true

        Object.keys(rules).forEach((key) => {
            const ruleFn = rules[key]
            const error = ruleFn(formData[key])
            if (error) {
                errors[key] = error
                isValid = false
            } else {
                delete errors[key]
            }
        })

        if (isValid && formData.date) {
            const dateObj = new Date(formData.date)
            if (!isNaN(dateObj.getTime())) {
                formData.date = dateObj.getTime()
            }
        }

        return isValid
    }

    function resetForm() {
        if (currentModal.value) {
            Object.assign(formData, defaultFormData[currentModal.value])
        }

        selectedMarks.value = []
        currentMarkId.value = ""
    }

    function resetErrors() {
        Object.keys(errors).forEach((key) => delete errors[key])
    }
// --------------------------------------------
    return {
        // base modal state
        isOpen,
        currentModal,
        formData,
        errors,
        currentTrasnsaction,

        // marks multiselect logic
        selectedMarks,
        currentMarkId,
        availableMarks,
        setMarksList,
        addMark,
        removeMark,

        // modal functions
        open,
        close,
        validate,
        resetForm,
        resetErrors,
        timeConverter,
    }
})
