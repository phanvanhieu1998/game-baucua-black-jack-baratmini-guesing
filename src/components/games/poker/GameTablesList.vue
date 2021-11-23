<template>
  <div class="poker-game-tables-list">
    <h1>Poker Lobby</h1>
    <el-table
      :data="lobbyTables"
      border
      style="width: 99.8%">
      <el-table-column
        prop="name"
        label="NAME OF TABLE:"
        >
        <template slot-scope="scope">
          <router-link :to="`/poker/table-${scope.row.seatsCount}/${scope.row.id}`">{{scope.row.name}}</router-link>
        </template>
      </el-table-column>
      <el-table-column
        label="BB/SB:"
        
        >
        <template slot-scope="scope">
          ${{scope.row.bigBlind}}/${{scope.row.smallBlind}}
        </template>
      </el-table-column>
      <el-table-column
        label="MIN/MAX BUY IN:">
        <template slot-scope="scope">
          ${{scope.row.minBuyIn}}/${{scope.row.maxBuyIn}}
        </template>
      </el-table-column>
      <el-table-column
        label="JOIN:"
        width="100px">
        <template slot-scope="scope">
          <router-link :to="`/poker/table-${scope.row.seatsCount}/${scope.row.id}`">Enter ({{ scope.row.playersSeatedCount }})</router-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {
      
    }
  },

  computed: {
    ...mapState({
      lobbyTables: state => state.poker.lobbyTables
    })
  },

  created() {
    this.loadTables();
  },

  mounted() {
    // this.loadTables()

  },

  methods: {
    loadTables(){
      this.$store.dispatch('poker/getGameTables');
    }
  },
}
</script>
<style >
@import "./style.css";

.poker-game-tables-list{
  display: block;
}

.poker-game-tables-list h1{
  margin: 0;
  padding: 10px 20px;
  font-size: 20px;
  color: #FFF;
}
</style>