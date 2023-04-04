<script>
import twemoji from 'twemoji';
import { getToken } from 'firebase/messaging';
import { doc, updateDoc } from 'firebase/firestore';

export default {
  data() {
    return {
      interval: ''
    }
  },
  async mounted() {
    this.twemojify();
    this.interval = setInterval(this.twemojify, 1000);
    await this.notifyUser();
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
    async notifyUser() {
      try {
        const token = await getToken(this.$messaging, { 
            vapidKey: 'BOWkO9MiCaIgLeFhf8j9VnmqfKHHG8TVh5mrIIhZFAKImscr-TA1uc0OhSETZm6XS5sC-liSHPgpqqqayOb266s' 
        });
        if (token) {
          await updateDoc(doc(this.$firestore, 'users', useCookie('user').uid), {
            fcmToken: token
          });
        }
        else {
          console.log('No registration token available. Request permission to generate one.');
        }
      }
      catch(error) {
        console.error(error);
      };
    }
  }
};
</script>

<template>
  <slot />
</template>
