<template>
  <form class="ui form change-name" @submit.prevent="onChangeName">
    <input
      type="text"
      placeholder="Nombre y apellidos"
      v-model="name"
      :class="{ error: formError }"
    />
    <button type="submit" class="ui button primary" :class="{ loading }">
      Actualizar
    </button>
  </form>
</template>

<script>
//Importación de ref de vue
import { ref } from "vue";
//Importación de Yup
import * as Yup from "yup";
//Importación de auth de firebase
import { auth } from "../../utils/firebase.js";
//Importación de updateProfile de firebase
import { updateProfile } from "firebase/auth";
/*Importamos el useStore de vuex para poder acceder al
* store(aquí necesitamos el action de reloadUser)
*/
import { useStore } from "vuex";

export default {
  name: "ChangeName",
  setup() {
    //Definimos variables reactivas
    let name = ref("");
    let formError = ref(false);
    let loading = ref(false);
    /* Con esto ya podemos ejecutar el action */
    const store = useStore();
    //Esquema de validación
    const schemaForm = Yup.object().shape({
      name: Yup.string().min(6, true).required(true),
    });

    //Función para cambiar el nombre
    const onChangeName = async () => {
      formError.value = false;
      loading.value = true;

      try {
        await schemaForm.validate({ name: name.value }, { abortEarly: false });

        try {
          await updateProfile(auth.currentUser, {
            displayName: name.value,
          });
          //Ejecutamos el action de reloadUser
          store.dispatch("reloadUser");
        } catch (error) {
          console.log(error);
        }
      } catch (err) {
        err.inner.forEach((error) => {
          formError.value = error.message;
        });
      }
      loading.value = false;
      name.value = "";
    };
    return {
      name,
      onChangeName,
      formError,
      loading,
    };
  },
};
</script>

<style lang="scss" scoped>
.ui.form.change-name {
  text-align: center;

  input.error {
    border-color: #faaa;
    background-color: #ffeded;
  }

  .ui.button {
    margin: 20px 0 0 0;
  }
}
</style>
