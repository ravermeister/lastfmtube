class DefaultLibVue {

    constructor(page) {
        this.page = page;
        this.Vue = page.Vue;
    }


    isUndefined(val) {
        return (typeof val === 'undefined') ? true : false;
    }

    updateData(json) {
        for (let key in this.$data) {            
            if (json.hasOwnProperty(key)) {                
                this.$data[key] = json[key];
            }
        }
    }

}