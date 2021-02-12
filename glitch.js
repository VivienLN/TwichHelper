// Glitch effect
function glitchify(element) {
    var text = element.innerHTML;
    element.innerHTML = '';   
    element.append(createGlitchChild('glitch-main', text));
    element.append(createGlitchChild('glitch-fx glitch-left', text));
    element.append(createGlitchChild('glitch-fx glitch-right', text));
    element.append(createGlitchChild('glitch-fx glitch-cut', text));
}

function createGlitchChild(className, text) {
    var element = document.createElement('div');
    element.className = className;
    element.innerHTML = text;
    return element;
}

// Read text (Totally not copied/pasted from StackOverflow)
function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                alert(allText);
            }
        }
    }
    rawFile.send(null);
}