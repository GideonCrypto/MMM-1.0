<script setup lang="ts">
    import { ref } from 'vue'
    import { useModalStore, ModalForms } from '../../store/useModalStore'
    import { storeToRefs } from 'pinia'
    // modals imports
    import AddTransaction from './modalForms/AddTransaction.vue'
    import UpdateTransaction from './modalForms/UpdateTransaction.vue'
    import AddDrop from './modalForms/AddDrop.vue'
    import UpdateDrop from './modalForms/UpdateDrop.vue'
    import SellDrop from './modalForms/SellDrop.vue'
    import AddStaking from './modalForms/AddStaking.vue'
    import SellStakingReward from './modalForms/sellStakingReward.vue'
    import UpdateStaking from './modalForms/updateStaking.vue'
    // 

    const modal = useModalStore()
    const { isOpen, currentModal } = storeToRefs(modal)
    const { close } = modal
</script>

<template>
    <Teleport to="body">
        <div v-if="isOpen" class="modal-overlay" @click.self="close">
            <div class="modal">
                <AddTransaction v-if="currentModal === ModalForms.AddTransaction"/>
                <UpdateTransaction v-if="currentModal === ModalForms.UpdateTransaction"/>
                <AddDrop v-if="currentModal === ModalForms.AddDrop"/>
                <UpdateDrop v-if="currentModal === ModalForms.UpdateDrop"/>
                <SellDrop v-if="currentModal === ModalForms.SellDrop"/>
                <AddStaking v-if="currentModal === ModalForms.AddStaking"/>
                <SellStakingReward v-if="currentModal === ModalForms.SellStakingReward"/>
                <UpdateStaking v-if="currentModal === ModalForms.UpdateStaking"/>
            </div>
        </div>
    </Teleport>
</template>

<style lang="postcss" scoped>
    /* ------- GENERAL ------- */
    .modal-overlay, .modal {
        display: flex;
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
        }
    }
</style>