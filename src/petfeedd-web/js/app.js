var Settings = { template: '<div></div>' }

var t = new Date();
var DefaultFeed = {
    id: 0,
    time: t.getHours() + ":" + t.getMinutes(),
    name: "",
    size: 0,
    last_feed: 0,
    feed_count: 0
};

var messageBus = new Vue();

var Home = Vue.component('home', {
    template: '#home',
    data: function() {
        return {
            events: [],
            status: {}
        }
    },
    created: function() {
        this.fetchData();
        this.fetchStatus();
    },
    methods: {
        feedNow() {
            this.$http.post('/api/feed').then(function() {
                this.fetchData();
            });
        },
        startOrPause(event) {
            var feeding = this.status.feeding;
            if (feeding) {
                this.$http.post('/api/pause').then(function() {
                    event.target.innerHTML = "Start";
                    this.fetchStatus();
                });
            } else {
                this.$http.post('/api/start').then(function() {
                    event.target.innerHTML = "Pause";
                    this.fetchStatus();
                });
            }
        },
        fetchData() {
            this.$http.get('/api/events').then(function(response) {
                this.events = response.body;
            });
        },
        fetchStatus() {
            this.$http.get('/api/status').then(function(response) {
                this.status = response.body;
            });
        }
    }
});

var Routing = Vue.component('routing', {
    template: '#routing',
    computed: {
        routes: function () {
            var routes = [];
            for (var i in this.$router.options.routes) {
                if (!this.$router.options.routes.hasOwnProperty(i)) {
                    continue
                }
                var route = this.$router.options.routes[i];
                if (route.hasOwnProperty('title')) {
                    routes.push(route);
                }
            }
            return routes;
        }
    }
});

var Feed = Vue.component('feed', {
    template: '#feed',
    props: ["feed"],
    data: function() {
        return {
            feed: DefaultFeed
        };
    },
    watch: {
        'feed': {
            handler: function(newFeed) {
                if (newFeed.id > 0) {
                    this.$http.post('/api/feeds/' + newFeed.id, this.feed)
                } else {
                    this.$http.post('/api/feeds', this.feed).then(function(newFeed) {
                        this.feed = response.body;
                    });
                }
            },
            deep: true
        }
    },
    methods:  {
        deleteFeed: function() {
            this.$http.delete('/api/feeds/' + this.feed.id).then(function() {
                messageBus.$emit('feed-deleted');
            })
        }
    }
});

var Feeds = Vue.component('feeds', {
    template: '#feeds',
    data: function() {
        return {
            feeds: []
        }
    },
    created: function() {
        messageBus.$on('feed-deleted', this.fetchData);
        this.fetchData();
    },
    methods: {
        fetchData() {
            this.$http.get('/api/feeds').then(function(response) {
                this.feeds = response.body;
            });
        },
        addFeed() {
            this.$http.post('/api/feeds', DefaultFeed).then(function() {
                this.fetchData();
            })
        }
    }
});

var routes = [
    { path: '/', component: Home, title: 'Home' },
    { path: '/feeds', component: Feeds, title: 'Schedule' },
    { path: '/settings', component: Settings, title: 'Settings' },
];

var router = new VueRouter({
    routes
});

var app = new Vue({
    el: '#app',
    router: router
});
