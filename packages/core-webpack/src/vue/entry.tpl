import Vue from 'vue'
import { createApp } from $injectApp$
const inBrowser = typeof window !== 'undefined'
const isDev = process.env.NODE_ENV !== 'production'
const rootNode = '$rootNode$';
if(inBrowser){
  const { app, router, store={} } = createApp()
  
  // prime the store with server-initialized state.
  // the state is determined during SSR and inlined in the page markup.
  if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__)
  }
  
  // wait until router has resolved all async before hooks
  // and async components...
  if(router){
      // a global mixin that calls `asyncData` when a route component's params change
      Vue.mixin({
        beforeRouteUpdate (to, from, next) {
          const { asyncData } = this.$options
          if (asyncData) {
            asyncData({
              store: this.$store,
              route: to
            }).then(next).catch(next)
          } else {
            next()
          }
        }
      })
      router.onReady(() => {
      // Add router hook for handling asyncData.
      // Doing it after initial route is resolved so that we don't double-fetch
      // the data that we already have. Using router.beforeResolve() so that all
      // async components are resolved.
      router.beforeResolve((to, from, next) => {
        const matched = router.getMatchedComponents(to)
        const prevMatched = router.getMatchedComponents(from)
        let diffed = false
        const activated = matched.filter((c, i) => {
          return diffed || (diffed = (prevMatched[i] !== c))
        })
        const asyncDataHooks = activated.map(c => c.asyncData).filter(_ => _)
        if (!asyncDataHooks.length) {
          return next()
        }
        Promise.all(asyncDataHooks.map(hook => hook({ store, route: to })))
          .then(() => {
            bar.finish()
            next()
          })
          .catch(next)
      })
      // actually mount to DOM
      app.$mount(`#${rootNode}`)
    })
  }else{
    app.$mount(`#${rootNode}`)
  }
  
}
export default context => {
    return new Promise((resolve, reject) => {
      const s = isDev && Date.now()
      const { app, router, store } = createApp()
      if(router){
          const { url } = context
          const { fullPath } = router.resolve(url).route
      
          if (fullPath !== url) {
            return reject({ url: fullPath })
          }
      
          // set router's location
          router.push(url)
      
          // wait until router has resolved possible async hooks
          router.onReady(() => {
            const matchedComponents = router.getMatchedComponents()
            // no matched routes
            if (!matchedComponents.length) {
              return reject({ code: 404 })
            }
            // Call fetchData hooks on components matched by the route.
            // A preFetch hook dispatches a store action and returns a Promise,
            // which is resolved when the action is complete and store state has been
            // updated.
            Promise.all(matchedComponents.map(({ asyncData }) => asyncData && asyncData({
              store,
              route: router.currentRoute
            }))).then(() => {
              isDev && console.log(`data pre-fetch: ${Date.now() - s}ms`)
              // After all preFetch hooks are resolved, our store is now
              // filled with the state needed to render the app.
              // Expose the state on the render context, and let the request handler
              // inline the state in the HTML response. This allows the client-side
              // store to pick-up the server-side state without having to duplicate
              // the initial data fetching on the client.
              context.state = store.state
              resolve(app)
            }).catch(reject)
          }, reject)
      }else{
         resolve(app)
      }
    })
}
  