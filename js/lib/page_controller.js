class PageController {

    constructor(vue){
        this.vue = vue;
    }

    init(){

        var vue = this.vue;

        $.getJSON(
            'php/json/JsonHandler.php?api=page&data=pagedata'

        ).done(function (json) {

            //console.log(json.data.value);

            for(var dcnt=0;dcnt<json.data.value.length; dcnt++) {
                new vue(json.data.value[dcnt]);
            }

        });
    }
}