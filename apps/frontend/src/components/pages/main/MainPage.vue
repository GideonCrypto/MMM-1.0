<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import { useModalStore, ModalForms } from '../../../store/useModalStore'
  import { useCommonDataStore } from '../../../store/commonDataStore'
  import { storeToRefs } from 'pinia'

  // store
  const modal = useModalStore()
  const { open } = modal
  const { currentTrasnsaction } = storeToRefs(modal)

  const commonData = useCommonDataStore()
  const { getPortfolios, getMarks, getAssets, getTransaction, changeBlockView } = commonData
  const { assets, transactions, portfolios, marks, dictPortfolios, dictMarks, viewBlock } = storeToRefs(commonData)
  // 
  async function openTrs(id: string) {
    changeBlockView()
    await getTransaction(id)
  }// open trs book by assetId

  async function updateTrs(transaction) {
    currentTrasnsaction.value = transaction
    open(ModalForms.UpdateTransaction)
  }// update trs modal and data 

  // Массив только с покупками
const buys = computed(() => transactions.value.filter(item => item.type === 'buy'));

// Массив только с продажами
const sells = computed(() => transactions.value.filter(item => item.type === 'sell'));

  onMounted(async () => {
    await getPortfolios()
    await getMarks()
    await getAssets()
  })
</script>

<template>
  <div class="main-page-wrapper">
    <div class="main-page-sidebar">
      <button @click="open(ModalForms.AddTransaction)" >Add transaction</button>
      <button @click="open(ModalForms.AddDrop)">Add drop</button>
      <button>Add staking</button>
      <button>Add swap</button>
      <select name="portfolio" >
        <option value="all">All</option>
        <option value="transactions">Main</option>
      </select>
      <button>Add portfolio</button>
    </div>
    <div class="main-page-content">
      <div class="main-page-analitics">
        <div class="main-page-graph">
          graph
        </div>
        <div class="main-page-metrics">
          metrics
        </div>
      </div>
      <div class="main-page-data">
        <div class="main-page-data-submenu">
          <button v-show="viewBlock" @click="changeBlockView">Back</button>
          <select name="dataType" >
            <option value="all">All data</option>
            <option value="transactions">Transactions</option>
            <option value="swaps">Swaps</option>
            <option value="staking">Staking</option>
            <option value="drops">Drops</option>
          </select>
        </div>
        <!-- Asset list -->
        <div v-show="!viewBlock" class="main-page-data-assets">
          <ul class="table">
            <ul class="header-row">
              <li class="cell head">Name</li>
              <li class="cell head">Symbol</li>
              <li class="cell head">Price</li>
              <li class="cell head">Marks</li>
              <li class="cell head">Notes</li>
            </ul>
            <li class="row" v-for="(item) in assets" :key="item.id" @click="openTrs(item.id)">
              <div class="full-width top">Added: {{item.timestamp}}</div>
              <ul class="grid-row">
                <li class="cell">{{item.name}}</li>
                <li class="cell">{{item.symbol}}</li>
                <li class="cell">{{item.price}}</li>
                <li class="cell">{{item.marks ? item.marks : '-'}}</li>
                <li class="cell">{{item.notes ? item.notes : '-'}}</li>
              </ul>
              <div class="full-width bottom">Метрики и кнопки </div>
            </li>
          </ul>
        </div>
        <!-- Transactions list -->
        <div v-show="viewBlock" class="main-page-data-transactions">
          <ul class="table">
            <ul class="header-row">
              <li class="cell head">Price</li>
              <li class="cell head">Quantity</li>
              <li class="cell head">Invested</li>
              <li class="cell head">Source</li>
              <li class="cell head">Portfolio</li>
            </ul>
            <li class="row" v-for="(item) in transactions" :key="item.id" @click="updateTrs(item)">
              <div class="full-width top">Added: {{item.timestamp}}</div>
              <ul class="grid-row">
                <li class="cell" :class="item.type">{{item.price}}</li>
                <li class="cell" :class="item.type">{{item.quantity}}</li>
                <li class="cell" :class="item.type">{{item.price * item.quantity}}</li>
                <li class="cell" :class="item.type">{{item.source}}</li>
                <li class="cell" :class="item.type">{{ dictPortfolios[item.portfolio] || '-' }}</li>
              </ul>
              <div class="full-width bottom">Метрики</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
  /* ------- GENERAL ------- */
  .main-page-wrapper, .main-page-sidebar, .main-page-content, .main-page-data, .table, .row {
    display: flex;
    border-radius: 5px;
  }

  .main-page-sidebar, .main-page-data, .table, .row {
    flex-direction: column;
  }

  /* ------- TREE ------- */
  .main-page-wrapper {
    width: 100vw;
    height: 98vh;
    & .main-page-sidebar {
      width: 8%;
      margin: 5px;
      border: 1px solid black;
    }

    & .main-page-content {
      width: 100%;
      border: 1px solid black;
      margin: 5px;
      & .main-page-analitics {
        width: 100%;
        border-right: 1px solid black;
        padding: 5px;
      }
      & .main-page-data {
        padding: 5px;
      }
    }
  }

/* ------- Table ------- */
.table {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 93vh;
  overflow-y: auto;
  border: 1px solid #bfbfbf;
  background: #fff;

  & .header-row {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    border-bottom: 1px solid #bfbfbf;
    background: #f0f0f0;
    position: sticky;  
    top: 0;
    z-index: 10;

    & .head {
      padding: 8px 10px;
      font-weight: bold;
      border-right: 1px solid #d0d0d0;
    }
    & .head:last-child {
      border-right: none;
    }
  }/* table header */

  & .row {
    list-style: none;
    border-bottom: 1px solid #d0d0d0;

    & .grid-row {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      grid-template-columns: repeat(5, 1fr);
    }

    & .full-width {
      padding: 6px 10px;
      background: #f7f7f7;
      font-weight: 600;
      border-bottom: 1px solid #d0d0d0;
    }

    & .bottom {
      border-top: 1px solid #d0d0d0;
    }
  }/* table row */
}

.table::-webkit-scrollbar {
  display: none;
} /* hide scroll */

.cell {
  padding: 8px 10px;
  min-height: 34px;
  display: flex;
  align-items: center;

  border-right: 1px solid #e0e0e0;
  border-bottom: 1px solid #d0d0d0;
  background: #fff;
}
.cell:last-child {
  border-right: none;
}

.grid-row:hover .cell {
  background: #eaf2fd;
  cursor: pointer;
}/* row hover */

.sell {
  background-color: lightcoral;
}

.buy {
  background-color: lightgreen;
}
</style>
