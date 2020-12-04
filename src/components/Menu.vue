<template>
  <b-navbar
    type="is-info"
    class="navbar"
  >
    <template
      v-if="$store.state.token"
      slot="start"
    >
      <b-navbar-dropdown label="Мобильное приложение">
        <b-navbar-item
          v-for="(item, index) in menu"
          :key="'menu-item-' + index"
          :to="item.link"
          tag="router-link"
        >
          {{ item.name }}
        </b-navbar-item>
      </b-navbar-dropdown>
      <b-navbar-dropdown label="Разменные аппараты">
        <b-navbar-item
          v-for="(item, index) in menuRazmen"
          :key="'menu-item-razmen-' + index"
          :to="item.link"
          tag="router-link"
        >
          {{ item.name }}
        </b-navbar-item>
      </b-navbar-dropdown>
      <b-navbar-dropdown label="Оператор-техник">
        <b-navbar-item
          v-for="(item, index) in menuTech"
          :key="'menu-item-operator-' + index"
          :to="item.link"
          tag="router-link"
        >
          {{ item.name }}
        </b-navbar-item>
      </b-navbar-dropdown>
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
            link: '/adm-users'
          },
          {
            name: 'Обращения пользователей',
            link: '/adm-user-request'
          },
          {
            name: 'QR-коды',
            link: '/adm-qr'
          },
          {
            name: 'Использованные QR-коды',
            link: '/adm-used-qr'
          },
          {
            name: 'История начислений бонусных баллов',
            link: 'cashback-story'
          },
          {
            name: 'Промо-коды',
            link: '/promocodes'
          },
          {
            name: 'Использованные промокоды',
            link: '/used-promo'
          },
          {
            name: 'FAQ',
            link: '/faq'
          },
          {
            name: 'Новости',
            link: '/news'
          }
        ],
        menuRazmen: [
          {
            name: 'Статистика',
            link: '/adm-razmen-statistic'
          },
          {
            name: 'Выплаты',
            link: '/adm-cash-outs'
          }
        ],
        menuTech: [
          {
            name: 'Статистика по неисправностям',
            link: '/broken-stat'
          },
          {
            name: 'Учет химии',
            link: '/chem'
          },
          {
            name: 'Остатки химии',
            link: '/rest-chem'
          },
          {
            name: 'Управление техниками',
            link: '/techs'
          },
          {
            name: 'Показания счетчиков воды',
            link: '/water-counters'
          },
          {
            name: 'Показания счетчков эл.энергии',
            link: '/energy-counters'
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
