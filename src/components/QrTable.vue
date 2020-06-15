<template>
  <section>
    <b-field
      class="group"
      grouped
    >
      <b-datepicker
        v-model="dateFrom"
        placeholder="Дата от"
        icon="calendar-today"
        editable
      />
      <b-datepicker
        v-model="dateTo"
        placeholder="Дата до"
        icon="calendar-today"
        editable
      />
      <b-input
        v-model="phoneStr"
        maxlength="11"
        placeholder="Телефон"
      />
      <b-select
        v-model="promoId"
        placeholder="Промо-код"
        style="max-width: 222px;"
      >
        <option
          v-for="option in promoList"
          :key="option.id"
          :value="option.id"
        >
          {{ option.code }}
        </option>
      </b-select>
      <b-select
        v-model="active"
        placeholder="Активность"
        style="max-width: 222px;"
      >
        <option value="1">
          Показать активные QR-коды
        </option>
        <option value="0">
          Показать использованные QR-коды
        </option>
      </b-select>
      <b-select
        v-model="buyCoins"
        placeholder="Жетоны, купленные за баллы"
        style="max-width: 222px;"
      >
        <option value="0">
          Показать только купленные за баллы
        </option>
        <option value="1">
          Показать все, кроме купленных за баллы
        </option>
      </b-select>
      <b-select
        v-model="freeQr"
        placeholder="Начисленный QR-код"
        style="max-width: 222px;"
      >
        <option value="1">
          Показать только начисленные
        </option>
        <option value="0">
          Показать только неначисленные
        </option>
      </b-select>
      <div class="buttons">
        <b-button
          type="is-info"
          @click="applyFilters(false)"
        >
          Применить
        </b-button>
        <b-button
          type="is-info"
          outlined
          @click="resetFilters"
        >
          Сбросить
        </b-button>
      </div>
    </b-field>
    <div class="columns justify-between">
      <p class="column total-users">
        Всего записей: <strong>{{ cnt }}</strong>
      </p>
      <div class="column">
        <b-button
          type="is-info"
          outlined
          @click="isModalActive = true"
        >
          Начислить бесплатные жетоны
        </b-button>
      </div>
    </div>
    <div class="columns is-multiline">
      <div
        v-for="(item, index) in cards"
        :key="index + 'cards-by-object'"
        class="column is-3"
      >
        <card
          :object="item.object"
          :title="item.title"
        />
      </div>
    </div>
    <b-table
      :data="body"
      :columns="head"
      :loading="loading"
      :hoverable="true"
      :mobile-cards="true"
      :row-class="(row, index) => (index + 1) % 30 === 0 && 'is-info'"
      @click="getUsedQrInfo"
    >
      <template slot="empty">
        <section class="content has-text-grey has-text-centered">
          <p>Данные не найдены</p>
        </section>
      </template>
    </b-table>
    <b-button
      class="see-more is-fullwidth"
      size="is-medium"
      type="is-info"
      @click="seeMore"
    >
      Показать ещё
    </b-button>
    <b-modal
      :active.sync="isModalActive"
      :width="640"
      scroll="keep"
    >
      <adm-used-qr-info
        v-if="qrCode"
        :qr-code="qrCode"
      />
      <create-free-qr v-if="!qrCode" />
    </b-modal>
  </section>
</template>

<script>
  import axios from 'axios';
  import Card from './Card';
  import AdmUsedQrInfo from './AdmUsedQrInfo';
  import CreateFreeQr from './CreateFreeQr';
  import table from './mixins/table';

  export default {
    name: 'QrTable',
    components: { Card, AdmUsedQrInfo, CreateFreeQr },
    mixins: [table],
    data() {
      return {
        active: null,
        phoneStr: null,
        promoList: [],
        promoId: null,
        isModalActive: false,
        qrCode: '',
        freeQr: null,
        cards: [],
        buyCoins: null,
        head: [
          {
            field: 'pay_date',
            label: 'Дата платежа'
          },
          {
            field: 'coins4m',
            label: 'Жетонов на 4 минуты'
          },
          {
            field: 'coins2m',
            label: 'Жетонов на 2 минуты'
          },
          {
            field: 'free_qr',
            label: 'Начисленный QR-код'
          },
          {
            field: 'qr_code',
            label: 'QR-код'
          },
          {
            field: 'user_phone',
            label: 'Номер телефона'
          },
          {
            field: 'active',
            label: 'Активность'
          },
          {
            field: 'free_comment',
            label: 'Комментарий'
          }
        ]
      };
    },
    computed: {
      body() {
        const body = this.data;

        for (let i = 0; i < this.data.length; i++) {
          body[i].free_qr = (this.data[i].free_qr !== true && this.data[i].free_qr !== '✔') ? '-' : '✔';
          body[i].active = (this.data[i].active !== true && this.data[i].active !== '✔') ? '-' : '✔';
          body[i].free_comment = body[i].free_comment || '-';
        }

        return body;
      }
    },
    watch: {
      isModalActive() {
        if (!this.isModalActive) {
          if (this.qrCode) {
            this.qrCode = '';
          }
        }
      }
    },
    mounted() {
      this.getPromoList();
      this.getData();
    },
    methods: {
      getUsedQrInfo(row) {
        if (row.active === '-') {
          this.qrCode = row.qr_code;
          this.isModalActive = true;
        }
      },
      resetFilters() {
        this.resetArray(['phoneStr', 'promoId', 'active', 'freeQr', 'buyCoins']);
      },
      getPromoList() {
        const url = `${process.env.VUE_APP_API}promoList/`;
        axios.get(url)
          .then((res) => {
            this.promoList = res.data;
          })
          .catch(() => {
            this.$router.push('/login');
          });
      },
      getData(more) {
        this.loading = true;
        const url = `${process.env.VUE_APP_API}admQR/`;
        const config = {
          params: {
            date_from: this.dateFromString,
            date_to: this.dateToString,
            page: this.page,
            phone_str: this.phoneStr,
            promo_id: this.promoId,
            active: this.active,
            free_qr: this.freeQr,
            pay_from_cashback: this.buyCoins
          },
          headers: {
            Authorization: `Token ${this.$store.state.token}`
          }
        };
        axios
          .get(url, config)
          .then((res) => {
            if (more) {
              this.data = this.data.concat(res.data.resp);
            } else {
              this.data = res.data.resp;
              const cards = [
                {
                  title: 'Количество жетонов, купленное за баллы',
                  object: res.data.cash_back_coins
                },
                {
                  title: 'Количество жетонов, купленное по скидочным промокодам',
                  object: res.data.total_discount_qrs
                },
                {
                  title: 'Начисленные жетоны',
                  object: res.data.total_free_coins
                },
                {
                  title: 'Общее количество жетонов',
                  object: res.data.total_coins
                }
              ];
              this.cards = [];
              for (let i = 0; i < cards.length; i++) {
                if (cards[i].object.total_summ) {
                  this.cards.push(cards[i]);
                }
              }
            }

            this.cnt = res.data.cnt;
            this.coinsByObject = res.data.coins_by_object;
            this.loading = false;
          })
          .catch(() => {
            this.$router.push('/login');
          });
      }
    }
  };
</script>
