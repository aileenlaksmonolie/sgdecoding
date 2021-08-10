<template>
  <nav
    id="sidenav-main"
    class="navbar navbar-vertical fixed-left navbar-expand-md navbar-light bg-white">
    <div class="container-fluid">
      <!-- Toggler -->
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#sidenav-collapse-main"
        aria-controls="sidenav-main"
        aria-expanded="false"
        aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"/>
      </button>
      <!-- Brand -->
      <router-link
        class="navbar-brand pt-0 pb-0"
        to="/"
        exact>
        <img
          src="/static/images/nus_logo_2018.jpg"
          class="navbar-brand-img"
          alt="...">
        <img
          src="/static/images/ntu_logo_2018.jpg"
          class="navbar-brand-img"
          alt="...">
        <img
          src="/static/images/aisingapore.jpg"
          class="navbar-brand-img"
          alt="...">
      </router-link>
      <!-- User -->
      <ul class="nav align-items-center d-md-none">
        <li class="nav-item dropdown">
          <a
            class="nav-link nav-link-icon"
            href="#"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false">
            <i class="fas fa-bell"/>
          </a>
          <div
            id="dropdown-notification"
            class="dropdown-menu dropdown-menu-arrow"
            aria-labelledby="navbar-default_dropdown_1">
            <a
              class="dropdown-item"
              href="#">Action</a>
            <a
              class="dropdown-item"
              href="#">Another action</a>
            <div class="dropdown-divider"/>
            <a
              class="dropdown-item"
              href="#">Something else here</a>
          </div>
        </li>
        <li class="nav-item dropdown">
          <a
            class="nav-link"
            href="#"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false">
            <div class="media align-items-center">
              <span class="avatar avatar-sm rounded-circle">
                <img
                  alt="Image placeholder"
                  src="/static/images/user.png">
              </span>
            </div>
          </a>
          <div
            id="dropdown-user"
            class="dropdown-menu dropdown-menu-arrow">
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
      <!-- Collapse -->
      <div
        id="sidenav-collapse-main"
        class="collapse navbar-collapse">
        <!-- Collapse header -->
        <div class="navbar-collapse-header d-md-none">
          <div class="row">
            <div class="col-6 collapse-brand">
              <a href="../index.html">
                <img src="/static/assets/img/brand/blue.png">
              </a>
            </div>
            <div class="col-6 collapse-close">
              <button
                type="button"
                class="navbar-toggler"
                data-toggle="collapse"
                data-target="#sidenav-collapse-main"
                aria-controls="sidenav-main"
                aria-expanded="false"
                aria-label="Toggle sidenav">
                <span/>
                <span/>
              </button>
            </div>
          </div>
        </div>
        <!-- Form -->
        <form class="mt-4 mb-3 d-md-none">
          <div class="input-group input-group-rounded input-group-merge">
            <input
              type="search"
              class="form-control form-control-rounded form-control-prepended"
              placeholder="Search"
              aria-label="Search">
            <div class="input-group-prepend">
              <div class="input-group-text">
                <span class="fa fa-search"/>
              </div>
            </div>
          </div>
        </form>
        <!-- Navigation -->
        <ul
          class="navbar-nav">
          <li
            v-if="$store.state.user.featuresCanUse.includes('offline')"
            class="nav-item">
            <router-link
              class="nav-link"
              to="/"
              exact>
              <i class="far fa-desktop text-primary"/>Offline Decoder
            </router-link>
          </li>
          <li
            v-if="$store.state.user.featuresCanUse.includes('online')"
            class="nav-item">
            <router-link
              class="nav-link"
              to="/online-decoder"
              exact>
              <i class="fa fa-microphone text-success"/>Streaming Decoder
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link"
              to="/profile"
              exact>
              <i class="fas fa-user text-yellow"/> User profile
            </router-link>
          </li>
          <li
            v-if="$store.state.user.role === 'admin'"
            class="nav-item">
            <router-link
              class="nav-link"
              to="/users"
              exact>
              <i class="fa fa-users text-danger"/> Manage users
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  mounted () {
    const dropdownNotification = document.getElementById('dropdown-notification')
    const dropdownUser = document.getElementById('dropdown-user')
    if (window.innerWidth >= 424) {
      dropdownNotification.classList.add('dropdown-menu-right')
      dropdownUser.classList.add('dropdown-menu-right')
    } else {
      dropdownNotification.classList.add('dropdown-menu-left')
      dropdownUser.classList.add('dropdown-menu-left')
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  padding-left: 1rem !important;
  padding-right: 1rem !important;
  .navbar-brand {
    img {
      width: 75px !important;
    }
  }
  .nav-link.active {
    background: #e8e8e8b8;
  }
}

.navbar-vertical .navbar-brand {
  margin-right: auto;
  margin-left: auto;
}

@media (min-width: 768px) {
  .navbar-vertical.navbar-expand-md .navbar-brand-img {
    max-height: 5rem !important;
  }
  .navbar-vertical .navbar-collapse:before {
    margin: 0.7rem -1rem;
  }
}

@media (max-width: 420px) {
  .navbar {
    ul.nav {
      width: 100%;
      display: flex;
      justify-content: center;
    }
  }
}

@media (max-width: 324px) {
  .navbar {
    .navbar-brand {
      img {
        width: 70px !important;
      }
    }
  }
}

@media (max-width: 308px) {
  .navbar {
    .navbar-brand {
      img {
        width: 65px !important;
      }
    }
  }
}
</style>
