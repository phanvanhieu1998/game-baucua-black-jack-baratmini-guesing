<template>
  <div class="nameTable">
 
        <el-table
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            prop="date"
            label="NAME OF TABLE:"
            >
          </el-table-column>
          <el-table-column
            prop="name"
            label="BB/SB:"
             >
          </el-table-column>
          <el-table-column
            prop="address"
            label="MIN/MAX BUY IN:"
             >
          </el-table-column>
            <el-table-column
            label="JOIN:">
             <template slot-scope="scope">

               <span @click="joinGame" class="join__game">{{scope.row.join}}</span>
             </template>
          </el-table-column>
        </el-table>

  </div>
</template>

<script>
export default {
  data(){
    return{
        tableData: [{
          date: 'PETER POKER NIGHT',
          name: '$20/$5',
          address: '$40/$200',
          join:'ENTER'
        }, {
          date: 'PETER POKER NIGHT',
          name: '$20/$5',
           address: '$40/$200',
          join:'ENTER'
        }, {
          date: 'PETER POKER NIGHT',
          name: '$20/$5',
           address: '$40/$200',
          join:'ENTER'
        }, {
          date: 'PETER POKER NIGHT',
          name: '$20/$5',
           address: '$40/$200',
          join:'ENTER'
        }]
    }
  },
  methods:{
  joinGame(){
    this.$emit('joinGame',true)
  }
  }
  

}
</script>

<style>
.nameTable{
  background-color: white !important;
}

.nameTable .cell{
  text-align: center;
}
.nameTable .join__game:hover{
  cursor: pointer;
}

</style>