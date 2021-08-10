<template>
  <div>
    <!-- Page content -->
    <div class="container-fluid mt--7">
      <!-- Table -->
      <div class="row">
        <div class="col">
          <div class="card bg-secondary shadow">
            <div class="card-body">
              <div class="row">
                <div class="col-md-12 btn-tabs">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="btn-recording">
                        <button
                          :class="mode === 'recording' ? 'btn-primary' : 'btn-secondary'"
                          class="btn"
                          style="width: 100%;"
                          @click="changeMode('recording')">
                          Recording
                        </button>
                      </div>

                    </div>
                    <div class="col-md-6">
                      <div class="btn-import">
                        <button
                          :class="mode === 'recording' ? 'btn-secondary' : 'btn-primary'"
                          class="btn"
                          style="width: 100%;"
                          @click="changeMode('import')">
                          Import audio
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="col-md-12 mt-5">
                  <div
                    v-if="error.length"
                    class="alert alert-danger"
                    role="alert">
                    The following error occured: <b>{{ error }}</b>
                  </div>
                </div>
                <div
                  v-if="!error.length"
                  class="col-md-12">
                  <div class="row">
                    <div
                      v-show="mode === 'recording'"
                      class="col-md-12">
                      <Record
                        :error="error"
                        @onError="onError" />
                    </div>
                    <div
                      v-show="mode === 'import'"
                      class="col-md-12">
                      <Import
                        :error="error"
                        @onError="onError"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Record from './Record'
import Import from './Import'
export default {
  components: {
    Record,
    Import
  },
  data () {
    return {
      error: '',
      mode: 'recording'
    }
  },
  async mounted () {
    await this.checkTokenExpired()
  },
  methods: {
    onError (value) {
      this.error = value
    },
    async checkTokenExpired () {
      try {
        await this.$http.post('/auth/token', {access_token: this.$store.state.user.accessToken})
      } catch (error) {
        this.error = error.response.data.message
      }
    },
    changeMode (mode) {
      if (mode !== this.mode && this.$store.state.isDoingASR) {
        alert('Stop doing speech recognition first!')
      } else {
        this.mode = mode
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-tabs {
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}

@media screen and (max-width: 768px) {
  .btn-tabs {
    .row>div:nth-child(1) {
      margin-bottom: 1rem;
    }
  }
}
</style>
