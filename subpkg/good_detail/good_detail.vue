<template>
    <view>
        {{good_id}}
    </view>
</template>

<script>
    export default {
        data() {
            return {
                good_id:null
            };
        },
        // onShow(options){
        //     console.log(options);
        // },
        onLoad(options){
            console.log("options:",options);
            this.good_id = options.good_id
        }
    }
</script>

<style lang="scss">

</style>
