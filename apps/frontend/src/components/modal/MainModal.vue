<script setup lang="ts">
    import { ref } from 'vue'
    import { useModalStore, ModalForms } from '../../store/useModalStore'
    import { storeToRefs } from 'pinia'
    import AddTransaction from './modalForms/AddTransaction.vue'
    import AddDrop from './modalForms/AddDrop.vue'

    const modal = useModalStore()
    const { isOpen, currentModal } = storeToRefs(modal)
    const { close } = modal
</script>

<template>
    <Teleport to="body">
        <div v-if="isOpen" class="modal-overlay" @click.self="close">
            <div class="modal">
                <AddDrop v-if="currentModal === ModalForms.AddDrop"/>
                <AddTransaction v-if="currentModal === ModalForms.AddTransaction"/>
            </div>
        </div>
    </Teleport>
</template>

<style lang="postcss">
    /* ------- GENERAL ------- */
    .modal-overlay, .modal, form, .form-group, .form-row, .buttons {
        display: flex;
    }

    small {
        color: red;
    }

    /* ------- TREE ------- */
    .modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.4);
        align-items: center;
        justify-content: center;
        z-index: 1000;

        & .modal {
            background: #fff;
            padding: 24px;
            border-radius: 12px;
            width: 400px;
            max-width: 90%;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            border: 2px solid #ddd;
            flex-direction: column;

            & h2 {
                margin-bottom: 16px;
                font-size: 1.2rem;
                font-weight: 600;
            }

            & form {
                flex-direction: column;

                & .form-group {
                    flex-direction: column;
                    margin-bottom: 16px;
                    position: relative;

                    & label {
                        font-size: 13px;
                        margin-bottom: 4px;
                    }

                    & input, select {
                        padding: 8px 10px;
                        font-size: 14px;
                        border: 1px solid #ccc;
                        border-radius: 6px;
                        outline: none;
                        transition: border 0.2s;

                        &:focus {
                            border-color: #007bff;
                        }
                    }

                    & .suggestions {
                        position: absolute;
                        z-index: 1000;
                        background: white;
                        border: 1px solid #ccc;
                        border-radius: 8px;
                        width: 100%;
                        max-height: 200px;
                        overflow-y: auto;
                        margin-top: 4px;
                        list-style: none;
                        padding: 0;
                        top: 95%;
                        
                        & li {
                            padding: 8px 10px;
                            cursor: pointer;
                        }

                        & li:hover {
                            background: #f0f0f0;
                        }
                    }
                }

                & .form-row {
                    gap: 12px;
                    margin-bottom: 16px;

                    & > .form-group {
                        flex: 1;
                        min-width: 0;
                    }
                }

                & .buttons {
                    justify-content: space-between;
                    gap: 10px;
                    margin-top: 12px;

                    & button {
                        padding: 10px 16px;
                        border: 1px solid #ccc;
                        background: #f8f8f8;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 14px;
                        transition: background 0.2s;
                        color: #000;

                        &:hover {
                            background: #eaeaea;
                        }

                        &[type="submit"] {
                            border-color: #007bff;
                            color: #007bff;
                        }
                    }
                }
            }
        }
    }
</style>