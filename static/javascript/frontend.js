function toggleElementByID(elementID) {
    var element = document.getElementById(elementID)
    if (element.style.display === 'block') {
        element.style.display = 'none'
    } else {
        element.style.display = 'block'
    }
}

function toast(elementID, message) {
    var element = document.getElementById(elementID)
    element.innerHTML = message
}

function userLogout() {
    setCookie('user_uuid','',-1)
    setCookie('user_hash','',-1)
    window.location.href = getBaseURL()
}

function checkCookie(cookieName) {
    // Split all cookies into an array
    const cookies = document.cookie.split(';');
  
    // Loop through the cookies to find the one we're looking for
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === cookieName) {
        // The cookie exists
        return true;
      }
    }
  
    // The cookie was not found
    return false;
}

function getBaseURL() {
    const currentURL = window.location.href;
    const url = new URL(currentURL);
    const domainName = url.protocol + "//" + url.host + "/";
    return domainName;
    //const currentURL = window.location.href;
    //const lastSlashIndex = currentURL.lastIndexOf("/");
    //const baseURL = currentURL.substring(0, lastSlashIndex + 1);
    //console.log(baseURL);
    //return baseURL;
  }

function setCookie(name, value, expirationDays) {
    const date = new Date();
    date.setTime(date.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + "; SameSite=none;" + expires + "; path=/; Secure";
  }
  