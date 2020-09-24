<template>
  <div>
    <div class="columns is-multiline">
      <div
        v-for="(item, name) in data"
        :key="name"
        class="column"
      >
        <content-card
          :title="name"
          :array="item"
        />
      </div>
    </div>
    <h2 class="title-4">
      Закрепить объект за техником
    </h2>
    <b-select
      v-model="tech"
      placeholder="Техник"
      style="width: 100%; margin-bottom: 20px;"
    >
      <option
        v-for="item in techs"
        :key="item.id"
        :value="item.id"
      >
        {{ item.name }}
      </option>
    </b-select>
    <div
      v-for="item in carWashList"
      :key="item.id"
      class="field"
      style="display: inline-block; margin-right: 20px;"
    >
      <b-checkbox
        v-model="objectForTech"
        :native-value="item.id"
        type="is-danger"
      >
        {{ item.car_wash_addr }}
      </b-checkbox>
    </div>
    <button
      class="button is-info is-fullwidth"
      @click="objectForTechHandle"
    >
      Применить
    </button>
  </div>
</template>

<script>
  import axios from 'axios';
  import table from '../components/mixins/table';
  import getList from '../components/mixins/getList';
  import ContentCard from '../components/ContentCard';

  export default {
    name: 'AdmTechs',
    components: { ContentCard },
    mixins: [table, getList],
    data() {
      return {
        data: null,
        tech: null,
        objectForTech: []
      };
    },
    mounted() {
      this.getData();
      this.getTechs();
      this.getCarWashList();
    },
    methods: {
      getData(more) {
        this.loading = true;
        const url = `${process.env.VUE_APP_API}admTehs/`;
        const config = {
          params: {},
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
            }
            this.loading = false;
          })
          .catch(() => {
            this.$router.push('/login');
          });
      },
      objectForTechHandle() {
        const data = new FormData();
        data.set('teh', this.tech);
        for (let i = 0; i < this.objectForTech.length; i++) {
          data.append('car_wash', this.objectForTech[i]);
        }
        console.log(data);

        axios.post(`${process.env.VUE_APP_API}admTehs/`, data, this.$store.getters.config)
          .then(() => {
            this.getData();
            this.objectForTech = [];
            this.tech = null;
          })
          .catch(() => {
            //
          });
        console.log(this.objectForTech);
      }
    }
  };
</script>

<style>
.b-checkbox.checkbox .check.is-danger {
  box-shadow: none !important;
}
.b-checkbox.checkbox input[type=checkbox]:checked+.check.is-danger {
  background-color: #f14668;
  border-color: #f14668;
}

.b-checkbox.checkbox:hover input[type=checkbox]:not(:disabled)+.check.is-danger {
  border-color: #f14668;
}
</style>
