import {
  FileCallback,
  GhostOptions,
  MiddlewareHandler,
  PerRouteMiddleware,
  ProxyOptions,
  RewriteRules,
  ServerOptions,
  SnippetOptions,
  SocketOptions,
  UIOptions
} from 'browser-sync';
import * as chokidar from 'chokidar';

export interface Message {
  [key: string]: any;
}

export interface GulpLoadPlugins {
  [key: string]: any;
}

export interface BrowserSyncOptions {
  /**
   * Browsersync includes a user-interface that is accessed via a separate port.
   * The UI allows to controls all devices, push sync updates and much more.
   *
   * port - Default: 3001
   * weinre.port - Default: 8080
   * Note: requires at least version 2.0.0
   */
  ui?: UIOptions | boolean;
  /**
   * Browsersync can watch your files as you work.
   * Changes you make will either be injected into the page (CSS & images) or
   * will cause all browsers to do a full-page refresh. See anymatch for more information on glob
   * patterns.
   * Default: false
   */
  files?: string | (string | FileCallback)[];
  /**
   * Specify which file events to respond to.
   * Available events: add, change, unlink, addDir, unlinkDir
   * Default: ['change']
   * Note: requires at least version 2.18.8
   */
  watchEvents?: string[];
  /**
   * File watching options that get passed along to Chokidar. Check their docs for available options
   * Default: undefined
   * Note: requires at least version 2.6.0
   */
  watchOptions?: chokidar.WatchOptions;
  /**
   * Use the built-in static server for basic HTML/JS/CSS websites.
   * Default: false
   */
  server?: ServerOptions;
  /**
   * Proxy an EXISTING vhost. Browsersync will wrap your vhost with a proxy URL to view your site.
   * target - Default: undefined
   * ws - Default: undefined
   * middleware - Default: undefined
   * reqHeaders - Default: undefined
   * proxyRes - Default: undefined
   * proxyReq - Default: undefined
   */
  proxy?: string | boolean | ProxyOptions;
  /**
   * Use a specific port (instead of the one auto-detected by Browsersync)
   * Default: 3000
   */
  port?: number;
  /**
   * Add additional directories from which static files should be served.
   * Should only be used in proxy or snippet mode.
   * Default: []
   * Note: requires at least version 2.8.0
   */
  serveStatic?: string[];
  /**
   * Enable https for localhost development.
   * Note - this is not needed for proxy option as it will be inferred from your target url.
   * Note: requires at least version 1.3.0
   */
  https?: boolean;
  /**
   * Clicks, Scrolls & Form inputs on any device will be mirrored to all others.
   * clicks - Default: true
   * scroll - Default: true
   * forms - Default: true
   */
  ghostMode?: GhostOptions | boolean;
  /**
   * Can be either "info", "debug", "warn", or "silent"
   * Default: info
   */
  logLevel?: string;
  /**
   * Change the console logging prefix.
   * Useful if you're creating your own project based on Browsersync
   * Default: BS
   * Note: requires at least version 1.5.1
   */
  logPrefix?: string;
  /**
   * Whether or not to log connections
   * Default: false
   */
  logConnections?: boolean;
  /**
   * Whether or not to log information about changed files
   * Default: false
   */
  logFileChanges?: boolean;
  /**
   * Log the snippet to the console when you're in snippet mode (no proxy/server)
   * Default: true
   * Note: requires at least version 1.5.2
   */
  logSnippet?: boolean;
  /**
   * You can control how the snippet is injected onto each page via a custom regex + function.
   * You can also provide patterns for certain urls that should be ignored from
   * the snippet injection.
   * Note: requires at least version 2.0.0
   */
  snippetOptions?: SnippetOptions;
  /**
   * Add additional HTML rewriting rules.
   * Default: false
   * Note: requires at least version 2.4.0
   */
  rewriteRules?: boolean | RewriteRules[];
  /**
   * Tunnel the Browsersync server through a random Public URL
   * Default: null
   */
  tunnel?: string | boolean;
  /**
   * Some features of Browsersync (such as xip & tunnel) require an internet connection,
   * but if you're working offline, you can reduce start-up time by setting this option to false
   */
  online?: boolean;
  /**
   * Default: true
   * Decide which URL to open automatically when Browsersync starts.
   * Defaults to "local" if none set.
   * Can be true, local, external, ui, ui-external, tunnel or false
   */
  open?: string | boolean;
  /**
   * The browser(s) to open
   * Default: default
   */
  browser?: string | string[];
  /**
   * Add HTTP access control (CORS) headers to assets served by Browsersync.
   * Default: false
   * Note: requires at least version 2.16.0
   */
  cors?: boolean;
  /**
   * Requires an internet connection - useful for services such as Typekit
   * as it allows you to configuredomains such as *.xip.io in your kit settings
   * Default: false
   */
  xip?: boolean;
  /**
   * Reload each browser when Browsersync is restarted.
   * Default: false
   */
  reloadOnRestart?: boolean;
  /**
   * The small pop-over notifications in the browser are not always needed/wanted.
   * Default: true
   */
  notify?: boolean;
  /**
   * scrollProportionally: false // Sync viewports to TOP position
   * Default: true
   */
  scrollProportionally?: boolean;
  /**
   * How often to send scroll events
   * Default: 0
   */
  scrollThrottle?: number;
  /**
   * Decide which technique should be used to restore scroll position following a reload.
   * Can be window.name or cookie
   * Default: 'window.name'
   */
  scrollRestoreTechnique?: string;
  /**
   * Sync the scroll position of any element on the page. Add any amount of CSS selectors
   * Default: []
   * Note: requires at least version 2.9.0
   */
  scrollElements?: string[];
  /**
   * Default: []
   * Note: requires at least version 2.9.0
   * Sync the scroll position of any element on the page - where any scrolled element will cause
   * all others to match scroll position. This is helpful when a breakpoint alters which element
   * is actually scrolling
   */
  scrollElementMapping?: string[];
  /**
   * Time, in milliseconds, to wait before instructing the browser to reload/inject following a file
   * change event
   * Default: 0
   */
  reloadDelay?: number;
  /**
   * Restrict the frequency in which browser:reload events can be emitted to connected clients
   * Default: 0
   * Note: requires at least version 2.6.0
   */
  reloadDebounce?: number;
  /**
   * User provided plugins
   * Default: []
   * Note: requires at least version 2.6.0
   */
  plugins?: any[];
  /**
   * Whether to inject changes (rather than a page refresh)
   * Default: true
   */
  injectChanges?: boolean;
  /**
   * The initial path to load
   */
  startPath?: string;
  /**
   * Whether to minify the client script
   * Default: true
   */
  minify?: boolean;
  /**
   * Override host detection if you know the correct IP to use
   */
  host?: string;
  /**
   * Send file-change events to the browser
   * Default: true
   */
  codeSync?: boolean;
  /**
   * Append timestamps to injected files
   * Default: true
   */
  timestamps?: boolean;
  /**
   * Alter the script path for complete control over where the Browsersync Javascript is served
   * from. Whatever you return from this function will be used as the script path.
   * Note: requires at least version 1.5.0
   */
  scriptPath?: (path: string) => string;
  /**
   * Configure the Socket.IO path and namespace & domain to avoid collisions.
   * path - Default: "/browser-sync/socket.io"
   * clientPath - Default: "/browser-sync"
   * namespace - Default: "/browser-sync"
   * domain - Default: undefined
   * port - Default: undefined
   * clients.heartbeatTimeout - Default: 5000
   * Note: requires at least version 1.6.2
   */
  socket?: SocketOptions;
  middleware?: MiddlewareHandler | PerRouteMiddleware | (MiddlewareHandler | PerRouteMiddleware)[];
}
