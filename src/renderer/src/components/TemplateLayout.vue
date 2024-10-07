<template>
  <div class="dds-template-layout">
    <SideBar />
    <div class="dds-layout-content-layout">
      <div class="dds-layout-header-content">
        <ifx-search-field
          size="m"
          disabled="false"
          show-delete-icon="true"
        ></ifx-search-field>
        <div class="dds-layout-header-icons-container">
          <ifx-icon class="dds-header-icons" icon="image24"></ifx-icon>
          <ifx-icon class="dds-header-icons" icon="image24"></ifx-icon>
          <ifx-icon class="dds-header-icons" icon="image24"></ifx-icon>
          <ProfileIcon :userNameShort="userNameShort" :userName="userName" />
        </div>
      </div>
      <router-view :userName="userName"/>
    </div>
  </div>
 
</template>

<script>
import SideBar from "./SideBar.vue";
import ProfileIcon from "./ProfileIcon.vue";
import { onMounted, ref } from 'vue';
import { ShowToaster } from "./Toaster";
import MIAMI from '@miami/miami'

export default {
  name: 'TemplateLayout',
  setup() {
    const userName = ref("");
    const userNameShort = ref("");
    onMounted(() => {
          MIAMI.getTokenPayload()
          .then((payload) => {
              const {firstName, lastName} = payload || {};
              userName.value = `${firstName} ${lastName}`;
              userNameShort.value = firstName[0] + lastName[0];
          })
          .catch((error) => {
            ShowToaster(error.message)
          })
        })
    return {
      userName,
      userNameShort
    }
  },
  components: {
    SideBar,
    ProfileIcon
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .dds-template-layout {
    display: flex;
    .dds-layout-content-layout {
      width: 100%;
      margin-left: 265px;
      .dds-layout-header-content {
        display: flex;
        height: 30px;
        justify-content: space-between;
        margin: 10px 10px 10px 10px;
      }

      .dds-layout-header-icons-container {
        display: flex;

        .dds-header-profile-icon {
          margin: 0px 7px;
        }
      }

      .dds-header-icons {
        margin: 2px 5px;
        padding: 3px;
        cursor: pointer;
      }

      .dds-layout-search {
        width: 240px;
        height: 40px;
      }
    }
  }
</style>
