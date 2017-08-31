var socket = io({
    autoConnect: true
  });
Vue.component('tasklist',{
    template: '<ul class="tasklist"><li v-for="(task,index) in data" v-if="check(task.status)">\
    <div class="user"><label>Користувач</label></div><status v-bind:status.sync="task.status"><taskTime v-bind:status="task.status" :startTime="task.startTime" :endTime="task.endTime"></taskTime></status><div class="task"><label>Задача</label><p>{{task.task}}</p></div>\
    <div class="contact"><label>Контакти</label><p>{{task.contact}}</p></div>\
    <taskAction v-bind:status="task.status" v-on:change="changeStatus(index)"></taskAction>\
    \
    </li></ul>',
    props: {
        data: Array,
        filter: Array
    },
    methods: {
        remove: function(e) {
            this.data.splice(e,1);
        },
        changeStatus: function(id) {
            this.data[id].status == "onStart" ? (this.data[id].status = "onProcess",this.data[id].startTime = new Date()) : (this.data[id].status = "onDone",this.data[id].endTime = new Date());
            socket.emit("new status",{id:id,status:this.data[id].status});
        },
        addTask: function(obj) {
            this.data.push(obj);
        },
        check: function(status) {
            if (this.filter.length == 0) return true; else {
                let res = false;
                this.filter.forEach(e=>{
                    if (status == e) res = true;
                })
                return res;
            }
        }
    }
})

Vue.component('status',{
    props: {
        status: String
    },
    template: '<div class="status"><label>Статус</label><span v-bind:class="status" v-if="status == \'onStart\'" >New</span><span v-bind:class="status" v-else-if="status == \'onProcess\'">In process</span><span v-bind:class="status" v-else-if="status == \'onDone\'"">Completed</span><slot></slot></div>'
})

Vue.component('taskAction',{
    props: {
        status: String
    },
    template: '<div class="taskAction"><a v-bind:class="status"  v-if="status == \'onStart\'" v-on:click="changeStatus">Взяти</a><a v-bind:class="status" v-else-if="status == \'onProcess\'" v-on:click="changeStatus">Завершити</a><a v-bind:class="status" v-else-if="status == \'onDone\'">Завершено</a></div>',
    methods: {
        changeStatus: function() {
            this.$emit('change');
        }
    }
})

Vue.component('taskTime',{
    props: {
        startTime: Date,
        endTime: Date,
        status: String
    },
    template: '<div v-if="start != null && end == null">{{start}}</div><div v-else-if="start != null && end != null">{{start}} - {{end}}</div>',
    computed: { // -------------- dorobutu logiky !!!!
        start: function() {
            if (this.startTime !=  undefined) {
                if (this.startTime.getDate() == new Date().getDate() && this.startTime.getMonth() == new Date().getMonth()) {
                    return this.startTime.getHours()+":"+this.startTime.getMinutes();
                } else {
                    return this.startTime.getDate()+"." + (this.startTime.getMonth()+1);
                }
            } else {
                return null;
            }
        },
        end: function() {
            if (this.endTime !=  undefined) {
                if (this.endTime.getDate() ==this.endTime.getDate() && this.endTime.getMonth() == this.startTime.getMonth()) {
                    return this.endTime.getHours()+":"+this.endTime.getMinutes();
                } else {
                    return null;
                }
            } else {
                return null;
            }
            //return this.endTime.getDate()+"." + (this.endTime.getMonth()+1)+ "." + this.endTime.getFullYear();
        }
    }
})

Vue.component('modal', {
    template: '#modal-template',
    props: {
        data: Array
    },
    data: function() {
        return {obj:{
            status: "onStart",
            task: "",
            contact: ""}}
    },
    methods: {
        submit: function() {
            (this.obj.task != '' && this.obj.contact != '') ? (this.data.push(this.obj),socket.emit('new task',this.obj)) : console.log("bad fields");
            this.$emit('close');
        },
        close: function(e) {
            this.$emit('close');
        }
    }
  })


Vue.component('statusfilter',{
    data:function () {
        return {
            filter: [],
            toggle: "true"
        }
    },
    template: '<div class="statusfilter"><div><input type="checkbox" @change="update" id="onStart" value="onStart" v-model="filter">\
    <label for="onStart">New</label></div><div>\
    <input type="checkbox" @change="update" id="onProcess" value="onProcess" v-model="filter">\
    <label for="onProcess">Processing</label></div><div>\
    <input type="checkbox" @change="update" id="onDone" value="onDone" v-model="filter">\
    <label for="onDone">Done</label></div><div>\
    <input type="checkbox" @click="clear" id="all" v-model="toggle" v-bind:true-value="true" v-bind:false-value="false">\
    <label for="all" style="margin-left:25px;">Всі</label>\
    </div></div>',
    methods: {
        update: function() {
            this.$emit('updatefilter',this.filter);
        },
        clear: function() {
            this.toggle == true ? this.$emit('updatefilter',[]) : console.log("rty");
            this.filter = [];
        }
    },
    watch: {
        filter: function(e) {
            if (e.length == 0) {
                this.toggle = true; 
            }
            else {
                this.toggle = false;
            }
        }
    }
})


var app = new Vue({
    el:'#app',
    data: {
        message: 'Hello Vue!',
        taskList: [],
        showModal: false,
        filter: []
    },
    methods:{
        updateFilter: function(val) {
            this.filter = val;
        },
        getList: function(val) {
            console.log(val);
        }
    },
    watch:{
        taskList: function(newVal){
            console.log(newVal);
        }
    },
    created:function(){
        socket.on('connect',()=>{
            // socket.emit('new task',{contact:"dsasadsa",status:"onStart",task:"dfadsasad"})
            socket.emit('get list',socket.id);
        })        
    }
})

socket.on('get list', function(list){
    app.taskList = list;
  });
socket.on('new task', function(task){
    app.taskList.push(task);
})
socket.on('new status', function(obj){
    app.taskList[obj.id].status = obj.status;
})