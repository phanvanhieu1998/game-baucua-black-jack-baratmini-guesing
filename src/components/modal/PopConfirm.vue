<script>
export default {
  data() {
    return {
      loadOk: false,
    };
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    subTitle: {
      type: String,
      default: "",
    },
    isVisible: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    cancel() {
      this.$emit("cancel");
    },
    confirm() {
      this.$emit("confirm");
      this.loadOk = true;
    },
  },
};
</script>
<template>
  <div>
    <slot name="children"></slot>
    <transition v-if="isVisible" name="pop-confirm-fade">
      <div class="pop-confirm-backdrop">
        <div
          class="pop-confirm"
          role="dialog"
          aria-labelledby="modalTitle"
          aria-describedby="pop-confirm-description"
        >
          <section class="pop-confirm-body" id="pop-confirm-description">
            <span style="color: #ffffff; font-size: 18px; font-weight: 500">{{
              title
            }}</span>
            <p v-if="subTitle" style="color: #ffffff; font-size: 14px">
              {{ subTitle }}
            </p>
          </section>
          <footer class="pop-confirm-footer">
            <button class="btn-cancel" @click="cancel" aria-label="Close modal">
              Cancel
            </button>
            <div class="btn">
              <button class="btn" @click="confirm" aria-label="Close modal">
                OK
              </button>
            </div>
          </footer>
        </div>
      </div>
    </transition>
  </div>
</template>
<style>
.pop-confirm-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.pop-confirm {
  background-color: #0d6751;
  box-shadow: 2px 2px 20px 1px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  width: 250px;
  border: 2px solid #22c99b;
  border-radius: 10px;
}

.pop-confirm-footer {
  padding: 15px;
  display: flex;
}

.pop-confirm-footer {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.pop-confirm-body {
  position: relative;
  padding: 20px 10px;
  text-align: center;
}

.btn {
  width: 65px;
  height: 35px;
  outline: none;
  background-color: #4aa4da;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  font-size: 12px;
  text-align: center;
}

.btn-cancel {
  width: 65px;
  height: 35px;
  outline: none;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  font-size: 12px;
  text-align: center;
}
</style>
