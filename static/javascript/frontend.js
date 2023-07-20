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