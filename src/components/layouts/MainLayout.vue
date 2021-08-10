<template>
  <div v-if="$store.state.user">
    <Sidebar/>
    <div class="main-content">
      <Header/>
      <router-view />
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/partials/Sidebar'
import Header from '@/components/partials/Header'
import Footer from '@/components/partials/Footer'
export default {
  components: {
    Sidebar,
    Header,
    Footer
  },
  watch: {
    '$route' (to, from) {
      if (to.meta.feature && !this.$store.state.user.featuresCanUse.includes(to.meta.feature)) {
        this.$swal({
          title: 'Permission denied!',
          text: 'You don\'t have permission to view this page',
          icon: 'warning',
          buttons: {
            catch: {
              text: 'OK'
            }
          },
          dangerMode: true
        })
          .then((willChange) => {
            window.location.href = '/profile'
          })
      }
    }
  },
  async created () {
    if (!this.$store.state.user) { // in case user in mainlayout and reload
      await this.$store.dispatch('getUser')
    }

    if (!this.$root.socket && this.$store.state.user) { // in case user in mainlayout or from login
      this.$root.initSockets()
    }
  }
}
</script>

<style>

</style>
