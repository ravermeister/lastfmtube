class DefaultLibVue {
    constructor(Vue) {
        this.Vue = Vue;
        this.isReady = false;
    }

    update(json) {
        if(!this.isReady) {
            this.isReady = this.doInit(json);
            return;
        }
        
        this.doUpdate(json)
    }
    
    
    
    doInit() {}
    doUpdate(json) {}
}