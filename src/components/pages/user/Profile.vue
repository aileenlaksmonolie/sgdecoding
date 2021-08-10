<template>
  <div>
    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col-xl-8">
          <div class="card bg-secondary shadow">
            <div class="card-header bg-white border-0">
              <div class="row align-items-center">
                <div class="col-md-8">
                  <h3 class="mb-0">My account</h3>
                </div>
              </div>
            </div>
            <div class="card-body">
              <form>
                <h6 class="heading-small text-muted mb-4">User information</h6>
                <div class="pl-lg-4">
                  <div class="row">
                    <div class="col-lg-6">
                      <div class="form-group focused">
                        <label
                          class="form-control-label"
                          for="input-username">Username</label>
                        <input
                          id="input-username"
                          :value="$store.state.user.username"
                          type="text"
                          class="form-control form-control-alternative"
                          placeholder="Username"
                          disabled>
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="form-group">
                        <label
                          class="form-control-label"
                          for="input-email">Email address</label>
                        <input
                          id="input-email"
                          :value="$store.state.user.email"
                          type="email"
                          class="form-control form-control-alternative"
                          placeholder="jesse@example.com"
                          disabled>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-6">
                      <div class="form-group focused">
                        <label
                          class="form-control-label"
                          for="input-user-role">Role</label>
                        <input
                          id="input-user-role"
                          :value="$store.state.user.role"
                          type="text"
                          class="form-control form-control-alternative"
                          placeholder="First name"
                          disabled>
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="form-group focused">
                        <label
                          class="form-control-label"
                          for="input-user-type">User type</label>
                        <input
                          id="input-user-type"
                          :value="$store.state.user.type"
                          type="text"
                          class="form-control form-control-alternative"
                          placeholder="User type"
                          disabled>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
