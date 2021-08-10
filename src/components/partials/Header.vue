<template>
  <div>
    <!-- Top navbar -->
    <nav
      id="navbar-main"
      class="navbar navbar-top navbar-expand-md navbar-dark">
      <div class="container-fluid">
        <!-- Brand -->
        <router-link
          class="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
          to="/">SG Decoding System</router-link>
        <!-- Form -->
        <form
          v-if="$route.name === 'Home'"
          class="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto"
          @submit.prevent>
          <div class="form-group mb-0">
            <div class="input-group input-group-alternative">
              <div class="input-group-prepend">
                <span class="input-group-text"><i class="fas fa-search"/></span>
              </div>
              <input
                v-model.lazy="txtSearch"
                class="form-control"
                placeholder="Search by filename..."
                type="text"
                @keyup.enter="onInputChange"
                @change="onInputChange">
            </div>
          </div>
        </form>
        <!-- User -->
        <ul class="navbar-nav align-items-center d-none d-md-flex">
          <li class="nav-item dropdown">
            <a
              class="nav-link pr-0"
              href="#"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false">
              <div class="media align-items-center">
                <span
                  class="avatar avatar-sm rounded-circle"
                  style="background-color: #ffffff;">
                  <img
                    alt="Image placeholder"
                    src="/static/images/user.png">
                </span>
                <div class="media-body ml-2 d-none d-lg-block">
                  <span class="mb-0 text-sm  font-weight-bold">{{ $store.state.user.username }}</span>
                </div>
              </div>
            </a>
            <div class="dropdown-menu dropdown-menu-arrow dropdown-menu-right">
              <div class=" dropdown-header noti-title">
                <h6 class="text-overflow m-0">Welcome!</h6>
              </div>
              <router-link
                to="/profile"
                class="dropdown-item">
                <i class="fas fa-user"/>
                <span>My profile</span>
              </router-link>
              <a
                href="../examples/profile.html"
                class="dropdown-item">
                <i class="fas fa-cog"/>
                <span>Settings</span>
              </a>
              <a
                href="../examples/profile.html"
                class="dropdown-item">
                <i class="far fa-calendar-alt"/>
                <span>Activity</span>
              </a>
              <a
                href="../examples/profile.html"
                class="dropdown-item">
                <i class="far fa-life-ring"/>
                <span>Support</span>
              </a>
              <div class="dropdown-divider"/>
              <a
                href="#"
                class="dropdown-item"
                @click="$store.dispatch('logout')">
                <i class="far fa-sign-out"/>
                <span>Logout</span>
              </a>
            </div>
          </li>
        </ul>
      </div>
    </nav>
    <!-- Header -->
    <div class="header bg-gradient-primary pb-7 pt-5 pt-md-8"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      txtSearch: ''
    }
  },
  computed: {
    ...mapState([
      'searchQuery'
    ])
  },
  methods: {
    onInputChange () {
      this.$store.commit('UPDATE_SEARCH_QUERY', { searchQuery: this.txtSearch })
    }
  }
}
</script>

<style>

</style>
