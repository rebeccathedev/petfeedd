<template>
  <form-wizard>
    <tab-content title="Personal details">
      My first tab content
    </tab-content>
    <tab-content title="Additional Info">
        My second tab content
    </tab-content>
    <tab-content title="Last step">
      Yuhuuu! This seems pretty damn simple
    </tab-content>
  </form-wizard>
</template>

<script>
import {FormWizard, TabContent} from 'vue-form-wizard';
import 'vue-form-wizard/dist/vue-form-wizard.min.css';

export default {
  components: {
    FormWizard,
    TabContent
  }
}
</script>

<style>

</style>
