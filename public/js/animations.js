function loading() {
    var style = document.createElement('style');
    style.type = 'text/css';
    var keyFrames = '\
    @keyframes spin {\
        to {\
            transform: rotate(360deg);\
        }\
    }';
    
    style.innerHTML = keyFrames.replace(/A_DYNAMIC_VALUE/g, "180deg");
    document.getElementsByTagName('head')[0].appendChild(style);
    
    var divTD = document.createElement('div');
    divTD.setAttribute('id','divTD')
    $(divTD).css('position','fixed');
    $(divTD).css('background-color', 'rgba(255, 255, 255, 0.35)');
    $(divTD).css('display', 'flex');
    $(divTD).css('flex-direction', 'column');
    $(divTD).css('align-items', 'center');
    $(divTD).css('justify-content', 'center');
    $(divTD).css('height', '100vh');
    $(divTD).css('width', '100%');
    $(divTD).css('top', '0');
    $(divTD).css('left', '0');
    $(divTD).css('z-index', '9999');

    var divSpin = document.createElement('div');
    divSpin.setAttribute('id','divSpin')
    $(divSpin).css('position', 'fixed');
    $(divSpin).css('width', '60px');
    $(divSpin).css('height', '60px');
    $(divSpin).css('border', '8px solid rgba(0, 0, 0, 0.2)');
    $(divSpin).css('border-left-color', '#22a6b3');
    $(divSpin).css('border-radius', '50%');
    $(divSpin).css('display', 'flex');
    $(divSpin).css('align-items', 'center');
    $(divSpin).css('justify-content', 'center');
    $(divSpin).css('width', '60px');
    $(divSpin).css('animation','spin .8s ease-in-out infinite');

    divTD.appendChild(divSpin);
    document.body.append(divTD);
}

$(document).ready(function(){
    loading();

    setTimeout(()=>{
        $('#divSpin').css('animation', '');
        $('#divTD').css('display','none');
    },1500);
});