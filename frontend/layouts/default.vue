<script>
import twemoji from 'twemoji';

export default {
  mounted() {
    this.twemojify();
    setInterval(this.twemojify, 1000);
  },
  methods: {
    twemojify() {
      twemoji.parse(document.body, {
        folder: 'svg',
        ext: '.svg'
      });
    }
  }
};
</script>

<template>
  <slot />
</template>
