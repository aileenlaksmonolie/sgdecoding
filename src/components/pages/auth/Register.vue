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
                  <router-link to="/">
                    <img src="/static/assets/img/brand/blue.png">
                  </router-link>
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
            <ul class="navbar-nav ml-auto">
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
            </ul>
          </div>
        </div>
      </nav>
      <!-- Header -->
      <div class="header bg-gradient-primary py-7 py-lg-8">
        <div class="container">
          <div class="header-body text-center mb-7">
            <div class="row justify-content-center">
              <div class="col-lg-5 col-md-6">
                <h1 class="text-white">Welcome!</h1>
                <p class="text-lead text-light">Use these awesome forms to login or create new account in your project for free.</p>
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
                <h2 class="text-muted text-center mt-2">Register</h2>
              </div>
              <div class="card-body px-lg-5 py-lg-5 mt--4">
                <form role="form">
                  <div class="form-group">
                    <div class="input-group input-group-alternative mb-3">
                      <div class="input-group-prepend">
                        <span class="input-group-text"><i class="ni ni-hat-3"/></span>
                      </div>
                      <input
                        v-model="credentials.username"
                        name="username"
                        autocomplete="current-username"
                        class="form-control"
                        placeholder="Username"
                        type="text"
                        @input="onInputChanged">
                    </div>
                  </div>
                  <div class="form-group">
                    <div class="input-group input-group-alternative mb-3">
                      <div class="input-group-prepend">
                        <span class="input-group-text"><i class="ni ni-email-83"/></span>
                      </div>
                      <input
                        v-model="credentials.email"
                        name="email"
                        autocomplete="current-email"
                        class="form-control"
                        placeholder="Email"
                        type="email"
                        @input="onInputChanged">
                    </div>
                  </div>
                  <div class="form-group">
                    <div class="input-group input-group-alternative">
                      <div class="input-group-prepend">
                        <span class="input-group-text"><i class="ni ni-lock-circle-open"/></span>
                      </div>
                      <input
                        v-model="credentials.password"
                        name="password"
                        autocomplete="current-password"
                        class="form-control"
                        placeholder="Password"
                        type="password"
                        @input="onInputChanged">
                    </div>
                  </div>
                  <div class="text-muted font-italic">
                    <small>
                      Password strength:
                      <span
                        :class="{
                          'text-black': passwordStrength === 0,
                          'text-red': passwordStrength === 2,
                          'text-yellow': passwordStrength === 3,
                          'text-blue': passwordStrength === 4,
                          'text-cyan': passwordStrength === 5,
                          'text-green': passwordStrength === 6,
                        }"
                        class="font-weight-700">
                        <span v-if="passwordStrength === 0">Very bad</span>
                        <span v-if="passwordStrength === 2">Bad</span>
                        <span v-if="passwordStrength === 3">Normal</span>
                        <span v-if="passwordStrength === 4">Good</span>
                        <span v-if="passwordStrength === 5">Very good</span>
                        <span v-if="passwordStrength === 6">Excellent</span>
                      </span>
                    </small>
                  </div>
                  <div class="row my-4">
                    <div class="col-12">
                      <div class="custom-control custom-control-alternative custom-checkbox">
                        <input
                          id="customCheckRegister"
                          v-model="isAgree"
                          class="custom-control-input"
                          type="checkbox"
                          @change="onCheckboxChange">
                        <label
                          class="custom-control-label"
                          for="customCheckRegister">
                          <span class="text-muted">I agree with the <a href="#!">Privacy Policy</a></span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="error.message && error.message.length"
                    class="alert alert-danger alert-dismissible fade show"
                    role="alert">
                    <span class="alert-inner--text"><strong>Error!</strong> {{ error.message }}</span>
                    <button
                      type="button"
                      class="close"
                      data-dismiss="alert"
                      aria-label="Close"
                      @click="closeError">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="text-center">
                    <button
                      class="btn btn-primary mt-4"
                      @click.prevent="register">Create account</button>
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
              <div class="col-6 text-right">
                <a
                  href="#"
                  class="text-light"><small>Create new account</small></a>
              </div>
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
        username: '',
        email: '',
        password: ''
      },
      isAgree: false,
      error: {}
    }
  },
  computed: {
    passwordStrength () {
      const password = this.credentials.password.trim()
      let score = 0
      const regularExp = {
        containsNumber: /\d+/,
        containsLowerAlphabet: /[a-zA-Z]/,
        containsUpperAlphabet: /[A-Z]/,
        containsSpecialChars: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/
      }
      if (password.length) {
        score++
      }

      if (password.length >= 6) {
        score++
      }

      if (regularExp.containsNumber.test(password)) {
        score++
      }
      if (regularExp.containsLowerAlphabet.test(password)) {
        score++
      }
      if (regularExp.containsUpperAlphabet.test(password)) {
        score++
      }
      if (regularExp.containsSpecialChars.test(password)) {
        score++
      }

      return score
    }
  },
  mounted () {
    document.addEventListener('keyup', (e) => {
      if (e.keyCode === 13) { // listen for Enter keyup event, if press Enter then we call method `register`
        this.register()
      }
    })
  },
  methods: {
    async register () {
      if (!this.isAgree) {
        this.$set(this.error, 'message', 'Please read and agree with out Privacy Policy')
        return
      }
      try {
        const response = await this.$http.post('/users/register', {
          username: this.credentials.username,
          email: this.credentials.email,
          password: this.credentials.password
        })
        this.$root.setJWTForRequest(response.data.user, response.data.token) // we need to reset the JWT token for header of a request if not you will be notice `unauthenticated` even if you logged in successfully
        if (localStorage.getItem('jwt') != null) {
          if (this.$route.params.nextUrl != null) {
            this.$router.push(this.$route.params.nextUrl)
          } else {
            this.$router.push('/')
          }
        }
      } catch (e) {
        console.log(e)
        this.error = e.response.data
      }
    },
    closeError () {
      this.error = {}
    },
    onInputChanged () {
      this.credentials.username = this.credentials.username.replace(/\s/g, '')
      this.credentials.email = this.credentials.email.replace(/\s/g, '')
      this.credentials.password = this.credentials.password.replace(/\s/g, '')
    },
    onCheckboxChange () {
      if (this.isAgree) {
        this.error = {}
      }
    }
  }
}
</script>

<style>
.bg-default {
  height: 100vh;
}
</style>
