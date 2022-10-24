<template>
    <view>
        {{query}}
    </view>
</template>

<script>
    export default {
        data() {
            return {
                query:null
            };
        },
        methods:{
            
        },
        onLoad(options) {
            console.log(options);
            this.query = options.query || options.cid
        }
    }
</script>

<style lang="scss">

</style>
