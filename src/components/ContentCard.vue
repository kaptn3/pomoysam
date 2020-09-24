<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">
        {{ title }}
      </p>
    </header>
    <div
      v-for="item in array"
      :key="item"
      class="card__content"
    >
      {{ item }}
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ContentCard',
    props: {
      array: {
        type: Array,
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
  .card-header-title {
    background: #d2463f;
    color: #fff;
  }

  .card__content {
    padding: 20px;
  }

  .card__content:not(:last-child) {
    border-bottom: 1px solid #dbdbdb;
    padding: 0.75rem;
  }
</style>
