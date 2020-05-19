<template>
  <div id="app">
    <header class="header">
      <a-menu class="container"/>
    </header>
    <div class="container app__inner">
      <router-view/>
    </div>
  </div>
</template>

<script>
  import AMenu from '@/components/Menu';

  export default {
    components: { AMenu }
  };
</script>

<style lang="scss">
  @import "~bulma/sass/utilities/_all";

  $info: #d2463f;

  $colors: (
    "primary": ($primary, $primary-invert),
    "info": ($info, $info-invert)
);

  .app__inner {
    padding: 30px 15px;
  }

  .header {
    background-color: #d2463f;
    padding: 0 15px;
  }

  .group {
    align-items: flex-start;
  }

  .see-more {
    margin-top: 20px;
  }

  .total-users {
    font-size: 18px;
    margin-bottom: 20px;
  }

  .is-info td {
    border-bottom: 1px solid red !important;
  }

  @import "~bulma";
  @import "~buefy/src/scss/buefy";
</style>
