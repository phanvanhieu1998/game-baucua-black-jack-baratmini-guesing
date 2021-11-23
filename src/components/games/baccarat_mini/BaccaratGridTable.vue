/* eslint-disable no-mixed-spaces-and-tabs */
<template>
  <div class="baccarat__mini">
    <table>
      <tr v-for="i in r_arr" :key="i">
        <td v-for="j in c_arr" :key="j">
          <div class="item" :class="result_caculate[i][j]">
            <span>D</span>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: ["arr_input"],
  data() {
    return {
      col: 75,
      row: 13,
      c_arr: [],
      r_arr: [],
    };
  },
  methods: {
    alertLastHand() {
      this.$notify.info({
        message: "NEXT HAND IS THE LAST HAND OF THE SHOE",
      });
    },
  },
  created() {
    for (let i = 0; i < this.col; i++) this.c_arr.push(i);
    for (let i = 0; i < this.row; i++) this.r_arr.push(i);
  },
  watch: {
    totalGames(newVal, oldVal) {
      if (newVal === 83 && newVal !== oldVal) {
        this.alertLastHand();
      }
    },
  },
  computed: {
    result_caculate() {
      let table = [];
      let row = this.row;
      let col = this.col;
      const arr = this.arr_input;

      function create_table() {
        table = [];
        for (let i = 0; i < row; i++) {
          let tg = [];

          for (let j = 0; j < col; j++) {
            tg.push(null);
          }

          table.push(tg);
        }
      }
      create_table();

      let r = 0;
      let c = 0;
      let c_change = 0;
      // điền ô đầu tiên
      table[r][c] = arr[0];

      // Đệ quy lấy giá trị trước t
      const getLatestPreVal = (table, row, col) => {
        const find_prev = (row) => {
          let prev = table[row][col];
          prev = prev !== null ? prev[0] : "t";

          if (prev === "t") {
            row = row - 1;
            if (row >= 0) {
              prev = find_prev(row);
            } else {
              return prev;
            }
          } else {
            return prev;
          }

          return prev;
        };

        return find_prev(row);
      };

      for (let i = 1; i < arr.length; i++) {
        //Tạo dòng trắng ở giữa bảng
        if (r === 5) r = r + 1;

        /*
         * Mô tả bảng:
         * Tie không được coi là thay đổi kết quả
         * Banker và banker dragon là cùng 1 kết quả, tương tự Player cũng thế
         * Chỉ sang cột tiếp theo khi có thay đổi từ Banker (D) <=> Player (D)
         */

        //B, P, BD, PD - mảng chart nên chỉ cần so sánh [0] với nhau là biết được thay đổi
        //console.log(getLatestPreVal(table, r, c));
        if (
          arr[i - 1][0] === arr[i][0] ||
          arr[i][0] === "t" ||
          (getLatestPreVal(table, r, c) !== null &&
            getLatestPreVal(table, r, c) === arr[i][0]) ||
          getLatestPreVal(table, r, c) === "t" //Xác định phần tử = t đầu tiên
        ) {
          // nếu chưa điền đến ô 12
          if (r < 12) {
            // nếu ô kế tiếp không null hoặc chúng ta đã nhẩy sang cột khác thì tiếp tục điền sang cột tiếp theo cùng hàng
            if (table[r + 1][c] != null || c != c_change) {
              table[r][++c] = arr[i];
            }
            // nếu ô kế tiếp null
            else if (table[r + 1][c] == null) {
              table[++r][c] = arr[i];
            }
          }
          // nếu ô 12 đã được điền
          else {
            table[r][++c] = arr[i];
          }
        }
        //  nếu không bằng điền vào cột tiếp theo
        else {
          c_change++;
          c = c_change;
          r = 0;
          table[r][c] = arr[i];
        }
      }
      return table;
    },

    totalGames() {
      return this.arr_input.length;
    },
  },
};
</script>
<style>
.baccarat__mini::-webkit-scrollbar {
  height: 4px;
  width: 4px;
  background: grey;
}

.baccarat__mini::-webkit-scrollbar-track {
  border-radius: 10px;
}

.baccarat__mini::-webkit-scrollbar-thumb {
  border-radius: 10px;

  background: black;
}
.baccarat__mini {
  overflow-x: scroll;
}
.baccarat__mini table {
  background-color: #ffff;
  border-bottom: 1px solid rgb(215 215 215);
  border-collapse: collapse;
}
.baccarat__mini table tr:nth-child(7) td {
  background-color: #fff3d0;
}
.baccarat__mini table tr:nth-child(7) td .item {
  height: 2px;
}
.baccarat__mini th {
  border: 1px solid rgb(215 215 215);
  border-collapse: collapse;
}
.baccarat__mini td {
  border: 1px solid rgb(215 215 215);
  border-collapse: collapse;
}
.baccarat__mini .item {
  width: 16px;
  height: 16px;
  padding: 0px;
  margin: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.baccarat__mini .item span {
  display: none;
}
.baccarat__mini .pd {
  background-color: #00f;
}
.baccarat__mini .pd span {
  display: inline;
  color: white;
  font-weight: 300;
  font-size: 11px;
}
.baccarat__mini .bd {
  background-color: red;
}
.baccarat__mini .bd span {
  display: inline;
  color: white;
  font-weight: 400;
  font-size: 11px;
}
.baccarat__mini .p {
  background-color: #00f;
}
.baccarat__mini .b {
  background-color: red;
}
.baccarat__mini .t {
  background-color: #4caf50;
}
</style>
