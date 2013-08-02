//"use strict";

$("#slide4button").click(CSVmotionHeat("div.modalheat4"));
$("#slide5button").click(CSVmotionHeat("div.modalheat5"));

var modalSurveyButton9 = $("#modalSurveyButton9"),
    ms9content = $("#ms9content").detach(),
    modalSurveyButton6 = $("#modalSurveyButton6");
            
modalSurveyButton9.click(function(){
    $("#ms9survey").detach();
    ms9content.appendTo("#ms9body")
    modalSurveyButton9.detach();
});
            
modalSurveyButton6.click(function(){
    $("#ms6survey").detach();
    CSVmotionHeat("div.heat6");
    modalSurveyButton6.detach();
});