<template>
  <div class="baccarat-mini-table2">
    <table v-if="result_caculate">
      <tr v-for="i in row" :key="i">
        <td v-for="j in col" :key="j" style="color: #FF00000;">
          <div class="item" :class="result_caculate[j-1][i-1]">
            <span>D</span>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      col: 14,
      row: 6,
    }
  },

  props: ["arr_input"],

  computed: {
    result_caculate() {
      let table = [];
      let index = 0;

      for (let i = 0; i < this.col; i++) {
        let tmp = [];
        for (let j = 0; j < this.row; j++) {
          if(this.arr_input[index] !== undefined){
            tmp.push(this.arr_input[index]);
            
          }else{
            tmp.push(null);
          }
          index++;
        }

        table.push(tmp);
      }

      return table;
    },
  },

}
</script>

<style>
.baccarat-mini-table2{
  background-color: #FFF;
  margin-top: 0px;
}

.baccarat-mini-table2 {
  overflow-x: scroll;
}
.baccarat-mini-table2 table {
  background-color: #FFFF;
  border-bottom: 1px solid rgb(215 215 215);
  border-collapse: collapse;
  width: calc(100% - 1px);
}

.baccarat-mini-table2 th {
  border: 1px solid rgb(215 215 215);
  border-collapse: collapse;
}
.baccarat-mini-table2 tr{
  width: 100%;
} 
.baccarat-mini-table2 td {
  border: 1px solid rgb(215 215 215);
  border-collapse: collapse;
  width: calc(100% / 14);
}
.baccarat-mini-table2 .item {
  width: 16px;
  height: 16px;
  padding: 0px;
  margin: 5px auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.baccarat-mini-table2 .item span {
  display: none;
}
.baccarat-mini-table2 .pd {
  background-color: #00f;
}
.baccarat-mini-table2 .pd span {
  display: inline;
  color: white;
  font-weight: 300;
  font-size: 11px;
}
.baccarat-mini-table2 .bd {
  background-color: red;
}
.baccarat-mini-table2 .bd span {
  display: inline;
  color: white;
  font-weight: 400;
  font-size: 11px;
}
.baccarat-mini-table2 .p {
  background-color: #00f;
}
.baccarat-mini-table2 .b {
  background-color: red;
}
.baccarat-mini-table2 .t {
  background-color: #4caf50;
}
</style>