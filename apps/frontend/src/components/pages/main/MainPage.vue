<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue'
  import { useModalStore, ModalForms } from '../../../store/useModalStore'
  import { useCommonDataStore } from '../../../store/commonDataStore'
  import { storeToRefs } from 'pinia'

  const dataType = ref('transactions')
  enum dataTypes {
    Transactions = 'transactions',
    Swaps = 'swaps',
    Staking = 'staking',
    Drops = 'drops',
  }
  // store
  const modal = useModalStore()
  const { open } = modal
  const { currentTrasnsaction } = storeToRefs(modal)

  const commonData = useCommonDataStore()
  const { getPortfolios, getMarks, getAssets, getTransaction, changeBlockView, getDrops, getStaking } = commonData
  const { assets, transactions, portfolios, marks, dictPortfolios, dictMarks, viewBlock, drops, dictAssets, staking } = storeToRefs(commonData)
  // 
  async function openTrs(id: string) {
    changeBlockView()
    await getTransaction(id)
  }// open trs book by assetId

  async function updateTrs(transaction) {
    currentTrasnsaction.value = transaction
    open(ModalForms.UpdateTransaction)
  }// update trs modal and data 

  async function updateDrop(transaction) {
    currentTrasnsaction.value = transaction
    open(ModalForms.UpdateDrop)
  }// update trs modal and data 

  async function sellDrop(transaction) {
    currentTrasnsaction.value = transaction
    open(ModalForms.SellDrop)
  }// create sell drop trs

  async function addStaking(transaction) {
    currentTrasnsaction.value = transaction
    open(ModalForms.AddStaking)
  }// create sell drop trs

  async function updateStaking(transaction) {
    currentTrasnsaction.value = transaction
    open(ModalForms.UpdateStaking)
  }// update staking modal and data 

  async function SellStakingReward(transaction) {
    currentTrasnsaction.value = transaction
    open(ModalForms.SellStakingReward)
  }// create sell staking trs

  watch(dataType, async () => {
    switch (dataType.value) {
      case dataTypes.Transactions:
        console.log('trs');
        
        break;
      case dataTypes.Swaps:
        console.log('swp');
        
        break;
      case dataTypes.Staking:
        await getStaking()        
        break;
      case dataTypes.Drops:
        await getDrops()
        break;
      default:
        break;
    }
  })

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
      <button @click="open(ModalForms.AddStaking)">Add staking</button>
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
          <select name="dataType" v-model="dataType">
            <option value="transactions">Transactions</option>
            <option value="swaps">Swaps</option>
            <option value="staking">Staking</option>
            <option value="drops">Drops</option>
          </select>
        </div>
        <!-- Drops list -->
        <div v-if="dataType == dataTypes.Drops" v-show="!viewBlock && dataType == dataTypes.Drops">
          <ul class="table">
            <ul class="header-row">
              <li class="cell head">Name</li>
              <li class="cell head">Value</li>
              <li class="cell head">Sold</li>
              <li class="cell head">Price</li>
              <li class="cell head">Marks</li>
            </ul>
            <li class="row" v-for="(item) in drops" :key="item.id">
              <div class="full-width top">Added: {{item.timestamp}}</div>
              <ul class="grid-row" @click="updateDrop(item)">
                <li class="cell">{{dictAssets[item.assetId]}}</li>
                <li class="cell">{{item.value}}</li>
                <li class="cell">{{item.sold}}</li>
                <li class="cell">{{item.price}}</li>
                <li class="cell">{{dictMarks[item.marks]}}</li>
              </ul>
              <div class="full-width bottom">
                Метрики и кнопки
                <button @click="sellDrop(item)">Sell reward</button>
              </div>
            </li>
          </ul>
        </div>
        <!-- Stakin list -->
        <div v-if="dataType == dataTypes.Staking" v-show="!viewBlock && dataType == dataTypes.Staking">
          <ul class="table">
            <ul class="header-row">
              <li class="cell head">Staked</li>
              <li class="cell head">Value</li>
              <li class="cell head">Reward</li>
              <li class="cell head">Value</li>
              <li class="cell head">Sold</li>
            </ul>
            <li class="row" v-for="(item) in staking" :key="item.id">
              <div class="full-width top">Added: {{item.timestamp}}</div>
              <ul class="grid-row" @click="updateStaking(item)">
                <li class="cell">{{dictAssets[item.assetId]}}</li>
                <li class="cell">{{item.value}}</li>
                <li class="cell">{{dictAssets[item.coinToReceive]}}</li>
                <li class="cell">{{item.reward}}</li>
                <li class="cell">{{item.rewardSold}}</li>
              </ul>
              <div class="full-width bottom">
                Метрики и кнопки
                <button @click="SellStakingReward(item)">Sell reward</button>
              </div>
            </li>
          </ul>
        </div>
        <!-- Asset list -->
        <div v-show="!viewBlock && dataType == dataTypes.Transactions">
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
        <div v-show="viewBlock && dataType == dataTypes.Transactions">
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
