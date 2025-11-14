import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

export enum ModalForms {
    AddTransaction = 'AddTransaction',
    AddDrop = 'AddDrop',
}// enum with modal forms names

export const useModalStore = defineStore('useModalStore', () => {
    const isOpen = ref(false)// check is modal open
    const currentModal = ref<ModalForms | null>(null)

    const formData = reactive<Record<string, any>>({})// data from modal window
    const errors = reactive<Record<string, string>>({})

    const baseValidationRules = {// base validation rules for modal types
        addData: {
            assetId: (val: string) => (!val ? 'Введите Asset' : null),
            date: (val: number) => (!val ? 'Введите Date' : null),
            portfolioId: (val: any) => (!val ? 'Введите Portfolio' : null),
            quantity: (val: number) => (!val ? 'Введите Quantity' : null),
            price: (val: number) => (!val ? 'Введите Price' : null),
            fee: (val: number) => (!val ? 'Введите Fee' : null),
        },
    }

    const formSpecificRules = {// rules for specific inputs in forms
        AddTransaction: {
            type: (val: string) => (!val ? 'Введите Type' : null),
        },
        AddDrop: {

        },
    }

    const validationRules = {// rules summary for modals
        [ModalForms.AddTransaction]: {
            ...baseValidationRules.addData,
            ...formSpecificRules.AddTransaction,
        },
        [ModalForms.AddDrop]: {
            ...baseValidationRules.addData,
            ...formSpecificRules.AddDrop,
        },
    }

    const defaultFormData: Record<ModalForms, Record<string, any>> = {// default form data by modal name
        [ModalForms.AddTransaction]: {
            assetId: '',
            asset: '',
            type: '',
            date: '',
            quantity: '',
            price: '',
            fee: '',
            markId: '',
            portfolioId: '',
        },
        [ModalForms.AddDrop]: {
            
        },
    }

    function timeConverter(date: Date) {// converter for date
        const timestamp = date.toISOString()
        return timestamp
    }

    function open(form: ModalForms, initialData: Record<string, any> = {}) {// opening modal
        currentModal.value = form
        isOpen.value = true
        Object.assign(formData, defaultFormData[form])
        Object.assign(formData, initialData)
        resetErrors()
    }

    function close() {// closing modal
        isOpen.value = false
        currentModal.value = null
        resetForm()
        resetErrors()
    }

    function validate(): boolean {// validating modal by rules
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
    }

    function resetErrors() {
        Object.keys(errors).forEach((key) => delete errors[key])
    }

    return {
        // vars
        isOpen,
        currentModal,
        formData,
        errors,
        // funcs
        open,
        close,
        validate,
        resetForm,
        resetErrors,
        timeConverter,
    }
})
