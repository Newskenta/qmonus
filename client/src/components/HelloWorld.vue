<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img
          :src="require('../assets/logo.svg')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Qmonus GUI開発チュートリアル
        </h1>


        <p class="subheading font-weight-regular">
          チュートリアルの内容は下記を参照ください。
          <br>
          <a
            href="https://developer.qmonus.net/#/document/casval/top"
          >Tutorial page</a>
        </p>
      </v-col>
    </v-row>
    <v-row justify="center" class="ml-15">
      <v-col >
        <v-text-field
          v-model="url"
          label="Target URL"
          single-line dense
          variant="underlined"
          :rules="[required, limit_length]"
          counter="30"
        ></v-text-field>
      </v-col>
      <v-col cols=5>
        <v-btn height=50 @click=getHealthCheck()>GET HealthCheck</v-btn>
      </v-col>
    </v-row>
    <v-row class="text-center">
      <v-col>
        Status Code :
      </v-col>
      <v-col>
        {{res_code}}
      </v-col>
    </v-row>
      <v-row class="text-center">
      <v-col >
        Response Body :
      </v-col>
      <v-col >
        {{res_data}}
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: 'TOP',

  data: () => ({
    res_data : {},
    res_code: "",
    url: "",
    required: value => !!value || "必ず入力してください", // 入力必須の制約
    limit_length: value => value.length <= 30 || "30文字以内で入力してください" // 文字数の制約

  }),
  methods: {
    getHealthCheck: function () {
      this.$api.get(this.url, {
      })
        .then(response => {
          this.res_data = response.data
          this.res_code = response.status
        })
        .catch(err => {
          this.res_code = err.response.status
          console.error(err)
        })
    }
  }
}
</script>