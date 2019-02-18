<template>
    <div>
        <slot>

        </slot>
    </div>
</template>
<script>
export default {
	name: 'dynamic',
	props:{
		
	},
	data(){
		return {
		}
	},
	methods:{
        async destroyUi(){
            this.$destroy(true);
            this.$el.parentNode.removeChild(this.$el)
            return
        }
    },
    beforeDestroy() {
        
    }
    
}
</script>
