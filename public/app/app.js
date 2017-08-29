Vue.component('tasklist',{
    template: '<ul><li v-for="(task,index) in data" v-if="check(task.status)">\
    <status v-bind:status.sync="task.status"></status> | {{task.task}} | {{task.contact}} | \
    <taskAction v-bind:status="task.status" v-on:change="changeStatus(index)"></taskAction>\
    <taskTime v-bind:status="task.status" :startTime="task.startTime" :endTime="task.endTime"></taskTime>\
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
    template: '<a v-bind:class="status" v-if="status == \'onStart\'" >New</a><a v-bind:class="status" v-else-if="status == \'onProcess\'">In process</a><a v-bind:class="status" v-else-if="status == \'onDone\'"">Completed</a>'
})

Vue.component('taskAction',{
    props: {
        status: String
    },
    template: '<a v-bind:class="status"  v-if="status == \'onStart\'" v-on:click="changeStatus">Взяти</a><a v-bind:class="status" v-else-if="status == \'onProcess\'" v-on:click="changeStatus">Завершити</a><a v-bind:class="status" v-else-if="status == \'onDone\'">Завершено</a>',
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
    template: '<div v-if="status == \'onProcess\'">{{start}}</div><div v-else-if="status == \'onDone\'">{{start}} - {{end}}</div>',
    computed: {
        start: function() {
            return this.startTime.getDate()+"." + (this.startTime.getMonth()+1)+ "." + this.startTime.getFullYear();
        },
        end: function() {
            return this.endTime.getDate()+"." + (this.endTime.getMonth()+1)+ "." + this.endTime.getFullYear();
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
            (this.obj.task != '' && this.obj.contact != '') ? this.data.push(this.obj) : console.log("bad fields");
            this.$emit('close');
        }
    }
  })


Vue.component('statusfilter',{
    data:function () {
        return {filter: []}
    },
    template: '<div><input type="checkbox" @change="update" id="onStart" value="onStart" v-model="filter">\
    <label for="onStart">New</label>\
    <input type="checkbox" @change="update" id="onProcess" value="onProcess" v-model="filter">\
    <label for="onProcess">Processing</label>\
    <input type="checkbox" @change="update" id="onDone" value="onDone" v-model="filter">\
    <label for="onDone">Done</label></div>',
    methods: {
        update: function() {
            this.$emit('updatefilter',this.filter);
        }
    }
})


var app = new Vue({
    el:'#app',
    data: {
        message: 'Hello Vue!',
        taskList: typeof(list) != "undefined" ? list : [],
        showModal: false,
        filter: []
    },
    methods:{
        updateFilter: function(val) {
            this.filter = val;
        }
    }
})