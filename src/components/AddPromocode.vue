<template>
  <div class="add-faq">
    <b-message
      v-if="status === 'ok'"
      type="is-success"
    >
      Готово
    </b-message>
    <b-message
      v-if="status === 'error'"
      type="is-warning"
    >
      Произошла ошибка
      <p>
        {{ statusText }}
      </p>
    </b-message>
    <form
      v-if="status === ''"
      @submit="submitForm"
    >
      <h2 class="title is-3">
        Добавить
      </h2>
      <b-field label="Промокод">
        <b-input
          v-model="code"
          maxlength="8"
          required
        />
      </b-field>
      <b-field label="Тип">
        <b-select
          v-model="type"
          placeholder="Тип"
          required
          expanded
        >
          <option value="0">
            Бесплатный QR код
          </option>
          <option value="1">
            Скидка
          </option>
        </b-select>
      </b-field>
      <b-field
        v-if="typeText === '0'"
        label="Жетонов на 4 мин"
      >
        <b-input
          v-model="coins4m"
          required
        />
      </b-field>
      <b-field
        v-if="typeText === '0'"
        label="Жетонов на 2 мин"
      >
        <b-input
          v-model="coins2m"
          required
        />
      </b-field>
      <b-field
        v-if="typeText === '1'"
        label="Скидка, %"
      >
        <b-input
          v-model="discount"
          required
        />
      </b-field>
      <b-field label="Активность">
        <b-select
          v-model="active"
          placeholder="Активность"
          label="Скидка, %"
          required
          expanded
        >
          <option value="1">
            Активный
          </option>
          <option value="0">
            Неактивный
          </option>
        </b-select>
      </b-field>
      <button class="button is-info is-fullwidth">
        {{ btnText }}
      </button>
    </form>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'AddPromocode',
    props: {
      row: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        status: '',
        typeText: null,
        codeText: null,
        activeText: null,
        coins2mText: 0,
        coins4mText: 0,
        discountText: 0,
        statusText: null
      };
    },
    computed: {
      active: {
        get() {
          if (this.row) {
            return this.row.active === '✔' ? '1' : '0';
          }
          return '';
        },
        set(value) {
          this.activeText = value;
        }
      },
      type: {
        get() {
          if (this.row) {
            return this.row.type === 'Скидка' ? '1' : '0';
          }
          return '';
        },
        set(value) {
          this.typeText = value;
        }
      },
      code: {
        get() {
          if (this.row) {
            return this.row.code;
          }
          return '';
        },
        set(value) {
          this.codeText = value;
        }
      },
      discount: {
        get() {
          if (this.row) {
            return this.row.discount_percent;
          }
          return '';
        },
        set(value) {
          this.discountText = value;
        }
      },
      coins2m: {
        get() {
          if (this.row) {
            return this.row.coins2m;
          }
          return '';
        },
        set(value) {
          this.coins2mText = value;
        }
      },
      coins4m: {
        get() {
          if (this.row) {
            return this.row.coins4m;
          }
          return '';
        },
        set(value) {
          this.coins4mText = value;
        }
      },
      btnText() {
        return this.row ? 'Сохранить' : 'Добавить';
      },
      url() {
        return `${process.env.VUE_APP_API}admPromo/`;
      }
    },
    mounted() {
      this.typeText = this.type;
      this.activeText = this.active;
    },
    methods: {
      submitForm(e) {
        e.preventDefault();
        const data = new FormData();
        data.set('type', this.typeText || this.type);
        data.set('active', this.activeText || this.active);
        data.set('coins2m', this.coins2mText || this.coins2m);
        data.set('coins4m', this.coins4mText || this.coins4m);
        data.set('code', this.codeText || this.code);
        data.set('discount_percent', this.discountText || this.discount);
        if (this.row) {
          data.set('id', this.row.id);
        }
        const method = this.row ? 'put' : 'post';
        axios({
          method,
          url: this.url,
          data,
          headers: {
            Authorization: `Token ${this.$store.state.token}`
          }
        })
          .then(() => {
            this.status = 'ok';
          })
          .catch((error) => {
            this.status = 'error';
            if (error.response.data.show) {
              this.statusText = error.response.data.error;
            }
          });
      }
    }
  };
</script>

<style scoped>
.add-faq {
  background-color: white;
  padding: 20px;
}
</style>
