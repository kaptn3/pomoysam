<template>
  <b-navbar
    type="is-info"
    class="navbar"
  >
    <template
      v-if="$store.state.token"
      slot="start"
    >
      <b-navbar-dropdown label="Меню">
        <b-navbar-item
          v-for="item in menu"
          :key="'menu-' + item.name"
          :to="item.link"
          tag="router-link"
        >
          {{ item.name }}
        </b-navbar-item>
      </b-navbar-dropdown>
      <b-navbar-item
        to="https://google.com"
        tag="a"
        target="_blank"
      >
        Оператор - техник
      </b-navbar-item>
    </template>

    <template
      v-if="$store.state.token"
      slot="end"
    >
      <b-navbar-item tag="div">
        <div class="buttons">
          <button
            class="button is-light"
            @click="logout"
          >
            Выйти
          </button>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
  export default {
    name: 'Menu',
    data() {
      return {
        menu: [
          {
            name: 'Зарегистрированные пользователи',
            link: '#'
          },
          {
            name: 'QR-коды',
            link: '#'
          },
          {
            name: 'Использованные QR-коды',
            link: '#'
          },
          {
            name: 'Разменные аппараты',
            link: '#'
          },
          {
            name: 'Выплаты',
            link: '#'
          },
          {
            name: 'Обращения пользователей',
            link: '#'
          },
          {
            name: 'Промо-коды',
            link: '#'
          },
          {
            name: 'FAQ',
            link: '#'
          },
          {
            name: 'Новости',
            link: '#'
          }
        ]
      };
    },
    methods: {
      logout() {
        this.$store.commit('logout');
        this.$router.push('/');
      }
    }
  };
</script>


<style>
  .router-link-active.navbar-item {
    background-color: #b2302a;
    font-weight: 500;
    color: #fff;
  }

  @media screen and (max-width: 1023px) {
    .navbar-menu {
      background-color: #d2463f;
    }
  }
</style>
