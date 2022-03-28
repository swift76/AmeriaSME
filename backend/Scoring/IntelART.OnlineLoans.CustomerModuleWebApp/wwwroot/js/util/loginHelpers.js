function numInputKeydown(e) {
    // Allow: backspace, delete, tab, escape, enter
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13,  190]) !== -1 ||
         // Allow: Ctrl+A, Command+A
        (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
        // Allow: Ctrl+V, Command+V
        (e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true)) ||
        // Allow: Ctrl+C, Command+C
        (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true)) ||
         // Allow: home, end, left, right, down, up
        (e.keyCode >= 35 && e.keyCode <= 40)) {
             // let it happen, don't do anything
             return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
    }
}

function numInputChange(event) {
    // When user select text in the document, also abort.
    var selection = window.getSelection().toString();
    if ( selection !== '' ) {
        return;
    }
    // When the arrow keys are pressed, abort.
    if ( $.inArray( event.keyCode, [38,40,37,39] ) !== -1 ) {
        return;
    }
    var $this = $( this );
    // Get the value.
    var input = $this.val();
    var input = input.replace(/[\D\s\._\-]+/g, "");
    $this.val(input);
}

function numInputPaste(event) {
    var selection = window.getSelection().toString();
    if ( selection !== '' ) {
        return;
    }
    // When the arrow keys are pressed, abort.
    if ( $.inArray( event.keyCode, [38,40,37,39] ) !== -1 ) {
        return;
    }
    var $this = $( this );
    // Get the value.
    setTimeout( function() {
        var input = $this.val();
        var input = input.replace(/[\D\s\._\-]+/g, "");
        $this.val(input);
    }, 100);
}

function englishLettersInput(e) {
    // Allow: backspace, delete, tab, escape, enter
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
        // Allow: Ctrl+A, Command+A
        (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
        // Allow: Ctrl+V, Command+V
        (e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true)) ||
        // Allow: Ctrl+C, Command+C
        (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true)) ||
        // Allow: home, end, left, right, down, up
        (e.keyCode >= 35 && e.keyCode <= 40)) {
        // let it happen, don't do anything
        return;
    }
    // Ensure that it is an English letter, and symbol except "" and <>, and stop the keypress
    var regex = new RegExp("^[a-zA-Z0-9._# -=!@#$%^&*()+|}{:;'/,?]*$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (!regex.test(str)) {
        e.preventDefault();
    }
}

function englishLettersInputChange(event) {
    // When user select text in the document, also abort.
    var selection = window.getSelection().toString();
    if (selection !== '') {
        return;
    }
    // When the arrow keys are pressed, abort.
    if ($.inArray(event.keyCode, [38, 40, 37, 39]) !== -1) {
        return;
    }
    var $this = $(this);
    // Get the value.
    var input = $this.val();
    var input = input.replace(/[^a-zA-Z0-9._# -=!@#$%^&*()+|}{:;'/,?]/g, "");
    $this.val(input);
}

function englishLettersInputPaste(event) {
    var selection = window.getSelection().toString();
    if (selection !== '') {
        return;
    }
    // When the arrow keys are pressed, abort.
    if ($.inArray(event.keyCode, [38, 40, 37, 39]) !== -1) {
        return;
    }
    var $this = $(this);
    // Get the value.
    setTimeout(function () {
        var input = $this.val();
        var input = input.replace(/[^a-zA-Z0-9._# -=!@#$%^&*()+|}{:;'/,?]/g, "");
        $this.val(input);
    }, 100);

}

$(document).ready(function () {
    $("#registerTIN, #registerPhone, #registerAuthenticationCode, #userName").keydown(numInputKeydown);
    $("#registerTIN, #registerPhone, #registerAuthenticationCode, #userName").bind('keyup change', numInputChange);
    $("#registerTIN, #registerPhone, #registerAuthenticationCode, #userName").bind('paste', numInputPaste);
    $("#registerCompanyName").keypress(englishLettersInput);
    $("#registerCompanyName").bind('keyup change', englishLettersInputChange);
    $("#registerCompanyName").bind('paste', englishLettersInputPaste);
});