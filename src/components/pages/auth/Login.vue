<template>
  <div class="bg-default">
    <div class="main-content">
      <!-- Navbar -->
      <nav class="navbar navbar-top navbar-horizontal navbar-expand-md navbar-dark">
        <div class="container px-4">
          <router-link
            class="navbar-brand pt-0 pb-0"
            to="/"
            exact>
            <img
              src="/static/images/logo_ntu.png"
              class="navbar-brand-img"
              alt="..."
              style="width: 175px; height: 75px;">
          </router-link>
          <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbar-collapse-main"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"/>
          </button>
          <div
            id="navbar-collapse-main"
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
                    data-target="#navbar-collapse-main"
                    aria-controls="sidenav-main"
                    aria-expanded="false"
                    aria-label="Toggle sidenav">
                    <span/>
                    <span/>
                  </button>
                </div>
              </div>
            </div>
            <!-- Navbar items -->
            <!-- <ul class="navbar-nav ml-auto">
              <li class="nav-item">
                <router-link
                  class="nav-link nav-link-icon"
                  to="/"
                  exact>
                  <i class="ni ni-planet"/>
                  <span class="nav-link-inner--text">Dashboard</span>
                </router-link>
              </li>
              <li class="nav-item">
                <router-link
                  class="nav-link nav-link-icon"
                  to="/register"
                  exact>
                  <i class="ni ni-circle-08"/>
                  <span class="nav-link-inner--text">Register</span>
                </router-link>
              </li>
              <li class="nav-item">
                <router-link
                  class="nav-link nav-link-icon"
                  to="/login"
                  exact>
                  <i class="ni ni-key-25"/>
                  <span class="nav-link-inner--text">Login</span>
                </router-link>
              </li>
              <li class="nav-item">
                <router-link
                  class="nav-link nav-link-icon"
                  to="/profile"
                  exact>
                  <i class="ni ni-single-02"/>
                  <span class="nav-link-inner--text">Profile</span>
                </router-link>
              </li>
            </ul> -->
          </div>
        </div>
      </nav>
      <!-- Header -->
      <div class="header bg-gradient-primary py-7 py-lg-7">
        <div class="container">
          <div class="header-body text-center mb-7">
            <div class="row justify-content-center">
              <div class="col-lg-5 col-md-6">
                <h1 class="text-white">Welcome!</h1>
                <p class="text-lead text-light">To our SG Decoding system. Login and try our features</p>
              </div>
            </div>
          </div>
        </div>
        <div class="separator separator-bottom separator-skew zindex-100">
          <svg
            x="0"
            y="0"
            viewBox="0 0 2560 100"
            preserveAspectRatio="none"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg">
            <polygon
              class="fill-default"
              points="2560 0 2560 100 0 100"/>
          </svg>
        </div>
      </div>
      <!-- Page content -->
      <div class="container mt--8 pb-5">
        <div class="row justify-content-center">
          <div class="col-lg-5 col-md-7">
            <div class="card bg-secondary shadow border-0">
              <div class="bg-transparent mt-2">
                <h2 class="text-muted text-center mt-2">Login</h2>
              </div>
              <div class="card-body px-lg-5 py-lg-5">
                <form role="form">
                  <div class="form-group mb-3">
                    <div class="input-group input-group-alternative">
                      <div class="input-group-prepend">
                        <span class="input-group-text"><i class="fal fa-envelope"/></span>
                      </div>
                      <input
                        v-model="credentials.email"
                        name="email"
                        autocomplete="current-email"
                        class="form-control"
                        placeholder="Email"
                        type="email"
                        @keyup.enter="login">
                    </div>
                  </div>
                  <div class="form-group">
                    <div class="input-group input-group-alternative">
                      <div class="input-group-prepend">
                        <span class="input-group-text"><i class="fal fa-unlock-alt"/></span>
                      </div>
                      <input
                        v-model="credentials.password"
                        name="password"
                        autocomplete="current-password"
                        class="form-control"
                        placeholder="Password"
                        type="password"
                        @keyup.enter="login">
                    </div>
                  </div>
                  <div class="custom-control custom-control-alternative custom-checkbox">
                    <input
                      id=" customCheckLogin"
                      v-model="credentials.rememberMe"
                      class="custom-control-input"
                      type="checkbox">
                    <label
                      class="custom-control-label"
                      for=" customCheckLogin">
                      <span class="text-muted">Remember me</span>
                    </label>
                  </div>
                  <div class="text-center">
                    <button
                      class="btn btn-primary my-4"
                      @click.prevent="login">Sign in</button>
                  </div>
                </form>
              </div>
            </div>
            <div class="row mt-3">
              <div class="col-6">
                <a
                  href="#"
                  class="text-light"><small>Forgot password?</small></a>
              </div>
              <!-- <div class="col-6 text-right">
                <router-link
                  to="/register"
                  class="text-light"><small>Create new account</small></router-link>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Footer -->
    <footer>
      <div class="container">
        <div class="row align-items-center justify-content-xl-between">
          <div class="col-xl-6">
            <div class="copyright text-center text-xl-left text-muted">
              &copy; 2019 <a
                href="http://temasek-labs.ntu.edu.sg/Research/researchstaff/Pages/Speech-Recognition.aspx"
                class="font-weight-bold ml-1"
                target="_blank">Speech lab</a>
            </div>
          </div>
          <div class="col-xl-6">
            <ul class="nav nav-footer justify-content-center justify-content-xl-end">
              <li class="nav-item">
                <a
                  href="http://temasek-labs.ntu.edu.sg/Research/researchstaff/Pages/Speech-Recognition.aspx"
                  class="nav-link"
                  target="_blank">Speech lab</a>
              </li>
              <li class="nav-item">
                <a
                  href="http://temasek-labs.ntu.edu.sg/Research/researchstaff/Pages/Speech-Recognition.aspx"
                  class="nav-link"
                  target="_blank">About Us</a>
              </li>
              <li class="nav-item">
                <a
                  href="http://temasek-labs.ntu.edu.sg/Research/ResearchAreas/Pages/Speech%20Recognition.aspx"
                  class="nav-link"
                  target="_blank">Blog</a>
              </li>
              <li class="nav-item">
                <a
                  href="http://temasek-labs.ntu.edu.sg/Research/researchstaff/Pages/Speech-Recognition.aspx"
                  class="nav-link"
                  target="_blank">MIT License</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  data () {
    return {
      credentials: {
        email: '',
        password: '',
        rememberMe: false
      }
    }
  },
  async created () { // if user already loggin then he try to go to login page -> redirect him to home page
    try {
      await this.$store.dispatch('getUser')
      if (this.$store.state.user) {
        this.$router.push('/')
      }
    } catch (error) {
      console.log(error)
    }
  },
  methods: {
    async login () {
      try {
        await this.$store.dispatch('login', {
          credentials: {
            email: this.credentials.email.trim(),
            password: this.credentials.password.trim(),
            rememberMe: this.credentials.rememberMe
          },
          vm: this
        })
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="scss">
.bg-default {
  height: 100vh;
}
</style>
