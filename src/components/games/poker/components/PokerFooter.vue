<template>
  <div class="action-list action-list-poker">
    <el-row style="width:100%;">
      <el-col :span="24">
        <el-popconfirm
          title="Return to lobby, Are you sure?"
          @confirm="returnLobby"
          cancel-button-text="Cancel"
          confirm-button-text="Ok"
        >
          <el-button
            style="width:100%;background-color: #333;display: block;"
            type="info"
            slot="reference"
            >RETURN TO LOBBY</el-button
          >
        </el-popconfirm>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      
    }
  }, 

  methods: {
    returnLobby(){
      this.$router.push('/')
      this.$emit('sound',false)
    },
  },
}
</script>