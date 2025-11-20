import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'

export enum ModalForms {
    AddTransaction = 'AddTransaction',
    UpdateTransaction = 'UpdateTransaction',
    AddDrop = 'AddDrop',
}

export const useModalStore = defineStore('useModalStore', () => {
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
    // -------------------------------------------- valiating rules
    const baseValidationRules = {
        addData: {
            assetId: (val: string) => (!val ? 'Введите Asset' : null),
            date: (val: number) => (!val ? 'Введите Date' : null),
            portfolioId: (val: any) => (!val ? 'Введите Portfolio' : null),
            quantity: (val: number) => (!val ? 'Введите Quantity' : null),
            price: (val: number) => (!val ? 'Введите Price' : null),
            fee: (val: number) => (val === null || val === undefined ? 'Введите Fee' : null),
        },
    }

    const formSpecificRules = {
        AddTransaction: {
            type: (val: string) => (!val ? 'Введите Type' : null),
        },
        UpdateTransaction: {
            type: (val: string) => (!val ? 'Введите Type' : null),
        },
        AddDrop: {},
    }

    const validationRules = {
        [ModalForms.AddTransaction]: {
            ...baseValidationRules.addData,
            ...formSpecificRules.AddTransaction,
        },
        [ModalForms.UpdateTransaction]: {
            ...baseValidationRules.addData,
            ...formSpecificRules.UpdateTransaction,
        },
        [ModalForms.AddDrop]: {
            ...baseValidationRules.addData,
            ...formSpecificRules.AddDrop,
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
        [ModalForms.AddDrop]: {},
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

        if (form === ModalForms.UpdateTransaction && currentTrasnsaction.value) {
            const t = currentTrasnsaction.value

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
        }//if UpdateTransaction do autofill

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
