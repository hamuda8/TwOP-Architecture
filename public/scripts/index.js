class TwOPCore {
    constructor() {
        this.state = window.__STATE__ || {};
        this.init();
    }

    init() {
        console.log("TwOP Architecture Initialized.");
        if (this.state.message) {
            console.log("Server says:", this.state.message);
        }
        this.bindEvents();
    }

    bindEvents() {
        // Attach DOM event listeners here
    }
}

// Initialize the app
window.App = new TwOPCore();