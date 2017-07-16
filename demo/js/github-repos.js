(function(){

    // Pad a number to 2 digits
    function pad (n) {
        return n < 10 ? '0' + n : n
    }

    // Template rendering
    //   render('this is a {{x}}', { x : 'test' }) => 'this is a test'
    function render (template, data) {
        return template.replace(/\{\{(\w+)\}\}/g, function(m, key){
            return data[key]
        })
    }

    // unique ID for jsonp callbacks
    var cid = 0
      , template = "<div class=\"github-box-header\">\n    <h3><a href=\"{{html_url}}\">{{name}}</a></h3>\n    <span class=\"github-stats badge\">\n        <a class=\"repo-stars\" href=\"{{html_url}}/stargazers\"><i class=\"fa fa-star\"></i> {{watchers}}</a>\n        <a class=\"repo-forks\" href=\"{{html_url}}/forks\"><i class=\"fa fa-code-fork\"></i> {{forks}}</a>\n    </span>\n</div>\n<div class=\"github-box-content\">\n    <p>{{description}}</p>\n</div>\n<div class=\"github-box-download\">\n    <p class=\"repo-update\">Latest commit on {{pushed_at}}</p>\n    <a class=\"btn grey darken-3 hide-on-small-only repo-download\" href=\"{{html_url}}\">Show on GitHub</a>\n</div>" // replaced with HTML template string on build

    // Private function to generate a jsonp callback
    // which deletes itself upon invocation
    function JSONPCallback (context, cb) {
        var name = 'GHWidgetLoaded' + ++cid
        window[name] = function(data){
            cb.call(context, data)
            delete window[name]
        }
        return name
    }

    // Widget constructor
    function Repo(repo, target){
        this.repo     = repo
        this.callback = JSONPCallback(this, this.ready)
        this.target   = target
    }

    // Load GitHub data
    Repo.prototype.load = function () {
        var cached, s
        // Attempt to get cached repo data
        if (window.sessionStorage && (cached = sessionStorage['gh-repos:'+this.repo])) {
            window[this.callback](JSON.parse(cached))
            return
        }
        s = document.createElement('script')
        s.async = true
        s.src = 'https://api.github.com/repos/' + this.repo + '?callback=' + this.callback
        document.body.appendChild(s)
    }

    // Receive data
    Repo.prototype.ready = function (results) {

        // Handle API failures
        if (results.meta.status >= 400 && results.data.message){
            console.warn(results.data.message)
            return
        }

        // Cache data
        if (window.sessionStorage) {
            sessionStorage['gh-repos:'+this.repo] = JSON.stringify(results)
        }

        var data      = results.data
          , pushed_at = new Date(data.pushed_at)
          , month     = pushed_at.getMonth() + 1
          , day       = pushed_at.getDate()
          , year      = pushed_at.getFullYear()

        data.pushed_at = year + '/' + pad(month) + '/' + pad(day)
        data.repo_url  = '//github.com/' + this.repo

        var box = document.createElement('div')
        box.className = 'github-box'
        box.innerHTML = render(template, data)

        this.target && this.target.parentNode.replaceChild(box, this.target)
        return box
    }

    // Main object.
    // GHRepos.create() receives a selector, for which each element will
    // be replaced with a github repo box
    var GHRepos = {
        create: function (selector) {
            var els   = document.querySelectorAll(selector)
              , items = Array.prototype.slice.call(els, 0)

            items.forEach(function(el){
                var repo = (el.dataset && el.dataset.repo) || el.href.split('/').slice(-2).join('/')
                new Repo(repo, el).load()
            })
        }
      , Repo: Repo
    }

    if (typeof exports !== 'undefined'){
        exports = GHRepos
    } else {
        window.GHRepos = GHRepos
    }

 })();
