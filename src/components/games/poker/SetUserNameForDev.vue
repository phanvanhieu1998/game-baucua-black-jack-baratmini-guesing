<template>
  <el-dialog
    custom-class="register-user-box"
    title="Register Username"
    :append-to-body="true"
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    width="300px"
    :before-close="handleClose"
    @open="onOpen">
    <el-input v-model="username"></el-input>
    <el-button @click="setUsername">Register</el-button>
  </el-dialog>
</template>

<script>
import Cookies from 'js-cookie';

export default {
  data() {
    return {
      dialogVisible: false,
      username: ''
    };
  },

  methods: {
    onOpen(){
      if(Cookies.get('dev_user')){
        this.username = Cookies.get('dev_user');
      }
    },

    open(){
      this.dialogVisible = true;
    },

    handleClose(done) {
      
    },

    setUsername(){
      if(this.username === '')
        return;

      Cookies.set('dev_user', this.username);
      this.$store.commit('poker/SET_DEV_USER', this.username);
      this.$emit('set-success', true);
      this.dialogVisible = false;
    }
  }
};
</script>

<style>
.el-dialog.register-user-box{
  font-size: 15px;
  background-color: #266926;
  border: 1px solid white;
  border-radius: 5px;
  color: #FFF;
}

.el-dialog.register-user-box .el-dialog__title{
  color: #FFF;
}
</style>