<template>
  <BasicLayout>
    <div class="payrolls">
      <h1>Mis nóminas</h1>
      <UploadPayroll :getPayrolls="getPayrolls"/>
      <PayrollList :payrolls="payrolls" :getPayrolls="getPayrolls"/>
    </div>
  </BasicLayout>
</template>
<script>
import { ref, onMounted } from "vue";
import {
  auth,
  db,
  collection,
  getDocs,
  query,
  orderBy,
} from "../utils/firebase";

import BasicLayout from "../layouts/BasicLayout.vue";
import UploadPayroll from "../components/Payrolls/UploadPayroll.vue";
import PayrollList from "../components/Payrolls/PayrollList.vue";

export default {
  name: "Payrolls",
  components: {
    BasicLayout,
    UploadPayroll,
    PayrollList,
  },
  setup() {
    let payrolls = ref(null);

    /* Cuando se monta el componente se ejecuta lo que esté dentro */
    onMounted(() => {
      getPayrolls();
    });

    /* Función para obtener las nóminas */
    const getPayrolls = async () => {
      const userID = auth.currentUser.uid;

      const querySnapshot = await getDocs(
        query(collection(db, userID), orderBy("date", "desc"))
      );

      const result = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        data.id = doc.id;//Añadimos el id del documento para poder interactuar sobre ellos en la base de datos
        result.push(data);
      });
      payrolls.value = result;
    };

    return {
      payrolls,
      getPayrolls,
    };
  },
};
</script>

<style lang="scss" scoped>
.payrolls {
  margin: 50px 0;
  text-align: center;
}
</style>