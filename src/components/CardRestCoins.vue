<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">
        {{ title }}
      </p>
    </header>
    <div class="card__content">
      <p
        v-for="(value, name, index) in list"
        :key="'coins-' + index"
      >
        {{ name }}: {{ value }}
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CardRestCoins',
    props: {
      list: {
        type: Object,
        required: true
      },
      title: {
        type: String,
        required: true
      }
    }
  };
</script>

<style scoped>
  .card__content {
    padding: 20px;
  }

  .card__content:not(:last-child) {
    border-bottom: 1px solid #dbdbdb;
    padding: 0.75rem;
  }
</style>
