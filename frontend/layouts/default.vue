<script>
import twemoji from 'twemoji';
import { getToken } from 'firebase/messaging';
import { doc, updateDoc, collection } from 'firebase/firestore';

export default {
  data() {
    return {
      interval: ''
    }
  },
  async mounted() {
    this.twemojify();
    this.interval = setInterval(this.twemojify, 1000);
    if (useCookie('user') != null) {
      await this.fcmAccess();
    }
  },
  unmounted() {
    clearInterval(this.interval);
  },
  methods: {
    twemojify() {
      twemoji.parse(document.body, {
        folder: 'svg',
        ext: '.svg'
      });
    },
    async fcmAccess() {
      try {
        const token = await getToken(this.$messaging, {
          vapidKey: 'BOWkO9MiCaIgLeFhf8j9VnmqfKHHG8TVh5mrIIhZFAKImscr-TA1uc0OhSETZm6XS5sC-liSHPgpqqqayOb266s'
        });
        await updateDoc(doc(collection(this.$firestore, 'users'), useCookie('user').value.uid), {
          fcmToken: token
        });
      }
      catch (error) {
        console.error(error);
      }
    }
  }
};
</script>

<template>
  <slot />
</template>
