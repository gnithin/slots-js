//Assuming spacebar for now.
var KEYCODE = 32;
var image_list = [
    "images/1.jpg",
    "images/2.jpg",
    "images/7.jpg",
    "images/5.jpg"
];
var SCALE = 300;
var ids = [
    "#image-container-1",
    "#image-container-2",
    "#image-container-3"
];
var JACKPOT_IMAGE = "images/7.jpg";
//var TRIGGER_EVENT = "keydown";
var TRIGGER_EVENT = "click";
var MSG_CONTENT;

$(document).ready(init);

function init(){
    MSG_CONTENT = "START!!!";
    for(j=0;j<ids.length;j++){
        var temp_image_list = shuffle(image_list);
        var top = -1*(SCALE/2); //-150px
        for(i=0;i<image_list.length;i++){
            $(ids[j]).append("<img src=\""+ temp_image_list[i] +"\" class=\"slot-image\" style=\"position:absolute;top:" + top + "px;left:5px\"/>");
            top += SCALE;
        }
    }
    start();
}

function start(){
    //MSG_PROMPT.show();
    str_toast(MSG_CONTENT);
    $(document).bind(TRIGGER_EVENT, function(e){
        if(TRIGGER_EVENT == "keydown"){
            if(e.which == KEYCODE){
                e.preventDefault();
                $(this).unbind(TRIGGER_EVENT);
                //MSG_PROMPT.hide();
                stop_toast();
                main();
            }
        }else{
            //Mouse click
            $(this).unbind(TRIGGER_EVENT);
            stop_toast();
            main();
        }
    });
}

function main(){
    timeout = 300;
    var intervals_arr = [];
    for(i=0;i<ids.length;i++){
        intervals_arr.push(animate(ids[i] + " img" , timeout, ((Math.random()*10) > 5)?'+':'-'));
    }
    $(document).bind(TRIGGER_EVENT, function(e){
        if(TRIGGER_EVENT == "keydown"){
            if(e.which == KEYCODE){
                e.preventDefault();
                $(this).unbind(TRIGGER_EVENT);
                unanimate(intervals_arr);
                start();
            }
        }else{
            //Mouse click
            $(this).unbind(TRIGGER_EVENT);
            unanimate(intervals_arr);
            start();
        }
    });
}

function animate(id_handle, r_timeout, symbol){
    return setInterval(
        function(){
            $(id_handle).each(
                function(){
                    //log($(this).css('top'));
                    $(this).animate({
                            'top' : symbol + "=" + SCALE + "px" //300px
                        },
                        50,
                        function(){
                            if(symbol == "-"){
                                if(parseInt($(this).css('top').replace("px","")) < (-1*SCALE)){
                                    var cloned_ele = $(this).clone();
                                    var parent = $(this).parent();
                                    cloned_ele.css("top", SCALE*(image_list.length-1)-(SCALE/2)+"px"); //750px
                                    $(this).remove();
                                    parent.append(cloned_ele);
                                }
                            }else{
                                    if(parseInt($(this).css('top').replace("px","")) > (SCALE*(image_list.length-1))){
                                        var cloned_ele = $(this).clone();
                                        var parent = $(this).parent();
                                        cloned_ele.css("top", "-"+(SCALE/2)+"px"); //-150px
                                        $(this).remove();
                                        parent.append(cloned_ele);
                                    }
                            }
                            
                        }
                    )
                }
            )
        },
        r_timeout
    );
}

function unanimate(intervals){
    for(i=0;i<intervals.length;i++){
        clearInterval(intervals[i]);
    }
    var jackpot = false;
    var count = 0;
    for(var i=0;i<ids.length;i++){
        $(ids[i]).children().each(function(){
            //console.log($(this).attr("src") + " "+ $(this).css("top"));
            if(($(this).css("top") == "150px") && ($(this).attr("src") == JACKPOT_IMAGE)){
                count++;
                if(count == 3){
                    jackpot = true;
                }
            }
        });
    }
    if(jackpot == true){
        //TODO: Putup good message.
        console.log("Hooooooooo Jackpot!!!");
        MSG_CONTENT = "JACKPOT!!!";
    }else{
        console.log("Lost");
        MSG_CONTENT = "YOU LOST!!! PLAY AGAIN";
    }
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
    }
    return array;
}

function log(str){
    //console.log(str);
}

function toast(){
    $("#inner_toast").text(str).fadeIn(300).delay(3000).fadeOut(300);
}

function str_toast(str){
    $("#inner_toast").text(str).fadeIn(300);
}

function stop_toast(){
    $("#inner_toast").fadeOut(300);
}