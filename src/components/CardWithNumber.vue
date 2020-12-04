<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">
        {{ title }}
      </p>
    </header>
    <div
      v-for="(item, index) in array"
      :key="title + index"
      :class="{ 'card__content_red': item <= 10}"
      class="card__content"
    >
      {{ index }}
      <b-tag
        type="is-info"
        rounded
      >
        {{ item }}
      </b-tag>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CardWithNumber',
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
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card__content:not(:last-child) {
  border-bottom: 1px solid #dbdbdb;
}

.card__content_red {
  background-color: lavenderblush;
}
</style>
