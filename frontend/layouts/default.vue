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
    if (useCookie('user', { sameSite: 'none', secure: true })?.value != null) {
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
          vapidKey: 'BE-Q2JjRYQJGQ8xIXtDv35i0dnnCXHZx9SF2h1o5yeHOzJ-4QXH5VUpg5P7C7ANgAeY-kUOq40SjPHrpz3Zb_5g'
        });
        await updateDoc(doc(collection(this.$firestore, 'users'), useCookie('user', { sameSite: 'none', secure: true }).value.uid), {
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
