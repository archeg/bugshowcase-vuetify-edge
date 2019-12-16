<template>
    <v-app>
        <v-content>
            <v-container>
                {{value}}
                <v-btn @click="value += 1">Increase</v-btn>
            </v-container>
        </v-content>
    </v-app>
</template>
<script>
    import component from "./appScripts";
    export default component;
</script> 