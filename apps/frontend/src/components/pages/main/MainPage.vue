<script setup lang="ts">
  import { ref } from 'vue'

</script>

<template>
  <div class="main-page-wrapper">
    <div class="main-page-sidebar">
      <button>Add transaction</button>
      <button>Add drop</button>
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
          <select name="dataType" >
            <option value="all">All data</option>
            <option value="transactions">Transactions</option>
            <option value="swaps">Swaps</option>
            <option value="staking">Staking</option>
            <option value="drops">Drops</option>
          </select>
          <select name="viewType" >
            <option value="all">Book</option>
            <option value="transactions">Single</option>
          </select>
        </div>
        <div class="main-page-data-transactions">
          <div class="trs-buy">
            <h4>Buy</h4>
            <div class="trs-list">
              <div class="trs-item nav">
                <span>price</span>
                <span>invested</span>
                <span>quantity</span>
                <span>date</span>
                <span>profit</span>
              </div>
              <div class="trs-item">
                <span>100000</span>
                <span>231</span>
                <span>0.2056</span>
                <span>12.2.2222</span>
                <span>20</span>
              </div>
              <div class="trs-item">
                <span>100000</span>
                <span>231</span>
                <span>0.2056</span>
                <span>12.2.2222</span>
                <span>20</span>
              </div>
              <div class="trs-item">
                <span>100000</span>
                <span>231</span>
                <span>0.2056</span>
                <span>12.2.2222</span>
                <span>20</span>
              </div>
              <div class="trs-item">
                <span>100000</span>
                <span>231</span>
                <span>0.2056</span>
                <span>12.2.2222</span>
                <span>20</span>
              </div>
            </div>
          </div>
          <div class="trs-sell">
            <h4>Sell</h4>
            <div class="trs-list">
              <div class="trs-item nav">
                <span>price</span>
                <span>invested</span>
                <span>quantity</span>
                <span>date</span>
                <span>profit</span>
              </div>
              <div class="trs-item">
                <span>100000</span>
                <span>231</span>
                <span>0.2056</span>
                <span>12.2.2222</span>
                <span>20</span>
              </div>
              <div class="trs-item">
                <span>100000</span>
                <span>231</span>
                <span>0.2056</span>
                <span>12.2.2222</span>
                <span>20</span>
              </div>
              <div class="trs-item">
                <span>100000</span>
                <span>231</span>
                <span>0.2056</span>
                <span>12.2.2222</span>
                <span>20</span>
              </div>
              <div class="trs-item">
                <span>100000</span>
                <span>231</span>
                <span>0.2056</span>
                <span>12.2.2222</span>
                <span>20</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
  /* ------- GENERAL ------- */
  .main-page-wrapper, .main-page-sidebar, .main-page-content, .main-page-data, .main-page-data-transactions, .trs-item {
    display: flex;
    border-radius: 5px;
  }

  .trs-sell, .trs-buy {
    border-radius: 5px;
    margin: 1px;
    width: 50%;
  }
  /* ------- TREE ------- */
  .main-page-wrapper {
    width: 100vw;
    height: 98vh;
    & .main-page-sidebar {
      width: 8%;
      margin: 5px;
      border: 1px solid black;
      flex-direction: column;
    }

    & .main-page-content {
      width: 100%;
      border: 1px solid black;
      margin: 5px;
      & .main-page-analitics {
        width: 35%;
        border-right: 1px solid black;
        padding: 5px;
        & .main-page-graph {
      
        }
        & .main-page-metrics {
      
        }
      }
      & .main-page-data {
        flex-direction: column;
        width: 65%;
        padding: 5px;
        & .main-page-data-submenu {
          width: 100%;
        }
        & .main-page-data-transactions {
          & .trs-buy {
            background-color: green;
          }
          & .trs-sell {
            background-color: red;
          }
        }
      }
    }
  }

.trs-list {
  margin: 5px;
  & .trs-item {
    justify-content: space-between;
  }
}

</style>
