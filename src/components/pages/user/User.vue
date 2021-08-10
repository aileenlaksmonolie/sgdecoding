<template>
  <div>
    <div class="container-fluid mt--7">
      <!-- Table -->
      <div class="row">
        <div class="col-md-8">
          <div class="card shadow">
            <div class="card-header border-0">
              <h3 class="mb-0">List users</h3>
            </div>
            <div class="table-responsive">
              <table class="table align-items-center table-flush">
                <thead class="thead-light">
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Role</th>
                    <th scope="col">Access Token</th>
                    <th scope="col">Scope</th>
                    <th scope="col">User type</th>
                    <th scope="col"/>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(user, index) in users"
                    :key="user._id">
                    <th
                      scope="row"
                      class="max-150px">
                      {{ user.username }}
                    </th>
                    <td class="max-200px">
                      {{ user.email }}
                    </td>
                    <td>
                      {{ user.role }}
                    </td>
                    <td class="max-300px">
                      <div class="input-group input-group-sm mb-4 mt-4">
                        <input
                          :id="`input-token-${index}`"
                          v-model="user.accessToken"
                          class="form-control form-control-sm"
                          type="text"
                          disabled>
                        <div class="input-group-append">
                          <span
                            class="input-group-text btn-copy tooltip-custom text-primary"
                            @click="copyToken(user, index)">
                            <i class="fal fa-clone"/>
                            <span class="tooltiptext">{{ user.copyText }}</span>
                          </span>
                        </div>
                        <div class="input-group-append">
                          <span
                            class="input-group-text btn-copy tooltip-custom text-success"
                            @click="refreshToken(user, index)">
                            <i class="fal fa-sync-alt"/>
                            <span class="tooltiptext">Refresh</span>
                          </span>
                        </div>
                        <div class="input-group-append">
                          <span
                            class="input-group-text btn-copy tooltip-custom text-danger"
                            @click="revokeToken(user, index)">
                            <i class="fal fa-trash-alt"/>
                            <span class="tooltiptext">Revoke</span>
                          </span>
                        </div>
                      </div>
                    </td>
                    <td v-if="$store.state.user._id !== user._id">
                      <div class="custom-control custom-checkbox mb-3">
                        <input
                          :checked="user.featuresCanUse.includes('online')"
                          :id="`checkbox-online-${index}`"
                          class="custom-control-input"
                          type="checkbox"
                          @change="changeFeature(user, index, 'online', $event)">
                        <label
                          :for="`checkbox-online-${index}`"
                          class="custom-control-label">Online</label>
                      </div>
                      <div class="custom-control custom-checkbox mb-3">
                        <input
                          :checked="user.featuresCanUse.includes('offline')"
                          :id="`checkbox-offline-${index}`"
                          class="custom-control-input"
                          type="checkbox"
                          @change="changeFeature(user, index, 'offline', $event)">
                        <label
                          :for="`checkbox-offline-${index}`"
                          class="custom-control-label">Offline</label>
                      </div>
                    </td>
                    <td v-else/>
                    <td>
                      <select
                        v-model="user.type"
                        class="form-control form-control-alternative"
                        @change="changeUserType(user, index)">
                        <option value="normal">Normal</option>
                        <option value="govtech">GovTech</option>
                      </select>
                    </td>
                    <td
                      v-if="$store.state.user._id !== user._id"
                      class="text-right">
                      <div class="dropdown">
                        <a
                          class="btn btn-sm btn-icon-only text-light"
                          href="#"
                          role="button"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false">
                          <i class="fas fa-ellipsis-v"/>
                        </a>
                        <div class="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
                          <a
                            class="dropdown-item"
                            href="#"
                            @click.prevent="showModalDeleteUser(user)">Delete</a>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="card-footer py-4">
              <nav aria-label="...">
                <ul class="pagination justify-content-end mb-0">
                  <li
                    :class="{'disabled': currentPage <= 1}"
                    class="page-item"
                    @click="changePage('first')">
                    <a
                      class="page-link">
                      <i class="fal fa-chevron-double-left"/>
                      <span class="sr-only">First</span>
                    </a>
                  </li>
                  <li
                    :class="{'disabled': currentPage <= 1}"
                    class="page-item"
                    @click="changePage('decrease')">
                    <a
                      class="page-link"
                      tabindex="-1">
                      <i
                        class="fal fa-angle-left"
                        style="font-size: 20px;" />
                      <span class="sr-only">Previous</span>
                    </a>
                  </li>
                  <li
                    v-for="n in listPages"
                    :key="`page-${n}`"
                    :class="{'active': currentPage === n}"
                    class="page-item"
                    @click="changePage(n)">
                    <a
                      class="page-link">{{ n }}</a>
                  </li>
                  <li
                    :class="{'disabled': currentPage === total}"
                    class="page-item"
                    @click="changePage('increase')">
                    <a
                      class="page-link">
                      <i
                        class="fal fa-angle-right"
                        style="font-size: 20px;" />
                      <span class="sr-only">Next</span>
                    </a>
                  </li>
                  <li
                    :class="{'disabled': currentPage === total}"
                    class="page-item"
                    @click="changePage('last')">
                    <a
                      class="page-link">
                      <i class="fal fa-chevron-double-right"/>
                      <span class="sr-only">Last</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card bg-secondary shadow">
            <div class="card-header bg-white border-0">
              <div class="row align-items-center">
                <div class="col-md-8">
                  <h3 class="mb-0">Create new user</h3>
                </div>
              </div>
            </div>
            <div class="card-body">
              <form>
                <div>
                  <div class="row">
                    <div class="col-lg-12">
                      <div class="form-group">
                        <label
                          class="form-control-label"
                          for="input-username">Username</label>
                        <input
                          id="input-username"
                          v-model="user.username"
                          name="username"
                          autocomplete="current-username"
                          type="text"
                          class="form-control form-control-alternative"
                          placeholder="Username">
                      </div>
                    </div>
                    <div class="col-lg-12">
                      <div class="form-group">
                        <label
                          class="form-control-label"
                          for="input-email">Email address</label>
                        <input
                          id="input-email"
                          v-model="user.email"
                          name="email"
                          autocomplete="current-email"
                          type="email"
                          class="form-control form-control-alternative"
                          placeholder="email@example.com">
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-12">
                      <div class="form-group">
                        <label
                          class="form-control-label"
                          for="input-password">Password</label>
                        <input
                          id="input-password"
                          v-model="user.password"
                          name="password"
                          autocomplete="current-password"
                          type="password"
                          class="form-control form-control-alternative">
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-12">
                      <div class="form-group">
                        <label
                          class="form-control-label"
                          for="input-role">Role</label>
                        <select
                          id="input-role"
                          v-model="user.role"
                          class="form-control form-control-alternative">
                          <option value="admin">admin</option>
                          <option value="user">user</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-12">
                      <div class="form-group">
                        <label
                          class="form-control-label"
                          for="input-type">User type</label>
                        <select
                          id="input-type"
                          v-model="user.type"
                          class="form-control form-control-alternative">
                          <option value="normal">Normal</option>
                          <option value="govtech">GovTech</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-12">
                      <div class="form-group">
                        <label
                          class="form-control-label"
                          for="input-role">Features can use</label>
                        <label class="form-control-label">(CTRL/CMD + Click to select multiple)</label>
                        <select
                          id="input-features"
                          v-model="user.featuresCanUse"
                          multiple
                          class="form-control form-control-alternative">
                          <option value="online">Online</option>
                          <option value="offline">Offline</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-12">
                      <div
                        v-if="error.message && error.message.length"
                        class="alert alert-danger alert-dismissible fade show mt-2"
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
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-12">
                      <button
                        class="btn btn-primary"
                        @click.prevent="createUser">
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      id="modalDeleteUser"
      class="modal fade"
      tabindex="-1"
      role="dialog"
      aria-labelledby="modalDeleteUserLabel"
      aria-hidden="true">
      <div
        class="modal-dialog modal-dialog-centered"
        role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5
              id="modalDeleteUserLabel"
              class="modal-title">Warning</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div>
              Are you sure want to delete user: <b>{{ selectedUser.username }} ({{ selectedUser.email }})</b>?
            </div>
            <div>
              The user's data will be removed permanently
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal">Close</button>
            <button
              type="button"
              class="btn btn-danger"
              @click="deleteUser">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      users: [],
      user: this.generateEmptyUser(),
      selectedUser: {},
      error: {},
      perPage: 0,
      currentPage: 0,
      total: 0
    }
  },
  computed: {
    listPages () {
      let arr = []
      if (this.total <= 3) {
        for (let i = 1; i <= this.total; i++) {
          arr.push(i)
        }
      } else {
        if (this.currentPage === this.total) { // if last page
          arr = [this.currentPage - 2, this.currentPage - 1, this.currentPage]
        } else if (this.currentPage === 1) { // if first page
          arr = [this.currentPage, this.currentPage + 1, this.currentPage + 2]
        } else {
          arr = [this.currentPage - 1, this.currentPage, this.currentPage + 1]
        }
      }

      return arr
    }
  },
  watch: {
    '$route' (to, from) {
      this.getUsers()
    }
  },
  async created () {
    await this.getUsers()
    this.generateEmptyUser()
  },
  methods: {
    changePage (value) {
      if (value === 'first') {
        this.currentPage = 1
      } else if (value === 'last') {
        this.currentPage = this.total
      } else if (value === 'decrease') {
        if (this.currentPage <= 1) {
          return
        }

        this.currentPage--
      } else if (value === 'increase') {
        if (this.currentPage === this.total) {
          return
        }

        this.currentPage++
      } else {
        this.currentPage = value
      }
      this.$router.push({ query: { page: this.currentPage } })
    },
    async getUsers () {
      try {
        const response = await this.$http.get(`/admin/users?page=${this.$route.query.page ? this.$route.query.page : 1}`)
        this.users = response.data.users.map(item => {
          return {
            ...item,
            copyText: 'Copy'
          }
        })
        this.perPage = response.data.perPage
        this.currentPage = response.data.currentPage
        this.total = response.data.total
      } catch (e) {
        this.error = e.response.data
        console.log(e)
      }
    },
    async createUser () {
      try {
        const response = await this.$http.post('/admin/users/register', {
          username: this.user.username,
          email: this.user.email,
          password: this.user.password,
          role: this.user.role,
          featuresCanUse: this.user.featuresCanUse,
          type: this.user.type
        })

        this.users.unshift({...response.data.user, copyText: 'Copy'})

        this.user = this.generateEmptyUser()
      } catch (e) {
        this.error = e.response.data
        console.log(e)
      }
    },
    showModalDeleteUser (user) {
      this.selectedUser = user
      // eslint-disable-next-line
      $('#modalDeleteUser').modal('show')
    },
    async deleteUser () {
      try {
        const response = await this.$http.delete(`/admin/users/${this.selectedUser._id}`)
        if (response.data.success) {
          const index = this.users.findIndex(item => item._id === this.selectedUser._id)
          this.users.splice(index, 1)
          // eslint-disable-next-line
          $('#modalDeleteUser').modal('hide')
        }
      } catch (e) {
        this.error = e.response.data
        console.log(e)
      }
    },
    generateEmptyUser () {
      return {
        username: '',
        email: '',
        password: '',
        role: 'user',
        featuresCanUse: [],
        type: 'normal'
      }
    },
    closeError () {
      this.error = ''
    },
    copyToken (user, index) {
      const copyText = document.getElementById('input-token-' + index)
      copyText.disabled = false
      /* Select the text field */
      copyText.select()

      /* Copy the text inside the text field */
      document.execCommand('copy')

      user.copyText = 'Copied'

      copyText.disabled = true

      setTimeout(() => {
        user.copyText = 'Copy'
      }, 3000)
    },
    async refreshToken (user, index) {
      try {
        const response = await this.$http.post('/admin/users/refreshToken', {userId: user._id})
        user.accessToken = 'Refreshing token...'
        setTimeout(() => {
          user.accessToken = response.data.accessToken
          if (user._id === this.$store.state.user._id) {
            const { accessToken, ...others } = this.$store.state.user
            this.$store.commit('SET_USER', {
              user: {
                ...others,
                accessToken: response.data.accessToken
              }
            })
          }
        }, 1500)
      } catch (e) {
        console.log(e)
      }
    },
    async revokeToken (user, index) {
      try {
        const response = await this.$http.post('/admin/users/revokeToken', {userId: user._id})
        user.accessToken = 'Revoking token...'
        setTimeout(() => {
          user.accessToken = response.data.accessToken

          if (user._id === this.$store.state.user._id) {
            const { accessToken, ...others } = this.$store.state.user
            this.$store.commit('SET_USER', {
              user: {
                ...others,
                accessToken: response.data.accessToken
              }
            })
          }
        }, 1500)
      } catch (e) {
        console.log(e)
      }
    },
    async changeFeature (user, index, type, event) {
      try {
        const featuresCanUse = [...user.featuresCanUse]
        if (event.target.checked) {
          featuresCanUse.push(type)
        } else {
          const index = featuresCanUse.findIndex(item => item === type)
          featuresCanUse.splice(index, 1)
        }

        await this.$http.put(`/admin/users/${user._id}`, {
          data: {
            featuresCanUse: featuresCanUse
          }
        })

        user.featuresCanUse = [...featuresCanUse]
        // NOTE: need to update in realtime
      } catch (error) {
        console.log(error)
      }
    },
    async changeUserType (user, index) {
      try {
        await this.$http.put(`/admin/users/${user._id}`, {
          data: {
            type: user.type
          }
        })

        this.$store.commit('SET_SERVER_STORAGE', { serverStorages: null })
        // NOTE: need to update in realtime
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss">
.btn-copy {
  cursor: pointer;
  &:hover {
    background: #e9ecef;
  }
}
.max-150px {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.max-200px {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.max-300px {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
