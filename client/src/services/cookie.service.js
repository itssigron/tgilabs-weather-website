export function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
}

export function setCookie(name, value, days) {
    var expires = "";

    if (days) {
        var date = new Date();
        date.setDate(date.getDate() + days);
        expires = "; expires=" + date.toUTCString();
    }

    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

export function deleteCookie(name) {
    setCookie(name, "", -1);
}