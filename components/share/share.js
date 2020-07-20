
Component({
    properties: {
        title: String,
        description: String,
        num: Number,
        img: String,
    },
    methods: {
        handleWrong() {
            this.triggerEvent("sonEvent", {state: false} )
         }
        //  onShareAppMessage:function(){
        //     return{
        //     title:"转发给好友",
        //     imageUrl:"",
        //     path:"/pages/indexDetail/indexDetail"
        //     }
        // }
    }
    
});
