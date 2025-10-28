<script setup lang="ts">
  import { ref } from 'vue'

</script>

<template>
    <div class="main-menu-wrapper">
        <div class="menu-item">Test 1</div>
        <div class="menu-item">Test 2</div>
        <div class="menu-item">Test 3</div>
        <div class="menu-item">Test 4</div>
        <div class="menu-item">Test 5</div>
        <div class="menu-item">Test 6</div>
    </div>
</template>

<style scoped>
    .main-menu-wrapper {
        display: flex;
        justify-content: left;
        align-items: center;
        height: 2vh;
    }

    .menu-item {
        padding: 5px 10px;
    }
</style>
