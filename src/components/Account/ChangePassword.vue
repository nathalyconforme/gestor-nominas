<template>
  <form class="ui form change-password" @submit.prevent="onChangePassword">
    <div class="three fields">
      <div class="field">
        <input
          type="password"
          placeholder="Contraseña actual"
          v-model="formData.password"
          :class="{ error: formError.password }"
        />
      </div>
      <div class="field">
        <input
          type="password"
          placeholder="Nueva contraseña"
          v-model="formData.newPassword"
          :class="{ error: formError.newPassword }"
        />
      </div>
      <div class="field">
        <input
          type="password"
          placeholder="Repite la nueva contraseña"
          v-model="formData.newPasswordRepeat"
          :class="{ error: formError.newPasswordRepeat }"
        />
      </div>
    </div>
    <p v-if="messageError">{{ messageError }}</p>
    <button class="ui button primary" :class="{ loading }" type="submit">
      Actualizar
    </button>
  </form>
</template>

<script>
import * as Yup from "yup";
import { ref } from "vue";
import {reauthenticate} from "../../utils/firebaseFunctions";
import {auth, updatePassword} from "../../utils/firebase";

export default {
  name: "ChangePassword",
  setup() {
    let formData = {};
    let formError = ref({});
    let loading = ref(false);
    let messageError = ref("");

    const schemaForm = Yup.object().shape({
      password: Yup.string().required(true),
      newPassword: Yup.string().required(),
      newPasswordRepeat: Yup.string()
        .required(true)
        .oneOf(
          [Yup.ref("newPassword")],
          true
        ) /* El valor va a ser igual a newPassword */,
    });

    const onChangePassword = async () => {
      formError.value = {};
      messageError.value = "";
      loading.value = true;

      try {
        await schemaForm.validate(formData, {
          abortEarly: false,
        });
        try {
          const { password, newPassword} = formData;
          await reauthenticate(password);
          await updatePassword(auth.currentUser, newPassword);
          auth.signOut();
        } catch (error) {
          console.log(error);
          messageError.value = error.message; /* error.response.data.message; */
        }
      } catch (err) {
        err.inner.forEach((error) => {
          formError.value[error.path] = error.message;
        });
      }
      loading.value = false;
    };
    return {
      formData,
      onChangePassword,
      formError,
      loading,
      messageError,
    };
  },
};
</script>

<style lang="scss" scoped>
.ui.form.change-password {
  text-align: center;

  input.error {
    border-color: #faaa;
    background-color: #ffeded;
  }
}
</style>
